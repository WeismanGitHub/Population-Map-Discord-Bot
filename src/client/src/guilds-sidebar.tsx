import { useState, useEffect } from 'react';
// import axios, * as others from 'axios'
import React from 'react'

export default function GuildsSidebar() {
    const [guilds, setGuilds] = useState([])
    setGuilds([])

    useEffect(() => {
    }, [])

    return <div className='guilds'>
        { guilds.map(guild => <div>
            {/* <img
                src={guild.iconURL}
                alt="server icon"
                width = "60"
                height = "60"
                title = {guild.name}
                onClick={() => {}}>
            </img> */}
        </div>)}
    </div>
}