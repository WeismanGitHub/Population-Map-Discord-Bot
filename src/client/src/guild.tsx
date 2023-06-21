import React, {useState, useEffect } from 'react'
import * as ChartGeo from "chartjs-chart-geo";
import { useParams } from "react-router-dom";
// import pako from 'pako'
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

    useEffect(() => {
        (async () => {
            const res: GuildData = await ky.get(`/api/v1/guilds/${guildID}`).json()
            const countryData = await ky.get('/api/v1/geojson/countries/US').json()

            // const data = await countryData.arrayBuffer()
            // const buffer = pako.ungzip(data, { raw: true })

            // console.log(buffer)
            
            // setTopojson(buffer)
            // @ts-ignore
            setTopojson(countryData.features)
            // @ts-ignore
            console.log(countryData.features)
            setGuildMemberCount(res.guildMemberCount)
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