import { useSearchParams } from 'react-router-dom';

import React from 'react'

export default function Guilds() {
    const [searchParams] = useSearchParams();

    return (<>
        { searchParams}
    </>)
}