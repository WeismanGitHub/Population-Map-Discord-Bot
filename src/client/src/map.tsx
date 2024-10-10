import { Chart as ChartJS, CategoryScale, Tooltip, Title, Legend } from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import * as ChartGeo from 'chartjs-chart-geo';
import { useRef } from 'react';

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

export default function Map(props: { geojson: { features: [] }; projection: 'albers' | 'equalEarth' }) {
    const geojson = props.geojson;
    const chartRef = useRef();

    return (
        <ReactChart
            style={{ backgroundColor: 'white', borderRadius: '5px', maxHeight: window.outerHeight }}
            ref={chartRef}
            type="choropleth"
            data={{
                labels: geojson.features.map((d: any) => d.properties.name),
                datasets: [
                    {
                        outline: geojson.features,
                        data: geojson.features.map((d: any) => ({
                            feature: d,
                            value: d.count || 0,
                        })),
                    },
                ],
            }}
            options={{
                borderColor: 'black',
                showOutline: true,
                showGraticule: true,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    xy: { projection: props.projection },
                },
            }}
        />
    );
}
