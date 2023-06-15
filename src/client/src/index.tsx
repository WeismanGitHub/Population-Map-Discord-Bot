import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import React from 'react';
// import './css/index.css';

import DiscordOAuth2 from "./discord-oauth2";
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
    { path: '/oauth2', element: <DiscordOAuth2/> },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router}/>);
