import PrivateRoutesClient from "~/components/ui/PrivateRoutesClient";
import config from "~/config";
import LayoutDefault from "~/layouts/client/DefaultLayout";
import Home from "~/pages/client/Home/Home";
import Page404 from "~/pages/Page404";
import TermOfUse from "~/pages/client/TermOfUse";
import ConfirmAccount from "~/pages/client/ConfirmAccount";
import Pets from "~/pages/client/Pets/Pets";
import Accessories from "~/pages/client/Accessories/Accessories";
import Contact from "~/pages/client/Contact/Contact";
import Login from "~/pages/client/Login/Login";
import Register from "~/pages/client/Register/Register";
import ForgotPasswordModal from "~/pages/client/ForgotPassword";
import PetDetail from "~/pages/client/Pets/PetDetail/PetDetail";
import AccessoryDetail from "~/pages/client/Accessories/AccessoryDetail/AccessoryDetail";
import CheckOutPage from "~/pages/client/CheckOutPage/CheckOutPage";
import Profile from "~/pages/client/Profile/Profile";

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
        // children: [
        //       {
        //         path: ":/pets/:id",
        //         element: <PetDetail />,
        //       },
              
        //     ],
      },
      {
        path: "/pets/:id",  // Add route for pet detail
        element: <PetDetail />,
      },
      {
        path: "/accessories",
        element: <Accessories />,
        children: [
          
        ],
      },

      {
        path: "/accessories/:id",  // Add route for pet detail
        element: <AccessoryDetail />,
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
      {
        path: "/forgot-password",
        element: <ForgotPasswordModal/>,
      },
      {
        path: "/check-out",
        element: <CheckOutPage/>,
      },
      {
        path: "/users/profile",
        element: <Profile />,
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
  { path: "*", element: <Page404 /> },
];

const privateRoutesClient = [
  {
    path: '/',
    element: <LayoutDefault />,
    children: [
      {
        element: <PrivateRoutesClient />,
        // children: [
        //   {
        //     path: "/documents",
        //     children: [
        //       {
        //         path: ":documentId",
        //         element: < />,
        //       },
              
        //     ],
        //   },
        // ],
      },
    ],
  },
];

export const routesClient = [...publicRoutesClient, ...privateRoutesClient];
