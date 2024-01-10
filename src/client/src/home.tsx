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
            <br />
            <a href={res?.supportServerInvite}>Support Server</a>
            <br />
            <br />
            <a href={res?.githubURL}>Github</a>
            <br />
            <br />
            {/* <a href={res?.buyMeACoffeeURL}>Buy Me a Coffee</a> */}
            Example Images
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <img
                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/WORLD2-example.jpg"
                    alt="example image of the world"
                    style={{ width: '500px', height: 'auto', margin: '5px' }}
                />
                <img
                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/CONTINENTS-example.jpg"
                    alt="example image of the continents"
                    style={{ width: '500px', height: 'auto', margin: '5px' }}
                />
                <img
                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/US-example.jpg"
                    alt="example image of America"
                    style={{ width: '500px', height: 'auto', margin: '5px' }}
                />
                <img
                    src="https://raw.githubusercontent.com/WeismanGitHub/Population-Map-Discord-Bot/main/images/IT-example.jpg"
                    alt="example image of Italy"
                    style={{ width: '500px', height: 'auto', margin: '5px' }}
                />
            </div>
        </div>
    );
}
