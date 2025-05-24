import { Navigate } from "react-router-dom";
import PrivateRoutesAdmin from "~/components/ui/PrivateRoutesAdmin";
import config from "~/config";
import DefaultLayout from "~/layouts/admin/DefaultLayout";
// import Dashboard from "~/pages/admin/dashboard/Dashboard";
import Login from "~/pages/admin/auth/Login";
import Logout from "~/pages/admin/auth/Logout";
import Users from "~/pages/admin/user/Users";
import Page404 from "~/pages/Page404";

import Roles from "~/pages/admin/role/Roles";


const RoutesAdmin = [
  //Public route
  { path: config.routesAdmin.auth.login, element: <Login /> },
  { path: config.routesAdmin.auth.logout, element: <Logout /> },
  { path: "*", element: <Page404 /> },
  // end Public route

  // Private route
  {
    element: <PrivateRoutesAdmin />,
    children: [
      {
        path: "/admin",
        element: <DefaultLayout />,
        children: [
          {
            path: "",
            element: <Navigate to={config.routesAdmin.dashboard} replace />,
          },
          {
            path: config.routesAdmin.dashboard,
            // element: <Dashboard />,
          },
          // {
          //   path: "users",
          //   children: [
          //     { path: "", element: <Users /> },
          //     {
          //       path: "detail/:id",
          //       element: <UserDetail />,
          //     },
          //   ],
          // },
          // {
          //   path: "documents",
          //   children: [
          //     {
          //       path: "",
          //       element: <AllDocument />,
          //     },
          //     {
          //       path: "search",
          //       element: <AllDocument />,
          //     },
          //     {
          //       path: "top-document",
          //       element: <TopDocuments />,
          //     },
          //     {
          //       path: "all-tag",
          //       element: <Tags />,
          //     },
          //     {
          //       path: "detail/:id",
          //       element: <DocumentDetail />,
          //     },
          //     {
          //       path: "upload",
          //       element: <Upload />,
          //     },
          //   ],
          // },
          // {
          //   path: "categories",
          //   children: [
          //     {
          //       path: "",
          //       element: <Categories />,
          //     },
          //     {
          //       path: "search",
          //       element: <Categories />,
          //     },
          //     {
          //       path: "detail/:categoryId/documents",
          //       element: <AllDocument />,
          //     },
          //   ],
          // },
          
          {
            path: "roles",
            children: [
              {
                path: "",
                element: <Roles />,
              },
            ],
          },
        ],
      },
    ],
  },
  // end Private route
];

export const routesAdmin = [...RoutesAdmin];
