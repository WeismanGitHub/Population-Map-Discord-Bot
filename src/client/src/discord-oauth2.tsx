import { useSearchParams, useNavigate } from 'react-router-dom';
import { ToastContainer, Toast } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ky, { HTTPError } from 'ky';
import NavBar from './nav-bar';

function generateState() {
    const randomNumber = Math.floor(Math.random() * 10);
    let randomString = '';

    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }

    return randomString;
}

export default function DiscordOAuth2() {
    const [error, setError] = useState<string | null>(null);
    const [authorized, setAuthorized] = useState(false);
    const [searchParams] = useSearchParams();
    const randomString = generateState();
    const navigate = useNavigate();

    useEffect(() => {
        const mapCode = searchParams.get('mapCode');
        const guildID = searchParams.get('guildID');
        const state = searchParams.get('state');
        const code = searchParams.get('code');

        if (mapCode && guildID) {
            localStorage.setItem('mapCode', mapCode);
            localStorage.setItem('guildID', guildID);
        }

        if (code && state && localStorage.getItem('auth-state') === atob(decodeURIComponent(state))) {
            ky.post('/api/v1/auth/discord/oauth2', { json: { code } })
                .then(() => {
                    setAuthorized(true);
                })
                .catch(async (res: HTTPError) => {
                    const err: { error: string } = await res.response.json();
                    setError(err.error || res.response.statusText || 'Something went wrong.');
                });
        } else {
            localStorage.setItem('auth-state', randomString);
        }
    }, []);

    if (authorized) {
        const [mapCode, guildID] = [localStorage.getItem('mapCode'), localStorage.getItem('guildID')];
        localStorage.clear();
        localStorage.setItem('loggedIn', 'true');

        navigate(mapCode && guildID ? `/maps/${guildID}?mapCode=${mapCode}` : '/');
    }

    return (
        <div className="overflow-y-hidden vh-100">
            <ToastContainer position="top-end">
                <Toast
                    onClose={() => setError(null)}
                    show={error !== null}
                    autohide={true}
                    className="d-inline-block m-1"
                    bg={'danger'}
                >
                    <Toast.Header>
                        <strong className="me-auto">{error}</strong>
                    </Toast.Header>
                </Toast>
            </ToastContainer>
            <NavBar />
            <div
                className="d-flex justify-content-center align-items-center m-auto"
                style={{ height: '96vh' }}
            >
                <a
                    className="btn-custom btn-xl"
                    /* @ts-ignore */
                    href={import.meta.env.VITE_OAUTH_URL + `&state=${btoa(randomString)}`}
                >
                    Login
                </a>
            </div>
        </div>
    );
}
