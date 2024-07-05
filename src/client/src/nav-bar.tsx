import { ToastContainer, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function NavBar() {
    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('loggedIn')));
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isNavOpen, setIsNavOpen] = useState(false);

    function logout() {
        if (!window.confirm('Are you sure you want to logout?')) {
            return;
        }

        axios
            .post('/api/v1/logout')
            .then(() => {
                localStorage.removeItem('loggedIn');
                setLoggedIn(false);
                setSuccess('Logged out!');
            })
            .catch(() => setError('Could not log out.'));
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
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>{success}</Toast.Body>
                </Toast>
            </ToastContainer>
            <nav
                className="navbar navbar-expand-md py-1 ps-2 pe-2 navbar-dark bg-dark"
                style={{ textAlign: 'center', fontSize: 'x-large' }}
            >
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img
                            src="/icon.svg"
                            width="50"
                            height="50"
                            alt="icon"
                            className="me-2 rounded-5 bg-white"
                        />
                        <span className="d-block d-sm-inline-block">Population Map Bot</span>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsNavOpen(!isNavOpen)}
                        aria-controls="navbarNav"
                        aria-expanded={isNavOpen ? 'true' : 'false'}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className={`justify-content-end collapse navbar-collapse${isNavOpen ? ' show' : ''}`}
                        id="navbarNav"
                    >
                        <ul className="navbar-nav d-flex justify-content-center align-items-center">
                            <li className={`m-1 w-75 ${isNavOpen ? ' mb-2' : ''}`}>
                                {/* @ts-ignore */}
                                <a className="nav-item w-100" href={import.meta.env.VITE_BOT_INVITE}>
                                    Invite
                                </a>
                            </li>
                            <li className={`m-1 w-75 ${isNavOpen ? ' mb-2' : ''}`}>
                                <a
                                    className="nav-item w-100"
                                    /* @ts-ignore */
                                    href={import.meta.env.VITE_SUPPORT_SERVER_INVITE}
                                >
                                    Server
                                </a>
                            </li>
                            <li className={`m-1 w-75 ${isNavOpen ? ' mb-2' : ''}`}>
                                <a
                                    className="nav-item w-100"
                                    href="https://github.com/WeismanGitHub/Population-Map-Discord-Bot"
                                >
                                    GitHub
                                </a>
                            </li>
                            {loggedIn && (
                                <li className={`m-1 w-75 ${isNavOpen ? ' mb-2' : ''}`}>
                                    <a className="nav-item w-100" onClick={logout}>
                                        Logout
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
