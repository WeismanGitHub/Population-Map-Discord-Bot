import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import React from 'react';
// import './css/index.css';

import DiscordAuth from "./discord-oauth";
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
    { path: '/auth/discord', element: <DiscordAuth/> },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router}/>);
