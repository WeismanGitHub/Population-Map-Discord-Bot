import React, { useEffect, useState } from 'react';
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
            <br />
            <br />
            <a href={res?.botInviteURL}>Bot Invite</a>
            <br />
            <a href={res?.supportServerInvite}>Support Server</a>
            <br />
            <a href={res?.githubURL}>Github</a>
            <br />
            <br />
            {/* <a href={res?.buyMeACoffeeURL}>Buy Me a Coffee</a> */}
            <div style={{ display: 'flex', justifyContent: 'center', overflowWrap: 'break-word' }}>
                <div style={{ wordWrap: 'break-word', maxWidth: '800px', padding: '5px' }}>
                    The Population Map Bot is a dynamic map generator capable of visualizing population data
                    on a global, continental, or country level. Maps are generated based on self-reported
                    locations provided by Discord server members, enabling users to explore population
                    distributions with ease. The application facilitates efficient data processing and
                    visualization, empowering users to gain valuable insights into population patterns across
                    the world.{' '}
                    <a href={`${res?.githubURL}?tab=readme-ov-file#population-map-bot`}>Read more here...</a>
                </div>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <img
                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/WORLD2-example.jpg"
                    alt="World Example"
                    style={{ width: '40%', minWidth: '200px', height: 'auto', margin: '5px' }}
                />
                <img
                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/CONTINENTS-example.jpg"
                    alt="Continents Example"
                    style={{ width: '40%', minWidth: '200px', height: 'auto', margin: '5px' }}
                />
                <img
                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/US-example.jpg"
                    alt="USA Example"
                    style={{ width: '40%', minWidth: '200px', height: 'auto', margin: '5px' }}
                />
                <img
                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/IT-example.jpg"
                    alt="Italy Example"
                    style={{ width: '40%', minWidth: '200px', height: 'auto', margin: '5px' }}
                />
            </div>
        </div>
    );
}
