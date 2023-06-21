import React, { useState, useEffect } from 'react'
import * as ChartGeo from "chartjs-chart-geo";
import { useParams } from "react-router-dom";
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
    geojson: { features: JSON[] } | null
    locationsData: JSON
    name: string
    guildMemberCount: number
    iconURL: string
}

export default function Guild() {
    const [guildMemberCount, setGuildMemberCount] = useState(0)
    const [guildIconURL, setGuildIconURL] = useState('')
    const [guildName, setGuildName] = useState('')
    const [geojson, setGeojson] = useState()
    
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('countryCode')
    const { guildID } = useParams()

    useEffect(() => {
        (async () => {
            // @ts-ignore
            const res: GuildRes = await ky.get(`/api/v1/guilds/${guildID}` + countryCode ? `?countryCode=${countryCode}` : '').json()
            console.log(res)

            setGuildMemberCount(res.guildMemberCount)
            setGuildIconURL(res.iconURL)
            console.log(res)
            // @ts-ignore
            setGeojson(res.geojson?.features)
            setGuildName(res.name)
        })()
    }, [])

    if (!geojson) {
        return (<div>
            loading...
        </div>)
    } else {
        return (<div>
            {guildName} - {guildMemberCount} members
            <img src={guildIconURL}/>

            <Map geojson={geojson} label={'test'}/>
        </div>);
    }
}