import { Carousel, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
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
        <>
            <NavBar />
            <div className="p-0 m-0 container-fluid w-100 flex-wrap d-flex justify-content-center align-content-center fs-4 overflow-x-hidden mt-2">
                <Row className="d-flex justify-content-center">
                    <Row className="d-flex justify-content-center">
                        <Carousel
                            keyboard={true}
                            wrap={true}
                            interval={3000}
                            className="carousel-dark"
                            style={{
                                width: '50%',
                                minWidth: '315px',
                                borderRadius: '5px',
                                overflow: 'hidden',
                            }}
                        >
                            <Carousel.Item>
                                <img
                                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/WORLD2-example.jpg"
                                    alt="World Example"
                                    className="example-image"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/CONTINENTS-example.jpg"
                                    alt="Continents Example"
                                    className="example-image"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/US-example.jpg"
                                    alt="USA Example"
                                    className="example-image"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/IT-example.jpg"
                                    alt="Italy Example"
                                    className="example-image"
                                />
                            </Carousel.Item>
                        </Carousel>
                    </Row>
                </Row>
                <Row className="d-flex justify-content-center mt-1 mb-1 w-100">
                    <code className="m-1" style={{ width: 'fit-content', height: 'fit-content' }}>
                        Used by {info?.guildCount} Servers
                    </code>
                </Row>
                <Row className="text-center" style={{ minWidth: '315px', width: '75%' }}>
                    <p>
                        The Population Map Bot is a dynamic map generator that visualizes your Discord
                        server's population data on a global, continental, or country level. Maps are
                        generated from self-reported locations provided by server members and are anonymous.
                    </p>
                    <p>
                        Server members use <code>/set-location</code> to set their country and, optionally, a
                        subdivision (state, province, etc.) within that country. Maps are generated through
                        the website, and you can get a link to a server's map with <code>/map</code>. Server
                        admins can also make it so only members who share their location can access the
                        server.{' '}
                        <a
                            className="link"
                            href={
                                'https://github.com/WeismanGitHub/Population-Map-Discord-Bot?tab=readme-ov-file#user-docs'
                            }
                        >
                            Read more here...
                        </a>
                    </p>
                </Row>
            </div>
        </>
    );
}
