import { lazy } from "react";
import { Navigate } from "react-router-dom";

/***** Pages ****/

import Starter from "../views/Starter.js";
import About from "../views/About.js";
import Alerts from "../views/ui/Alerts";
import Badges from "../views/ui/Badges";
import Buttons from "../views/ui/Buttons";
import Cards from "../views/ui/Cards";
import Grid from "../views/ui/Grid";
import Tables from "../views/ui/Tables";
import Forms from "../views/ui/Forms";
import Breadcrumbs from "../views/ui/Breadcrumbs";
import Customers from "../views/ui/Customers";
import Suppliers from "../views/ui/Suppliers";
import StockIn from "../views/ui/StockIn";
import Pricing from "../views/ui/Pricing";
import DamageReport from "../views/ui/DamageReport";
import ReturnReport from "../views/ui/ReturnReport.js";
import Profit from "../views/ui/Profit.js";
import Login from "../views/ui/Login";
import Workers from "../views/ui/Workers";
import LoginRequests from "../views/ui/LoginRequests";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/about", exact: true, element: <About /> },
      { path: "/alerts", exact: true, element: <Alerts /> },
      { path: "/badges", exact: true, element: <Badges /> },
      { path: "/buttons", exact: true, element: <Buttons /> },
      { path: "/cards", exact: true, element: <Cards /> },
      { path: "/grid", exact: true, element: <Grid /> },
      { path: "/table", exact: true, element: <Tables /> },
      { path: "/forms", exact: true, element: <Forms /> },
      { path: "/breadcrumbs", exact: true, element: <Breadcrumbs /> },
      { path: "/customers", exact: true, element: <Customers /> },
      { path: "/suppliers", exact: true, element: <Suppliers /> },
      { path: "/stock-in", exact: true, element: <StockIn /> },
      { path: "/pricing", exact: true, element: <Pricing /> },
      { path: "/damage", exact: true, element: <DamageReport /> },
      { path: "/return", exact: true, element: <ReturnReport /> },
      { path: "/profit", exact: true, element: <Profit /> },
      { path: "/workers", exact: true, element: <Workers /> },
      { path: "/requests", exact: true, element: <LoginRequests /> }
    ],
  },
  {
    path: "/",
    children: [{ path: "/login", element: <Login /> }],
  },
];

export default ThemeRoutes;
