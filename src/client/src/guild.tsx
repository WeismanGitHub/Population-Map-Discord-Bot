import { Chart as ChartJS, CategoryScale, Tooltip, Title, Legend } from 'chart.js';
import { ToastContainer, Toast, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as ChartGeo from 'chartjs-chart-geo';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import PopulationMap from './map';
import NavBar from './nav-bar';
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

type Location = {
    countryCode: string;
    subdivisionCode: string | null;
};

interface Guild {
    name: string;
    locations: Location[];
    guildMemberCount: number;
    icon: string | null;
}

// There are more properties, but I don't want to define them.
interface GeoJSON {
    features?: {
        count: number;
        properties: { isoCode: string };
    }[];
    countryContinentMap?: { [key: string]: string };
    objects?: object[];
    [key: string]: any;
}

const locationsCache = new Map<string, Location[]>();
const geojsonCache = new Map<string, GeoJSON>();

export default function Guild() {
    const [countryCodes, setCountryCodes] = useState<Record<string, string> | null>(null);
    const [geojson, setGeojson] = useState<GeoJSON | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [guild, setGuild] = useState<Guild | null>(null);
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
            setGeojson(null);

            try {
                const cacheCode = ['CONTINENTS', 'WORLD'].includes(mapCode) ? 'GLOBAL' : mapCode;
                const cachedLocations = locationsCache.get(cacheCode);
                const cachedGeojson = geojsonCache.get(mapCode);

                const [guildResponse, geojsonResponse] = await Promise.all([
                    cachedLocations && guild
                        ? { data: { ...guild, locations: cachedLocations } }
                        : axios.get<Guild>(`/api/v1/guilds/${guildID}?mapCode=${mapCode}`),
                    cachedGeojson
                        ? { data: cachedGeojson }
                        : axios.get<GeoJSON>(
                              `https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/topojson/${mapCode}.json`
                          ),
                ]);

                if (!geojsonResponse.data.objects) {
                    return setError('Broken GeoJSON');
                }

                const features = Object.values(geojsonResponse.data.objects).map((feature) => {
                    // @ts-ignore
                    return ChartGeo.topojson.feature(geojsonResponse.data, feature);
                });

                if (!features.length) {
                    return setError('Invalid Map Code');
                }

                const locationsMap: Record<string, number> = {};

                if (mapCode === 'CONTINENTS') {
                    // @ts-ignore
                    guildResponse.data.locations.forEach((location) => {
                        const code = geojsonResponse.data.countryContinentMap?.[location.countryCode];

                        if (!code) throw new Error('Invalid Code');

                        const count = locationsMap[code!];
                        locationsMap[code] = count >= 0 ? count + 1 : 1;
                    });

                    // @ts-ignore
                    geojsonResponse.data.features = features.map((feature) => {
                        // @ts-ignore
                        feature.count = locationsMap[feature?.properties?.isoCode] || 0;
                        return feature;
                    });
                } else if (mapCode === 'WORLD') {
                    // @ts-ignore
                    guildResponse.data.locations.forEach((location) => {
                        const count = locationsMap[location.countryCode];
                        locationsMap[location.countryCode] = count >= 0 ? count + 1 : 1;
                    });

                    // @ts-ignore
                    geojsonResponse.data.features = features.map((feature) => {
                        // @ts-ignore
                        feature.count = locationsMap[feature?.properties?.isoCode] || 0;
                        return feature;
                    });
                } else {
                    // @ts-ignore
                    guildResponse.data.locations.forEach((location) => {
                        const count = locationsMap[location.subdivisionCode!] ?? 0;
                        locationsMap[location.subdivisionCode!] = count + 1;
                    });

                    // @ts-ignore
                    geojsonResponse.data.features = features.map((feature) => {
                        // @ts-ignore
                        feature.count = locationsMap[feature?.properties?.isoCode] || 0;
                        return feature;
                    });
                }

                locationsCache.set(cacheCode, guildResponse.data.locations!);
                geojsonCache.set(mapCode, geojsonResponse.data);

                setGeojson(geojsonResponse.data);
                setGuild(guildResponse.data);
            } catch (err) {
                setStatus('Something went wrong!');
                console.log(err);

                if (axios.isAxiosError<{ error: string }>(err)) {
                    setError(err.response?.data.error ?? 'Something went wrong.');

                    if (err.response?.status === 401) {
                        localStorage.removeItem('loggedIn');
                        navigate(`/discord/oauth2?guildID=${guildID}&mapCode=${mapCode}`);
                    }
                } else {
                    setError('Something went wrong.');
                }
            }
        })();
    }, [mapCode]);

    useEffect(() => {
        axios
            .get<Record<string, string>>(
                'https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/countries.json'
            )
            .then((res) => {
                setCountryCodes(res.data);
            })
            .catch(() => setError('Could not fetch country codes.'));
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
            <div className="full-height-minus-navbar p-2 pt-5 container-fluid w-100 flex-wrap m-0 d-flex justify-content-center align-content-center">
                {guild && (
                    <div className="d-flex justify-content-center m-0" style={{ height: '10%' }}>
                        <div style={{ fontSize: 'x-large', display: 'flex', marginBottom: '3px' }}>
                            <img
                                width={65}
                                height={65}
                                src={guild?.icon || '/discord.svg'}
                                alt="server icon"
                                style={{ borderRadius: '50%', marginRight: '2px' }}
                            />
                            <div>
                                <span className="ps-1">{guild.name}</span>
                                <br />
                                <div style={{ fontSize: 'medium', marginLeft: '8px' }}>
                                    {guild.locations.length} / {guild.guildMemberCount} members{' '}
                                    {`(${Math.round(
                                        (guild.locations.length / guild.guildMemberCount) * 100
                                    )}%)`}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row d-flex w-100 justify-content-center" style={{ height: '75%' }}>
                    <div
                        style={{ width: '80%' }}
                        className="col-10 p-0 m-0 pt-2 flex-column align-items-center align-content-center"
                    >
                        {geojson ? (
                            <div style={{ paddingLeft: '2.5%' }}>
                                <PopulationMap
                                    // @ts-ignore
                                    geojson={geojson}
                                    projection={
                                        mapCode === 'WORLD' || mapCode === 'CONTINENTS'
                                            ? 'equalEarth'
                                            : 'albers'
                                    }
                                />
                            </div>
                        ) : (
                            <div className="d-flex h-100 w-100 justify-content-center align-items-center align-content-center fs-3">
                                {status === 'Loading...' ? (
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                ) : (
                                    status
                                )}
                            </div>
                        )}
                    </div>
                    <div
                        className="col-2 p-0 m-0 d-flex justify-content-center align-items-center pt-2"
                        style={{ width: '20%', minWidth: '175px' }}
                    >
                        <div style={{ width: '75%' }}>
                            <div className="w-100 mb-1">
                                <Link className="btn-custom mb-1 w-100" to={`/maps/${guildID}?mapCode=WORLD`}>
                                    World
                                </Link>
                                <br />
                                <Link
                                    className="btn-custom mb-1 w-100"
                                    to={`/maps/${guildID}?mapCode=CONTINENTS`}
                                >
                                    Continents
                                </Link>
                            </div>
                            <ListGroup style={{ overflowY: 'auto', height: '50vh' }}>
                                {countryCodes &&
                                    Object.entries(countryCodes).map(([name, code]) => {
                                        return (
                                            <ListGroupItem key={code} className="btn-custom mb-1 me-1">
                                                <Link
                                                    style={{ color: '#dbdee1' }}
                                                    to={`/maps/${guildID}?mapCode=${code}`}
                                                >
                                                    {name}
                                                </Link>
                                            </ListGroupItem>
                                        );
                                    })}
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
