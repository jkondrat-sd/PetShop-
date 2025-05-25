import { Navigate } from "react-router-dom";
import PrivateRoutesAdmin from "~/components/ui/PrivateRoutesAdmin";
import config from "~/config";
import DefaultLayout from "~/layouts/admin/DefaultLayout";
import Dashboard from "~/pages/admin/Dashboard/Dashboard";
import PetsList from "~/pages/admin/pets/PetList";
import CreatePet from "~/pages/admin/pets/CreatePet";
import EditPet from "~/pages/admin/pets/EditPet";
import PetDetails from "~/pages/admin/pets/PetDetails";
import Login from "~/pages/admin/auth/Login";
import Logout from "~/pages/admin/auth/Logout/Logout";
import Page404 from "~/pages/Page404";
import Roles from "~/pages/admin/role/Roles";
import AccessoryList from "~/pages/admin/accessories/AccessoryList";
import CreateAccessory from "~/pages/admin/accessories/CreateAccessory";
import EditAccessory from "~/pages/admin/accessories/EditAccessory";
import AccessoryDetails from "~/pages/admin/accessories/AccessoryDetails";

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
            element: <Dashboard />,
          },
          {
            path: "pets",
            children: [
              {
                path: "",
                element: <Navigate to="list" replace />,
              },
              {
                path: "list",
                element: <PetsList />,
              },
              {
                path: "create",
                element: <CreatePet />,
              },
              {
                path: "edit/:id",
                element: <EditPet />,
              },
              {
                path: ":id",
                element: <PetDetails />,
              },
            ],
          },
          {
            path: "roles",
            children: [
              {
                path: "",
                element: <Roles />,
              },
            ],
          },
          {
            path: "accessories",
            children: [
              {
                path: "",
                element: <Navigate to="list" replace />,
              },
              {
                path: "list",
                element: <AccessoryList />,
              },
              {
                path: "create",
                element: <CreateAccessory />,
              },
              {
                path: "edit/:id",
                element: <EditAccessory />,
              },
              {
                path: ":id",
                element: <AccessoryDetails />,
              },
            ],
          },
          // Thêm các route khác tại đây
        ],
      },
    ],
  },
  // end Private route
];

export const routesAdmin = [...RoutesAdmin];