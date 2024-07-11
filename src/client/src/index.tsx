import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import Example from './example';
import Login from './login';
import Guild from './guild';
import Home from './home';

const router = createBrowserRouter([
    { path: '/discord/oauth2', element: <Login /> },
    { path: '/maps/:guildID', element: <Guild /> },
    { path: '/example', element: <Example /> },
    { path: '/', element: <Home /> },
]);

createRoot(document.getElementById('root')!).render(
    <>
        <RouterProvider router={router} />
    </>
);
