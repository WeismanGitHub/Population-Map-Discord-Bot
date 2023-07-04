import { Chart as ReactChart } from "react-chartjs-2";
import * as ChartGeo from "chartjs-chart-geo";
import React, { useRef } from "react";
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

export default function Map(props: { geojson: {}[], label: string }) {
    const geojson = props.geojson
    const chartRef = useRef();
    
    return (
        <ReactChart
            color="red"
            ref={chartRef}
            type="choropleth"
            data={{
                labels: geojson.map((d: any) => d.properties.NAME_1),
                datasets: [
                    {
                        outline: geojson,
                        label: props.label,
                        data: geojson.map((d: any) => ({
                            feature: d,
                            value: d.count
                        })),
                    }
                ]
            }}
            options={{
                showOutline: true,
                showGraticule: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    xy: { projection: "equalEarth" }
                }
            }}
        />
    );
}
