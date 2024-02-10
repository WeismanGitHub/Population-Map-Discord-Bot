import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import NavBar from './nav-bar';
import ky from 'ky';

interface BotAPIRes {
    guildCount: number;
    botInviteURL: string;
    supportServerInvite: string;
    githubURL: string;
    // buyMeACoffeeURL: string
}

export default function Home() {
    const [res, setRes] = useState<BotAPIRes>();

    useEffect(() => {
        ky.get('/api/v1/bot/')
            .json()
            .then((res) => {
                setRes(res as BotAPIRes);
            });
    }, []);

    return (
        <div style={{ textAlign: 'center', fontSize: 'x-large' }}>
            <NavBar />
            In {res?.guildCount} Servers
            <div className="flex-row justify-content-around">
                <a className="btn-custom" href={res?.botInviteURL}>
                    Invite
                </a>
                <a className="btn-custom" href={res?.supportServerInvite}>
                    Server
                </a>
                <a className="btn-custom" href={res?.githubURL}>
                    Github
                </a>
                {/* <a href={res?.buyMeACoffeeURL}>Buy Me a Coffee</a> */}
            </div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        The Population Map Bot is a dynamic map generator capable of visualizing population
                        data on a global, continental, or country level. Maps are generated from self-reported
                        locations provided by Discord server members, enabling users to explore population
                        distributions with ease.
                        <br />
                        <br />
                        This bot generates a unique map for each Discord server that can be accessed with{' '}
                        <strong>
                            <code>/map</code>
                        </strong>
                        . Server members use{' '}
                        <strong>
                            <code>/set-location</code>
                        </strong>{' '}
                        to add their location to the map. A location can be any country and, optionally, a
                        subdivision (state, region, prefecture, etc.) within that country. Server admins can
                        also make it so only members who share their location can access the server.{' '}
                        <a href={`${res?.githubURL}?tab=readme-ov-file#user-docs`}>Read more here...</a>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center" style={{ minWidth: '50vw' }}>
                        <Carousel interval={2000} className="carousel-dark">
                            <Carousel.Item>
                                <img
                                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/WORLD2-example.jpg"
                                    alt="World Example"
                                    className="image-custom"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/CONTINENTS-example.jpg"
                                    alt="Continents Example"
                                    className="image-custom"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/US-example.jpg"
                                    alt="USA Example"
                                    className="image-custom"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/IT-example.jpg"
                                    alt="Italy Example"
                                    className="image-custom"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
}
