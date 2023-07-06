import React, { useState, useEffect } from 'react'
import * as ChartGeo from "chartjs-chart-geo";
import { useNavigate, useParams } from "react-router-dom";
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
    const navigate = useNavigate();
    
    const urlParams = new URLSearchParams(window.location.search);
    const mapCode = urlParams.get('mapCode')
    const { guildID } = useParams()

    useEffect(() => {
        if (!mapCode || !guildID) {
            return errorToast('Missing mapCode or guildID')
        }

        (Promise.all([
            ky.get(`/api/v1/guilds/${guildID}?mapCode=${mapCode}`).json(),
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
                feature.amount = guildRes.locationsData[feature.properties.isoCode] || 0
                return feature
            }))
            setGuildName(guildRes.name)
        }).catch((err) => {
            errorToast(err.response.statusText || err.message)

            if (err.response.status == 401) {
                navigate(`/discord/oauth2?guildID=${guildID}&mapCode=${mapCode}`)
            }
        })
    }, [])

    const loading = <div>
        loading...
    </div>
    
    return (<div>
        <NavBar/>
        { !geojson ? loading : <div>
            <div className='guild'>
                <img
                    width={65}
                    height={65}
                    src={guildIconURL}
                    alt="The icon of the Discord server."
                    style={{ borderRadius: '50%', float: 'left' }}
                />
                {guildName}
                <br/>
                <div style={{ fontSize: 'medium' }}>
                    Total Members: {guildMemberCount}
                    <br/>
                    Members on Map: {-1}
                </div>
            </div>
            <div className='map'>
                <Map geojson={geojson} projection={mapCode === 'WORLD' ? 'equalEarth' : 'albers'}/>
            </div>
        </div>}
    </div>)
}