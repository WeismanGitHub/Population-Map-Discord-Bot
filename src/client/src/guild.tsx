import { Chart as ChartJS, CategoryScale, Tooltip, Title, Legend } from 'chart.js';
import { ToastContainer, Toast, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import * as ChartGeo from 'chartjs-chart-geo';
import { useState, useEffect } from 'react';
import NavBar from './nav-bar';
import axios from 'axios';
import Map from './map';

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

interface Guild {
    locations: { countryCode: string; subdivisionCode: string | null }[];
    name: string;
    guildMemberCount: number;
    icon: string | null;
}

// There are more properties, but I don't want to define them.
interface Geojson {
    features?: {
        count: number;
        properties: { isoCode: string };
    }[];
    countryContinentMap?: { [key: string]: string };
    objects?: object[];
    [key: string]: any;
}

export default function Guild() {
    const [countryCodes, setCountryCodes] = useState<Record<string, string> | null>(null);
    const [guild, setGuild] = useState<Guild | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [geojson, setGeojson] = useState<Geojson | null>(null);
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const [status, setStatus] = useState('Loading...');
    const mapCode = urlParams.get('mapCode');
    const { guildID } = useParams();

    useEffect(() => {
        if (!mapCode || !guildID) {
            return setError('Missing mapCode or guildID');
        }

        (async () => {
            try {
                const [guildResponse, geojsonResponse, countriesResponse] = await Promise.all([
                    axios.get<Guild>(`/api/v1/guilds/${guildID}?mapCode=${mapCode}`),
                    axios.get<Geojson>(
                        `https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/topojson/${mapCode}.json`
                    ),
                    axios.get<Record<string, string>>(
                        'https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/countries.json'
                    ),
                ]);

                if (!geojsonResponse.data.objects) {
                    return setError('Broken GeoJSON')
                }

                const features = Object.values(geojsonResponse.data.objects).map((feature) => {
                    // @ts-ignore
                    return ChartGeo.topojson.feature(geojsonResponse.data, feature)
                });

                if (!features.length) {
                    return setError('Invalid Map Code');
                }

                setGuild(guildResponse.data);
                setCountryCodes(countriesResponse.data);

                const locations: Record<string, number> = {};


                if (mapCode === 'CONTINENTS') {
                    // @ts-ignore
                    guildResponse.data.locations.forEach((location) => {
                        const code = geojsonResponse.data.countryContinentMap?.[location.countryCode];

                        if (!code) throw new Error("Invalid Code")

                        const count = locations[code!];
                        locations[code] = count >= 0 ? count + 1 : 1
                    });
                    
                    // @ts-ignore
                    geojsonResponse.data.features = features.map((feature) => {
                        // @ts-ignore
                        feature.count = locations[feature?.properties?.isoCode] || 0;
                        return feature;
                    });

                    setGeojson(geojsonResponse.data);
                } else if (mapCode === 'WORLD') {
                    guildResponse.data.locations.forEach((location) => {
                        const count = locations[location.countryCode];
                        locations[location.countryCode] = count >= 0 ? count + 1 : 1;
                    });

                    // @ts-ignore
                    geojsonResponse.data.features = features.map((feature) => {
                        // @ts-ignore
                        feature.count = locations[feature?.properties?.isoCode] || 0;
                        return feature;
                    });

                    setGeojson(geojsonResponse.data);
                } else {
                    guildResponse.data.locations.forEach((location) => {
                        const count = locations[location.subdivisionCode!] ?? 0;
                        locations[location.subdivisionCode!] = count + 1;
                    });

                    // @ts-ignore
                    geojsonResponse.data.features = features.map((feature) => {
                        // @ts-ignore
                        feature.count = locations[feature?.properties?.isoCode] || 0;
                        return feature;
                    });

                    setGeojson(geojsonResponse.data);
                }
            } catch (err) {
                setStatus('Something went wrong!');
                console.log(err);

                if (axios.isAxiosError<{ error: string }>(err)) {
                    setError(err.response?.data.error ?? 'Something went wrong.');

                    if (err.status === 401) {
                        localStorage.removeItem('loggedIn');
                        navigate(`/discord/oauth2?guildID=${guildID}&mapCode=${mapCode}`);
                    }
                } else {
                    setError('Something went wrong.');
                }
            }
        })();
    }, []);

    return (
        <>
            <ToastContainer position="top-end">
                <Toast
                    onClose={() => setError(null)}
                    show={error !== null}
                    autohide={true}
                    className="d-inline-block m-1"
                    bg={'danger'}
                >
                    <Toast.Header>
                        <strong className="me-auto">Something went wrong!</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <strong className="me-auto">{error}</strong>
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <NavBar />
            {!geojson ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '94vh',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 'xx-large',
                    }}
                >
                    {status}
                </div>
            ) : (
                <div className="container p-1">
                    {guild && (
                        <div className="d-flex justify-content-center m-0 col-lg-10">
                            <div style={{ fontSize: 'x-large', display: 'flex', marginBottom: '3px' }}>
                                <img
                                    width={65}
                                    height={65}
                                    src={guild?.icon || '/discord.svg'}
                                    alt="server icon"
                                    style={{ borderRadius: '50%', marginRight: '2px' }}
                                />
                                <div>
                                    {guild.name}
                                    <br />
                                    <div style={{ fontSize: 'medium', marginLeft: '8px' }}>
                                        {guild.locations.length} / {guild.guildMemberCount} members{' '}
                                        {`(${Math.round((guild.locations.length / guild.guildMemberCount) * 100)}%)`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="row" style={{ height: '450px' }}>
                        <div className="col-lg-10">
                            <div style={{ maxHeight: '450px' }}>
                                <Map
                                    // @ts-ignore
                                    geojson={geojson}
                                    projection={
                                        mapCode === 'WORLD' || mapCode === 'CONTINENTS'
                                            ? 'equalEarth'
                                            : 'albers'
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-2 d-flex justify-content-center justify-content-lg-end mt-2 mt-lg-0">
                            <div style={{ width: '150px' }}>
                                <div>
                                    <a
                                        className="btn-custom mb-1"
                                        style={{ color: '#ffffff', width: '150px' }}
                                        href={`/maps/${guildID}?mapCode=WORLD`}
                                    >
                                        View World
                                    </a>
                                    <br />
                                    <a
                                        className="btn-custom mb-1"
                                        style={{ color: '#ffffff', width: '150px' }}
                                        href={`/maps/${guildID}?mapCode=CONTINENTS`}
                                    >
                                        View Continents
                                    </a>
                                </div>
                                <ListGroup
                                    className="flex-grow-1"
                                    style={{ height: '362px', overflowY: 'auto', width: '150px' }}
                                >
                                    {countryCodes &&
                                        Object.entries(countryCodes).map(([name, code]) => {
                                            return (
                                                <ListGroupItem key={code} className="btn-custom mb-1 me-1">
                                                    <a href={`/maps/${guildID}?mapCode=${code}`}>{name}</a>
                                                </ListGroupItem>
                                            );
                                        })}
                                </ListGroup>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
