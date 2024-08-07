import { useSearchParams, useNavigate } from 'react-router-dom';
import { ToastContainer, Toast } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import NavBar from './nav-bar';
import axios from 'axios';

function generateState() {
    const randomNumber = Math.floor(Math.random() * 10);
    let randomString = '';

    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }

    return randomString;
}

export default function Login() {
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
            axios
                .post('/api/v1/discord/oauth2', { code })
                .then(() => {
                    setAuthorized(true);
                })
                .catch(async (err: unknown) => {
                    if (axios.isAxiosError<{ error: string }>(err) && err.response?.data) {
                        setError(err.response.data.error || 'Something went wrong.');
                    } else {
                        setError('Something went wrong.');
                    }
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
        <>
            <div className="overflow-y-hidden vh-100">
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
            <ToastContainer position="top-end">
                <Toast
                    onClose={() => setError(null)}
                    show={error !== null}
                    autohide={true}
                    className="d-inline-block m-1"
                    bg={'danger'}
                >
                    <Toast.Header>
                        <strong className="me-auto">Something went wrong!</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <strong className="me-auto">{error}</strong>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}
