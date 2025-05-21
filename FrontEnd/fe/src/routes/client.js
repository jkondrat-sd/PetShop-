import PrivateRoutesClient from "~/components/ui/PrivateRoutesClient";
import config from "~/config";
import LayoutDefault from "~/layouts/client/DefaultLayout";
import Home from "~/pages/client/Home/Home";
import Page404 from "~/pages/Page404";
import TermOfUse from "~/pages/client/TermOfUse";
import FrequentlyAskedQuestions from "~/pages/client/FrequentlyAskedQuestions";
import AboutUs from "~/pages/client/AboutUs";
import ConfirmAccount from "~/pages/client/ConfirmAccount";
import MyProfile from "~/pages/client/MyProfile";
import Pets from "~/pages/client/Pets/Pets";
import Accessories from "~/pages/client/Accessories/Accessories";
import Contact from "~/pages/client/Contact/Contact";
import Login from "~/pages/client/Login/Login";
import Register from "~/pages/client/Register/Register";
import Detail from "~/pages/client/Detail";

const publicRoutesClient = [
  // Public routes
  {
    path: config.routesClient.home,
    element: <LayoutDefault />,
    children: [
      { path: config.routesClient.home, element: <Home /> },
      {
        path: "/pets",
        element: <Pets />,
      },
      {
        path: "/accessories",
        element: <Accessories />,
        children: [
          
        ],
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: "/register",
        element: <Register/>,
      },
    ],
  },
  {
    path: "dieu-khoan-su-dung",
    element: <TermOfUse />,
  },
  {
    path: "confirm-account",
    children: [
      // { path: "", element: <ConfirmAccount /> },          // Handles /confirm-account?token=xyz
      { path: ":code", element: <ConfirmAccount /> }, // Handles /confirm-account/xyz
    ],
  },
  {
    path: "/account/profile",
    element: <MyProfile />,
  },
  { path: "*", element: <Page404 /> },
];

const privateRoutesClient = [
  {
    path: '/',
    element: <LayoutDefault />,
    children: [
      {
        element: <PrivateRoutesClient />,
        children: [
          {
            path: "/documents",
            children: [
              {
                path: ":documentId",
                element: <Detail />,
              },
              
            ],
          },
        ],
      },
    ],
  },
];

export const routesClient = [...publicRoutesClient, ...privateRoutesClient];
