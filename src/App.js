import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Inbox from "./Pages/Inbox";
import Users from "./Pages/Users";
import Branches from "./Pages/Branches";
import Departments from "./Pages/Departments";
import Roles from "./Pages/Roles";
import Types from "./Pages/Types";
import Years from "./Pages/Years";
import Categories from "./Pages/Categories";
import Documents from "./Pages/Documents";
import Approves from "./Pages/Approves";
import LoginPage from "./Pages/LoginPage";
import ApprovedDocs from "./Pages/ApprovedDocs";
import RejectedDocs from "./Pages/RejectedDocs";
import ApproveByAdmin from "./Pages/ApproveByAdmin";
import RejectByAdmin from "./Pages/RejectByAdmin";
import UserRoleAssing from "./Pages/UserRoleAssing";
import PrivateRoute from "./Components/PrivateRoute";

// Define the roles
const ADMIN = "ADMIN";
const USER = "USER";

const protectedRoutes = [
  { path: "/", element: <Dashboard />, allowedRoles: [ADMIN, USER] },
  { path: "/inbox", element: <Inbox />, allowedRoles: [ADMIN, USER] },
  { path: "/users", element: <Users />, allowedRoles: [ADMIN, USER] },
  { path: "/create-branch", element: <Branches />, allowedRoles: [ADMIN] },
  { path: "/create-department", element: <Departments />, allowedRoles: [ADMIN] },
  { path: "/create-role", element: <Roles />, allowedRoles: [ADMIN] },
  { path: "/create-type", element: <Types />, allowedRoles: [ADMIN] },
  { path: "/create-year", element: <Years />, allowedRoles: [ADMIN] },
  { path: "/create-category", element: <Categories />, allowedRoles: [ADMIN] },
  { path: "/approve-documents", element: <Approves />, allowedRoles: [ADMIN] },
  { path: "/approve-by-admin", element: <ApproveByAdmin />, allowedRoles: [ADMIN] },
  { path: "/reject-by-admin", element: <RejectByAdmin />, allowedRoles: [ADMIN] },
  { path: "/userRoleAssing", element: <UserRoleAssing />, allowedRoles: [ADMIN] },
  { path: "/all-documents", element: <Documents />, allowedRoles: [USER] },
  { path: "/approvedDocs", element: <ApprovedDocs />, allowedRoles: [USER] },
  { path: "/rejectedDocs", element: <RejectedDocs />, allowedRoles: [USER] },

];

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute allowedRoles={route.allowedRoles}>
                  {route.element}
                </PrivateRoute>
              }
            />
          ))}
          <Route path="/auth" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
