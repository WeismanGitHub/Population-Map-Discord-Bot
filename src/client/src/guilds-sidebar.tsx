import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios, * as others from 'axios'
import React from 'react'

export default function GuildsSidebar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [guilds, setGuilds] = useState([])

    useEffect(() => {
    }, [])

    return <div className='guilds'>
        { guilds.map(guild => <div>
            <img
                src={guild.iconURL}
                alt="server icon"
                width = "60"
                height = "60"
                title = {guild.name}
                onClick={() => {}}>
            </img>
        </div>)}
    </div>
}