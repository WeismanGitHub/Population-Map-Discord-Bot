import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { errorToast } from './toasts'
import React from 'react'
import ky from 'ky';

function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

export default function DiscordLogin() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [randomString] = useState(generateRandomString())
	const [authorized, setAuthorized] = useState(false)
	const navigate = useNavigate();

    useEffect(() => {
		const state = searchParams.get('state')
		const code = searchParams.get('code')
		setSearchParams({})

		if (!code || !state || localStorage.getItem('auth-state') !== atob(decodeURIComponent(state))) {
			return localStorage.setItem('auth-state', randomString);
		}
		
		ky.post('/api/v1/auth/login')
		.then(res => { setAuthorized(true) })
		.catch((err) => { errorToast(err.response.data.error || err.message) });
    }, [])
    
	if (authorized) {
		navigate('/')
	}

	return <>
		<a href={process.env.REACT_APP_OAUTH_URL + `&state=${btoa(randomString)}`}>
			Login
		</a>
	</>
}