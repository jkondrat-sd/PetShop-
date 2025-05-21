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
import FileUploadPage from "~/pages/Upload";
import DocumentsSearch from "~/pages/client/DocumentsSearch";
import DocumentEdit from "~/pages/client/DocumentEdit";
import Pets from "~/pages/client/Pets/Pets";
import Accessories from "~/pages/client/Accessories/Accessories";
import Blog from "~/pages/client/Blog/Blog";
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
          {
            path: "search/:keyword",
            element: <DocumentsSearch />,
          },
          {
            path: "search",
            element: <DocumentsSearch />,
          },
        ],
      },
      {
        path: "/blog",
        element: <Blog />,
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
    path: "cau-hoi-thuong-gap",
    element: <FrequentlyAskedQuestions />,
  },
  {
    path: "dieu-khoan-su-dung",
    element: <TermOfUse />,
  },
  {
    path: "gioi-thieu",
    element: <AboutUs />,
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
              {
                path: 'edit/:documentId',
                element: <DocumentEdit />
              }
            ],
          },
        ],
      },
    ],
  },
];

export const routesClient = [...publicRoutesClient, ...privateRoutesClient];
