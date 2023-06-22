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
import { clearInterval } from 'timers';

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
    const [loadingDotsAmount, setLoadingDotsAmount] = useState(1)
    const [guildMemberCount, setGuildMemberCount] = useState(0)
    const [guildIconURL, setGuildIconURL] = useState('')
    const [guildName, setGuildName] = useState('')
    const [topojson, setTopojson] = useState([{}])
    
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('countryCode')
    const { guildID } = useParams()

    useEffect(() => {
        (async () => {
            const [guildRes, topojsonRes] = await Promise.all([
                ky.get(`/api/v1/guilds/${guildID}`).json(),
                ky.get(`/api/v1/topojson/${countryCode ?? ''}`).json()
            ]).catch(err => errorToast(err?.response?.data?.error || err.message)) as [GuildRes, TopojsonRes]

            setGuildMemberCount(guildRes.guildMemberCount)
            setGuildIconURL(guildRes.iconURL)
            setTopojson(topojsonRes.features)
            setGuildName(guildRes.name)
        })()
    }, [])

    const interval = setInterval(() => {
        setLoadingDotsAmount(loadingDotsAmount === 3 ? 0 : loadingDotsAmount + 1)
    }, 500)

    if (!topojson) {
        return (<div className='loading-text'>
            loading{'.'.repeat(loadingDotsAmount)}
        </div>)
    } else {
        clearInterval(interval)
        return (<div>
            {guildName} - {guildMemberCount} members
            <img src={guildIconURL}/>

            <Map topojson={topojson} label={'test'}/>
        </div>);
    }
}