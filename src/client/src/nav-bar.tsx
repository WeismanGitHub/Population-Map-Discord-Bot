import { ToastContainer, Toast, Modal, Button, Navbar, Nav } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

export default function NavBar() {
    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('loggedIn')));
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [show, setShow] = useState(false);

    function logout() {
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

            <Modal show={show} centered keyboard={true} onHide={() => setShow(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to log out?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={logout}>
                        Logout
                    </Button>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Navbar sticky="top" expand="md" className="bg-dark navbar-dark w-100">
                <div className="container-fluid">
                    <Navbar.Brand href="/" className="justify-content-start">
                        <div className="w-100 d-flex d-sm-inline justify-content-center">
                            <img
                                src="/icon.svg"
                                width="50"
                                height="50"
                                alt="icon"
                                className="rounded-5 bg-white me-2 ms-2 "
                            />
                        </div>
                        <span className="d-block d-sm-inline-block">Population Map Bot</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="justify-content-end" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav className="fs-4">
                            <Nav.Link
                                /* @ts-ignore */
                                href={import.meta.env.VITE_BOT_INVITE}
                            >
                                Invite
                            </Nav.Link>
                            <Nav.Link
                                /* @ts-ignore */
                                href={import.meta.env.VITE_SUPPORT_SERVER_INVITE}
                            >
                                Server
                            </Nav.Link>
                            <Nav.Link href="https://github.com/WeismanGitHub/Population-Map-Discord-Bot">
                                GitHub
                            </Nav.Link>
                            {loggedIn && <Nav.Item onClick={() => setShow(true)}>Logout</Nav.Item>}
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
        </>
    );
}
