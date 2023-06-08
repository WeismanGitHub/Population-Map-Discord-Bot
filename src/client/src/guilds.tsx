import { useParams } from 'react-router-dom';
import React from 'react'

export default function Guilds() {
    const { guildID } = useParams()

    return (<>
        { guildID }
    </>)
}