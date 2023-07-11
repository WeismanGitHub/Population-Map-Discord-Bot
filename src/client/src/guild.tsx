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
    locations: { count: number, countryCode?: string, subdivisionCode?: string }[]
    name: string
    guildMemberCount: number
    iconURL: string
}

interface GeojsonRes {
    features: {}[]
    countryContinentMap?: { [key: string]: string }
}

export default function Guild() {
    const [guildMemberCount, setGuildMemberCount] = useState(0)
    const [guildIconURL, setGuildIconURL] = useState('')
    const [membersOnMap, setMembersOnMap] = useState(0)
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
            ky.get(`https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/topojson/${mapCode}.json`).json().catch(err => { throw new Error('Could not get country.') })
        ]) as Promise<unknown> as Promise<[GuildRes, GeojsonRes]>)
        .then(([guildRes, geojsonRes]) => {
            // @ts-ignore
            geojsonRes.features = Object.values(geojsonRes.objects).map(feature => ChartGeo.topojson.feature(geojsonRes, feature))

            if (!geojsonRes?.features) return errorToast('Invalid country code.')

            setMembersOnMap(guildRes.locations.length)
            setGuildMemberCount(guildRes.guildMemberCount)
            setGuildIconURL(guildRes.iconURL)
            setGuildName(guildRes.name)

            if (mapCode === 'CONTINENTS') {
                guildRes.locations.forEach(location => {
                    geojsonRes.features.forEach(feature => {
                        // @ts-ignore
                        if (feature.properties.isoCode !== geojsonRes?.countryContinentMap[location.countryCode]) return
                        // @ts-ignore
                        feature.count = feature.count ? feature.count + location.count : location.count || 0
                    })
                    // @ts-ignore
                    geojsonRes?.countryContinentMap[location.countryCode]
                })
                // @ts-ignore
                setGeojson(geojsonRes.features)
            } else {
                const locations = {}

                guildRes.locations.forEach(location => {
                    // @ts-ignore
                    locations[location.countryCode || location.subdivisionCode] = location.count
                })

                // @ts-ignore
                setGeojson(geojsonRes.features.map((feature) => {
                    // @ts-ignore
                    feature.count = locations[feature.properties.isoCode] || 0
                    return feature
                }))
            }
        }).catch((err) => {
            console.log(err)
            errorToast(err?.response?.statusText || err?.message || 'Something went wrong.')

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
                    Members on Map: {membersOnMap}
                </div>
            </div>
            <div className='map'>
                <Map geojson={geojson} projection={(mapCode === 'WORLD' || mapCode === 'CONTINENTS') ? 'equalEarth' : 'albers'}/>
            </div>
        </div>}
    </div>)
}