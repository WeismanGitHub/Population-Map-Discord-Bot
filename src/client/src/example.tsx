import { Chart as ChartJS, CategoryScale, Tooltip, Title, Legend } from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import * as ChartGeo from 'chartjs-chart-geo';
import axios from 'axios';

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

export default function Example() {
    const chartRef = useRef();
    const [geojson, setGeojson] = useState(null);

    const urlParams = new URLSearchParams(window.location.search);
    const mapCode = urlParams.get('mapCode') ?? 'WORLD';

    useEffect(() => {
        (async () => {
            const geojsonResponse = await axios.get(
                `https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/topojson/${mapCode}.json`
            );

            const features = Object.values(geojsonResponse.data.objects).map((feature) => {
                // @ts-ignore
                return ChartGeo.topojson.feature(geojsonResponse.data, feature);
            });

            geojsonResponse.data.features = features;
            setGeojson(geojsonResponse.data);
        })();
    }, []);

    return (
        <>
            {geojson && (
                <ReactChart
                    style={{ backgroundColor: 'white', borderRadius: '5px', maxHeight: '450px' }}
                    ref={chartRef}
                    type="choropleth"
                    data={{
                        // @ts-ignore
                        labels: geojson.features.map((d: any) => d.properties.name),
                        datasets: [
                            {
                                // @ts-ignore
                                outline: geojson.features,
                                // @ts-ignore
                                data: geojson.features.map((d: any) => ({
                                    feature: d,
                                    value: Math.round(Math.random() * 100),
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
                            xy: { projection: 'equalEarth' },
                        },
                    }}
                />
            )}
        </>
    );
}
