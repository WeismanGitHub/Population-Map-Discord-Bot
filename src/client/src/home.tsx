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
            <div className="p-0 m-0 mt-1 overflow-x-hidden full-height-minus-navbar container-fluid w-100 flex-wrap m-0 d-flex justify-content-center align-content-center">
                <Row className="fs-4 p-0 d-flex justify-content-center">
                    <Row className="d-flex justify-content-center">
                        <code className="m-1" style={{ width: 'fit-content', height: 'fit-content' }}>
                            Used by {info?.guildCount} Servers
                        </code>
                    </Row>
                    <Row className="d-flex justify-content-center">
                        <Carousel
                            keyboard={true}
                            wrap={true}
                            interval={3000}
                            className="carousel-dark"
                            style={{
                                width: '50%',
                                minWidth: '310px',
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
                <Row className="fs-4 text-center" style={{ minWidth: '310px', width: '75%' }}>
                    <p>
                        The Population Map Bot is a dynamic map generator that visualizes your Discord
                        server's population data on a global, continental, or country level. Maps are
                        generated from self-reported locations provided by server members and are anonymous.
                    </p>
                    <p>
                        Server members use `/set-location` to set their country and, optionally, a subdivision
                        (state, province, etc.) within that country. Maps are generated through the website,
                        and you can get a link to a server's map with `/map`. Server admins can also make it
                        so only members who share their location can access the server.{' '}
                        <a
                            className="link"
                            href={
                                'https://github.com/WeismanGitHub/Population-Map-Discord-Bot?tab=readme-ov-file#user-docs'
                            }
                        >
                            Read more here.
                        </a>
                    </p>
                </Row>
            </div>
        </>
    );
}
