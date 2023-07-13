import React, { useEffect, useState } from 'react'
import NavBar from './nav-bar'
import ky from 'ky'

interface BotAPIRes {
    guildCount: number
    botInviteURL: string
    supportServerInvite: string
    githubURL: string
    buyMeACoffeeURL: string
}

export default function Home() {
    const [res, setRes] = useState<BotAPIRes>()

    useEffect(() => {
        ky.get('/api/v1/bot/').json().then(res => {
            setRes(res as BotAPIRes)
        })
    }, [])

    return (<div style={{ textAlign: 'center', fontSize: 'x-large' }}>
        <NavBar/>
        In {res?.guildCount} Servers
        <br/>
        <br/>
        <a href={res?.botInviteURL}>Bot Invite</a>
        <br/>
        <br/>
        <a href={res?.supportServerInvite}>Support Server</a>
        <br/>
        <br/>
        <a href={res?.githubURL}>Github</a>
        <br/>
        <br/>
        <a href={res?.buyMeACoffeeURL}>Buy Me a Coffee</a>
    </div>)
}