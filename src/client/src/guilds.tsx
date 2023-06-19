import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ky from 'ky';

export default function Guilds() {
    const [geojson, setGeojson] = useState({})
    const { guildID } = useParams()
    guildID
    
    useEffect(() => {
        (async () => {
            const res = await ky.get('').json()

            setGeojson(res)
        })()
    }, [])

    return <>{geojson}</>
}