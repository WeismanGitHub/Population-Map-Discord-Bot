import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import React from 'react';
// import './css/index.css';

import Guilds from './guilds';
import Home from './home';

const router = createBrowserRouter([
    { path: '/', element: <Home/> },
    { path: '/guilds(/:guildID)', element: <Guilds/> },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router}/>);
