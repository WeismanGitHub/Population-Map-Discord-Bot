import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';
import React from 'react'

export default function Guilds() {
    const { guildID } = useParams()
    let geojson: any;

    return (<>
        <Plot
            data={[
                {
                    type: 'choropleth',
                    locationmode: 'USA-states',
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
                width: 1000,
            }}
        />
    </>)
}