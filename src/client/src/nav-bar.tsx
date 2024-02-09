import { ToastContainer, Toast } from 'react-bootstrap';
import React, { useState } from 'react';
import ky from 'ky';

export default function NavBar() {
    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('loggedIn')));
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    function logout() {
        if (!window.confirm('Are you sure you want to logout?')) {
            return;
        }

        ky.post('/api/v1/auth/logout')
            .then((res) => {
                localStorage.removeItem('loggedIn');
                setLoggedIn(false);
                setSuccess('Logged out!');
            })
            .catch((err) => setError('Could not log out.'));
    }

    return (
        <>
            <ToastContainer position="top-end">
                <Toast
                    onClose={() => setError(null)}
                    show={error !== null}
                    autohide={true}
                    className="d-inline-block m-1"
                    bg={'danger'}
                >
                    <Toast.Header>
                        <strong className="me-auto">An error occurred!</strong>
                    </Toast.Header>
                    <Toast.Body>{error}</Toast.Body>
                </Toast>
            </ToastContainer>
            <ToastContainer position="top-end">
                <Toast
                    onClose={() => setSuccess(null)}
                    show={success !== null}
                    autohide={true}
                    className="d-inline-block m-1"
                    bg={'success'}
                >
                    <Toast.Header>
                        <strong className="me-auto">{success}</strong>
                    </Toast.Header>
                </Toast>
            </ToastContainer>
            <nav className="navbar navbar-expand ps-2 pe-2 justify-content-between py-1">
                <a className="navbar-brand" href="/">
                    <img src="/icon.png" width="50" height="50" alt="icon" className="me-2 rounded-5" />
                    Population Map Bot
                </a>

                <div className="justify-content-start navbar-nav">
                    {loggedIn && (
                        <a className="nav-item" onClick={logout}>
                            logout
                        </a>
                    )}
                </div>
            </nav>
        </>
    );
}
