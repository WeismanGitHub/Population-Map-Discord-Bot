import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import React from 'react';
import './styles.css';

import DiscordOAuth2 from "./discord-oauth2";
import Guild from './guild';
import Home from './home';

const router = createBrowserRouter([
    { path: '/', element: <Home/> },
    { path: '/maps/:guildID', element: <Guild/> },
    { path: '/discord/oauth2', element: <DiscordOAuth2/> },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router}/>);
