import * as ChartGeo from "chartjs-chart-geo";
import { useParams } from "react-router-dom";
import React, {useState, useEffect } from 'react'
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

interface GuildData {
    topojson: JSON
    guildMemberCount: number
}

export default function Guild() {
    const [guildMemberCount, setGuildMemberCount] = useState(0)
    const [topojson, setTopojson] = useState({})
    const { guildID } = useParams()

    useEffect(() => {
        (async () => {
            const res: GuildData = await ky.get(`/api/v1/guilds/${guildID}`).json()

            setTopojson(res.topojson)
            setGuildMemberCount(res.guildMemberCount)
        })()
    }, [])
    
    return (<div>
        <Map chosenKey="china" />
    </div>);
}