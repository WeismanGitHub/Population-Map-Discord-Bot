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
    const chartRef = useRef();
    const geojson = props.geojson

    return (
        <ReactChart
            ref={chartRef}
            type="choropleth"
            data={{
                labels: geojson.map((d: any) => d.properties.VARNAME_1),
                datasets: [
                    {
                        outline: geojson,
                        label: props.label,
                        data: geojson.map((d: any) => ({
                            feature: d,
                            value: Math.random() * 10
                        })),
                        backgroundColor: ["#94BA62", "#59A22F", "#1A830C"]
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
