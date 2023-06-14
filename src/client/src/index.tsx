import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import React from 'react';
// import './css/index.css';

import DiscordLogin from "./discord-login";
import Guilds from './guilds';
import Home from './home';

const router = createBrowserRouter([
    { path: '/', element: <Home/> },
    {
        path: '/guilds',
        element: <Guilds/>,
        children: [{
            path: '/guilds/:guildID',
            element: <Guilds/>
        }]
    },
    { path: '/auth/login', element: <DiscordLogin/> },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router}/>);
