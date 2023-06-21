import React, {useState, useEffect } from 'react'
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

interface GuildData {
    topojson: JSON[]
    guildMemberCount: number
}

export default function Guild() {
    const [guildMemberCount, setGuildMemberCount] = useState(0)
    const [topojson, setTopojson] = useState({})
    const { guildID } = useParams()
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('countryCode')

    useEffect(() => {
        (async () => {
            const guildData: GuildData = await ky.get(`/api/v1/guilds/${guildID}`).json()
            const mapjson = await ky.get(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${countryCode}_1.json`)
            // @ts-ignore
            setTopojson(mapjson.features)
            // @ts-ignore
            setGuildMemberCount(guildData.guildMemberCount)
        })()
    }, [])

    if (!Object.keys(topojson).length) {
        return (<div>
            loading...
        </div>)
    } else {
        return (<div>
            {guildMemberCount}
            {/* @ts-ignore */}
            <Map data={topojson} label={'test'}/>
        </div>);
    }
}