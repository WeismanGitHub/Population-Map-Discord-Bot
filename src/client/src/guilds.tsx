import worldMap from "@highcharts/map-collection/custom/usa-and-canada.geo.json";
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Highcharts from "highcharts/highmaps";
// import ky from 'ky';

export default function Guilds() {
    // const [geojson, setGeojson] = useState({})
    const { guildID } = useParams()
    guildID
    
    useEffect(() => {
        // (async () => {
        //     const res = await ky.get('/api/v1/geojson/countries/US').json()
        //     setGeojson(res)
        // })()
    }, [])

    const [options] = useState({
        chart: {
            map: worldMap
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: "spacingBox"
            }
        },
        colorAxis: {
            min: 0
        },
        series: [{
            name: "suidnihsuifds",
            states: { hover: { color: "#BADA55" } },
            dataLabels: {
                enabled: true,
                format: "{point.name}"
            },
            allAreas: true,
            data: [
                ["fo", 0],
                ["um", 1],
                ["us", 2],
                ["jp", 3],
                ["sc", 4],
                ["in", 5],
                ["fr", 6],
                ["fm", 7],
                ["cn", 8]
            ]
        }]
    });

    return (
        <HighchartsReact
        highcharts={Highcharts}
        constructorType={"mapChart"}
        options={options}
        />
    );
};

    // const options: Highcharts.Options = {
    //     chart: {
    //         map: topolo
    //     },
    //     title: {
    //       text: 'example text'
    //     },
    //     // series: [{
    //     //     // data: [],
    //     //     keys: ['code_hasc', 'value'],
    //     //     joinBy: 'code_hasc',
    //     //     name: 'Random data',
    //     //     dataLabels: {
    //     //         enabled: true,
    //     //         format: '{point.properties.postal}'
    //     //     }
    //     // }],
    //     mapNavigation: {
    //         enabled: true,
    //         buttonOptions: {
    //             verticalAlign: 'bottom'
    //         }
    //     },
    //     colorAxis: {
    //         tickPixelInterval: 100
    //     },
    // }

    // if (!Object.keys(geojson).length) {
    //     return <h1>loading map...</h1>
    // } else {
    //     return (<>
    //         <div id='container'></div>
    //     </>)
    // }
// }