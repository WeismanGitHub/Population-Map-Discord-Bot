import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import NavBar from './nav-bar';
import axios from 'axios';

interface BotInfo {
    guildCount: number;
}

export default function Home() {
    const [info, setInfo] = useState<BotInfo>();

    useEffect(() => {
        axios.get<BotInfo>('/api/v1/bot/').then((res) => setInfo(res.data));
    }, []);

    return (
        <div style={{ textAlign: 'center', fontSize: 'x-large' }}>
            <NavBar />
            <div className="container mb-2">
                <div className="row">
                    <div className="col-md-12 d-flex col-lg-6 flex-column justify-content-center align-items-center order-md-1 order-lg-2">
                        <code className="m-1">Used by {info?.guildCount} Servers</code>
                        <Carousel interval={3000} className="carousel-dark">
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
                    <div className="col-md-12 col-lg-6 order-md-2 order-lg-1">
                        <br />
                        The Population Map Bot is a dynamic map generator capable of visualizing population
                        data on a global, continental, or country level. Maps are generated from self-reported
                        locations provided by Discord server members, enabling users to explore population
                        distributions with ease.
                        <br />
                        <br />
                        This bot generates a unique map for each Discord server that can be accessed with{' '}
                        <code>/map</code>. Server members use <code>/set-location</code> to add their location
                        to the map. A location can be any country and, optionally, a subdivision (state,
                        region, prefecture, etc.) within that country. Server admins can also make it so only
                        members who share their location can access the server.{' '}
                        <a
                            className="link"
                            href={
                                'https://github.com/WeismanGitHub/Population-Map-Discord-Bot?tab=readme-ov-file#user-docs'
                            }
                        >
                            Read more here...
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
