const PATH_ADMIN = "/admin";

const routesAdmin = {
  dashboard: PATH_ADMIN + "/dashboard",
  auth: {
    login: PATH_ADMIN + "/auth/login",
    logout: PATH_ADMIN + "/auth/logout",
  },
  users: {
    list: PATH_ADMIN + "/users",
  },
  // Thêm routes cho phần quản lý thú cưng
  pets: {
    list: PATH_ADMIN + "/pets",
    create: PATH_ADMIN + "/pets/create",
    edit: PATH_ADMIN + "/pets/edit/:id",
    details: PATH_ADMIN + "/pets/:id",
  },
  accessories: {
    list: PATH_ADMIN + "/accessories/list",
    create: PATH_ADMIN + "/accessories/create",
    edit: PATH_ADMIN + "/accessories/edit/:id",
    details: PATH_ADMIN + "/accessories/:id",
  },
};

export default routesAdmin;