// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';
import ky from 'ky';

export default function Guilds() {
    const [geojson, setGeojson] = useState(undefined)
    const { guildID } = useParams()
    
    useEffect(() => {
        (async () => {
            const res = await ky.get('/api/v1/geojson/countries/US').json()
            console.log(res)
            setGeojson(res)
        })()
    }, [])

    if (!geojson) {
        return <h1>loading map...</h1>
    } else {
        return (<>
            <Plot
                data={[
                    {
                        type: 'choropleth',
                        locationmode: 'geojson-id',
                        locations: ['CA', 'OR', 'NY'],
                        z: [1, 2, 10],
                        text: ['California', 'Oregon', 'New York'],
                        colorscale: [
                            [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
                            [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
                            [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
                        ],
                        colorbar: {
                            title: 'Users',
                            thickness: 2,
                        },
                        lon: geojson,
                        lat: geojson,
                    },
                ]}
                layout={{
                    title: `Population Density of ${guildID}`,
                    // geo: { scope: 'usa', showlakes: false },
                    height: 500,
                    width: 1000
                }}
            />
        </>)
    }
}