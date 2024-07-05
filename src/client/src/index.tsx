import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import Login from './login';
import Guild from './guild';
import Home from './home';

const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/maps/:guildID', element: <Guild /> },
    { path: '/discord/oauth2', element: <Login /> },
]);

createRoot(document.getElementById('root')!).render(
    <>
        <RouterProvider router={router} />
    </>
);
