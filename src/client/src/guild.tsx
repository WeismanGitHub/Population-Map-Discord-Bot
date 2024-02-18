import { Chart as ChartJS, CategoryScale, Tooltip, Title, Legend } from 'chart.js';
import { ToastContainer, Toast, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as ChartGeo from 'chartjs-chart-geo';
import ky, { HTTPError } from 'ky';
import NavBar from './nav-bar';
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

interface GuildRes {
    locations: { countryCode: string; subdivisionCode: string | null }[];
    name: string;
    guildMemberCount: number;
    icon: string | null;
}

interface GeojsonRes {
    features: {}[];
    countryContinentMap?: { [key: string]: string };
}

export default function Guild() {
    const [countryCodes, setCountryCodes] = useState<Record<string, string> | null>(null);
    const [guildMemberCount, setGuildMemberCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [icon, setIcon] = useState<string | null>(null);
    const [membersOnMap, setMembersOnMap] = useState(0);
    const [guildName, setGuildName] = useState('');
    const [geojson, setGeojson] = useState(null);
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const [status, setStatus] = useState('Loading...');
    const mapCode = urlParams.get('mapCode');
    const { guildID } = useParams();

    useEffect(() => {
        if (!mapCode || !guildID) {
            return setError('Missing mapCode or guildID');
        }

        (
            Promise.all([
                ky.get(`/api/v1/guilds/${guildID}?mapCode=${mapCode}`)?.json(),
                ky
                    .get(
                        `https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/topojson/${mapCode}.json`
                    )
                    ?.json()
                    .catch(() => {
                        throw new Error('Could not get map.');
                    }),
                ky
                    .get(
                        'https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/countries.json'
                    )
                    .json(),
            ]) as Promise<unknown> as Promise<[GuildRes, GeojsonRes, Record<string, string>]>
        )
            .then(([guildRes, geojsonRes, countryCodes]) => {
                // @ts-ignore
                geojsonRes.features = Object.values(geojsonRes.objects).map((feature) =>
                    // @ts-ignore
                    ChartGeo.topojson.feature(geojsonRes, feature)
                );

                if (!geojsonRes?.features) return setError('Invalid map code.');

                setMembersOnMap(guildRes.locations.length);
                setCountryCodes(countryCodes);
                setGuildMemberCount(guildRes.guildMemberCount);
                setIcon(guildRes.icon);
                setGuildName(guildRes.name);

                if (mapCode === 'CONTINENTS') {
                    guildRes.locations.forEach((location) => {
                        geojsonRes.features.forEach((feature) => {
                            if (
                                // @ts-ignore
                                feature.properties.isoCode !=
                                // @ts-ignore
                                geojsonRes?.countryContinentMap[location.countryCode]
                            )
                                return;
                            // @ts-ignore
                            feature.count = feature.count >= 0 ? feature.count + 1 : 1;
                        });
                    });
                    // @ts-ignore
                    setGeojson(geojsonRes.features);
                } else if (mapCode === 'WORLD') {
                    const locations: Record<string, number> = {};

                    guildRes.locations.forEach((location) => {
                        const count = locations[location.countryCode];
                        // @ts-ignore
                        locations[location.countryCode] = count >= 0 ? count + 1 : 1;
                    });

                    setGeojson(
                        // @ts-ignore
                        geojsonRes.features.map((feature) => {
                            // @ts-ignore
                            feature.count = locations[feature.properties.isoCode] || 0;
                            return feature;
                        })
                    );
                } else {
                    const locations: Record<string, number> = {};

                    guildRes.locations.forEach((location) => {
                        const count = locations[location.subdivisionCode!];
                        // @ts-ignore
                        locations[location.subdivisionCode] = count >= 0 ? count + 1 : 1;
                    });

                    // @ts-ignore
                    setGeojson(
                        // @ts-ignore
                        geojsonRes.features.map((feature) => {
                            // @ts-ignore
                            feature.count = locations[feature.properties.isoCode] ?? 0;
                            return feature;
                        })
                    );
                }
            })
            .catch(async (res: HTTPError) => {
                setStatus('Something went wrong!');
                const err: { error: string } = await res.response.json();

                setError(err.error || res.response.statusText || 'Something went wrong.');

                if (res.response.status === 401) {
                    localStorage.removeItem('loggedIn');
                    navigate(`/discord/oauth2?guildID=${guildID}&mapCode=${mapCode}`);
                }
            });
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
                    <Toast.Header>Something went wrong!</Toast.Header>
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
                    <div className="d-flex justify-content-center m-0 col-lg-10">
                        <div style={{ fontSize: 'x-large', display: 'flex', marginBottom: '3px' }}>
                            <img
                                width={65}
                                height={65}
                                src={icon || '/discord.svg'}
                                alt="server icon"
                                style={{ borderRadius: '50%', marginRight: '2px' }}
                            />
                            <div>
                                {guildName}
                                <br />
                                <div style={{ fontSize: 'medium', marginLeft: '8px' }}>
                                    {membersOnMap} / {guildMemberCount} members {`(${Math.round((membersOnMap / guildMemberCount) * 100)}%)`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{ height: '450px' }}>
                        <div className="col-lg-10">
                            <div style={{ maxHeight: '450px' }}>
                                <Map
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
