import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { errorToast } from './toasts'
import ky, { HTTPError } from 'ky';
import NavBar from './nav-bar';
import React from 'react'

function generateState() {
	const randomNumber = Math.floor(Math.random() * 10);
	let randomString = '';

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

export default function DiscordOAuth2() {
	const [authorized, setAuthorized] = useState(false)
	const [searchParams] = useSearchParams();
	const randomString = generateState()
	const navigate = useNavigate();

	useEffect(() => {
		const mapCode = searchParams.get('mapCode')
		const guildID = searchParams.get('guildID')
		const state = searchParams.get('state')
		const code = searchParams.get('code')

		if (mapCode && guildID) {
			localStorage.setItem('mapCode', mapCode)
			localStorage.setItem('guildID', guildID)
		}

		if (code && state && localStorage.getItem('auth-state') === atob(decodeURIComponent(state))) {
			ky.post('/api/v1/auth/discord/oauth2', { json: { code } })
			.then(res => {
				setAuthorized(true)
			})
			.catch(async (res: HTTPError) => {
				const err: { error: string } = await res.response.json();

				errorToast(err.error || res.response.statusText || 'Something went wrong.')
			});
		} else {
			localStorage.setItem('auth-state', randomString);
		}
	}, [])
	
	if (authorized) {
		const [mapCode, guildID] = [localStorage.getItem('mapCode'), localStorage.getItem('guildID')]
		localStorage.clear()
		localStorage.setItem("loggedIn", "true");

		navigate((mapCode && guildID) ? `/maps/${guildID}?mapCode=${mapCode}` : '/')
	}

	return <>
		<NavBar/>
		<a className='oauth2-button' href={process.env.REACT_APP_OAUTH_URL + `&state=${btoa(randomString)}`}>
			Login
		</a>
	</>
}