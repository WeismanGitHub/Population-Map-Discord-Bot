import React, { useState, useEffect } from 'react'
import * as ChartGeo from "chartjs-chart-geo";
import { useParams } from "react-router-dom";
import { errorToast } from './toasts';
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
    locationsData: JSON
    name: string
    guildMemberCount: number
    iconURL: string
}

interface TopojsonRes {
    features: {}[]
}

export default function Guild() {
    const [guildMemberCount, setGuildMemberCount] = useState(0)
    const [guildIconURL, setGuildIconURL] = useState('')
    const [guildName, setGuildName] = useState('')
    const [topojson, setTopojson] = useState(null)
    
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('countryCode')
    const { guildID } = useParams()

    useEffect(() => {
        (Promise.all([
            ky.get(`/api/v1/guilds/${guildID}`).json(),
            ky.get(`https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/topojson/${countryCode || 'WORLD'}.json`).json().catch(err => { throw new Error('Could not get country.') })
        ]) as Promise<unknown> as Promise<[GuildRes, TopojsonRes]>)
        .then(([guildRes, topojsonRes]) => {
            if (!topojsonRes?.features) {
                return errorToast('Invalid country code.')
            }
    
            setGuildMemberCount(guildRes.guildMemberCount)
            setGuildIconURL(guildRes.iconURL)
            // @ts-ignore
            setTopojson(topojsonRes.features)
            setGuildName(guildRes.name)
        }).catch(err => { console.log(err); errorToast(err?.response?.data?.error || err.message) })
    }, [])


    if (!topojson) {
        return (<div>
            loading...
        </div>)
    } else {
        return (<div>
            {guildName} - {guildMemberCount} members
            <img src={guildIconURL}/>

            <Map topojson={topojson} label={'test'}/>
        </div>);
    }
}