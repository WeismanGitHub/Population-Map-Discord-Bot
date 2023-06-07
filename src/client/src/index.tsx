import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import React from 'react';
// import './css/index.css';

import Main from './main';

const router = createBrowserRouter([
    { path: '/', element: <Main/> },
]);

createRoot(document.getElementById("root")!)
.render(<>
    <RouterProvider router={router}/>
</>);
