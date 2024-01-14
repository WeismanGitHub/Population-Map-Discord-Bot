import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import * as ChartGeo from 'chartjs-chart-geo';
import { errorToast } from './toasts';
import ky, { HTTPError } from 'ky';
import NavBar from './nav-bar';
import Map from './map';
import { Chart as ChartJS, CategoryScale, Tooltip, Title, Legend } from 'chart.js';

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
    const [guildMemberCount, setGuildMemberCount] = useState(0);
    const [icon, setIcon] = useState<string | null>(null);
    const [membersOnMap, setMembersOnMap] = useState(0);
    const [guildName, setGuildName] = useState('');
    const [geojson, setGeojson] = useState(null);
    const navigate = useNavigate();
    
    const urlParams = new URLSearchParams(window.location.search);
    const [status, setStatus] = useState('Loading...')
    const mapCode = urlParams.get('mapCode');
    const { guildID } = useParams();

    useEffect(() => {
        if (!mapCode || !guildID) {
            return errorToast('Missing mapCode or guildID');
        }

        (
            Promise.all([
                ky.get(`/api/v1/guilds/${guildID}?mapCode=${mapCode}`)?.json(),
                ky
                    .get(
                        `https://raw.githubusercontent.com/WeismanGitHub/Population-Density-Map-Discord-Bot/main/topojson/${mapCode}.json`
                    )
                    ?.json()
                    .catch((err) => {
                        throw new Error('Could not get map.');
                    }),
            ]) as Promise<unknown> as Promise<[GuildRes, GeojsonRes]>
        )
            .then(([guildRes, geojsonRes]) => {
                // @ts-ignore
                geojsonRes.features = Object.values(geojsonRes.objects).map((feature) =>
                    // @ts-ignore
                    ChartGeo.topojson.feature(geojsonRes, feature)
                );

                if (!geojsonRes?.features) return errorToast('Invalid map code.');

                setMembersOnMap(guildRes.locations.length);
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
                setStatus('Something went wrong!')
                const err: { error: string } = await res.response.json();

                errorToast(err.error || res.response.statusText || 'Something went wrong.');

                if (res.response.status === 401) {
                    localStorage.removeItem('loggedIn');
                    navigate(`/discord/oauth2?guildID=${guildID}&mapCode=${mapCode}`);
                }
            });
    }, []);

    return (
        <div>
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
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ fontSize: 'x-large', display: 'flex', marginBottom: '2px' }}>
                        <img
                            width={65}
                            height={65}
                            src={icon || '/discord.svg'}
                            alt="The icon of the Discord server."
                            style={{ borderRadius: '50%', marginRight: '2px' }}
                        />
                        <div>
                            {guildName}
                            <br />
                            <div style={{ fontSize: 'medium', marginLeft: '8px' }}>
                                Total Members: {guildMemberCount}
                                <br />
                                Members on Map: {membersOnMap}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '2px',
                            flexWrap: 'wrap',
                            alignContent: 'center',
                        }}
                    >
                        {mapCode !== 'WORLD' && (
                            <a className="navbar-button" href={`/maps/${guildID}?mapCode=WORLD`}>
                                View World
                            </a>
                        )}
                        {mapCode !== 'CONTINENTS' && (
                            <a className="navbar-button" href={`/maps/${guildID}?mapCode=CONTINENTS`}>
                                View Continents
                            </a>
                        )}
                    </div>
                    <div style={{ width: '75%' }}>
                        <Map
                            geojson={geojson}
                            projection={
                                mapCode === 'WORLD' || mapCode === 'CONTINENTS' ? 'equalEarth' : 'albers'
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
