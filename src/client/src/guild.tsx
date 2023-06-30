import React, { useState, useEffect } from 'react'
import * as ChartGeo from "chartjs-chart-geo";
import { useParams } from "react-router-dom";
import { errorToast } from './toasts';
import NavBar from './nav-bar';
import Map from "./map"
import ky from 'ky'
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Title,
  Legend
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

interface GuildRes {
    locationsData: { [key: string]: any }
    name: string
    guildMemberCount: number
    iconURL: string
}

interface GeojsonRes {
    features: {}[]
}

export default function Guild() {
    const [guildMemberCount, setGuildMemberCount] = useState(0)
    const [guildIconURL, setGuildIconURL] = useState('')
    const [guildName, setGuildName] = useState('')
    const [geojson, setGeojson] = useState(null)
    
    const urlParams = new URLSearchParams(window.location.search);
    const mapCode = urlParams.get('mapCode')
    const { guildID } = useParams()

    useEffect(() => {
        (Promise.all([
            ky.get(`/api/v1/guilds/${guildID}`).json(),
            ky.get(`https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/geojson/${mapCode}.json`).json().catch(err => { throw new Error('Could not get country.') })
        ]) as Promise<unknown> as Promise<[GuildRes, GeojsonRes]>)
        .then(([guildRes, geojsonRes]) => {
            if (!geojsonRes?.features) {
                return errorToast('Invalid country code.')
            }
            
            setGuildMemberCount(guildRes.guildMemberCount)
            setGuildIconURL(guildRes.iconURL)
            // @ts-ignore
            setGeojson(geojsonRes.features.map((feature) => {
                // @ts-ignore
                feature.count = guildRes.locationsData[feature.properties.CC_1]
                return feature
            }))
            setGuildName(guildRes.name)
        }).catch(err => { errorToast(err?.response?.data?.error || err.message) })
    }, [])

    const loading = <div>
        loading...
    </div>
    
    return (<div>
        <NavBar/>
        { !geojson ? loading : <div>
            {guildName} - {guildMemberCount} members
            <img src={guildIconURL}/>

            <Map geojson={geojson} label={'test'}/>
        </div>}
    </div>)
}