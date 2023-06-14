// import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Highcharts from "highcharts/highmaps";
import ky from 'ky';

export default function Guilds() {
    const [geojson, setGeojson] = useState({})
    const { guildID } = useParams()
    guildID
    
    useEffect(() => {
        (async () => {
            const res: Highcharts.GeoJSON = await ky.get('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/germany.geo.json').json()

            setGeojson(res)
        })()
    }, [])

    const [options] = useState({
        chart: {
            map: geojson
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
                ['DE.SH', 728],
                ['DE.BE', 710],
                ['DE.MV', 963],
                ['DE.HB', 541],
                ['DE.HH', 622],
                ['DE.RP', 866],
                ['DE.SL', 398],
                ['DE.BY', 785],
                ['DE.SN', 223],
                ['DE.ST', 605],
                ['DE.NW', 237],
                ['DE.BW', 157],
                ['DE.HE', 134],
                ['DE.NI', 136],
                ['DE.TH', 704],
                ['DE.', 361]
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