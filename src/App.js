<<<<<<< HEAD
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
  { path: "/all-documents", element: <Documents />, allowedRoles: [USER] },
  { path: "/approve-documents", element: <Approves />, allowedRoles: [ADMIN] },
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
=======
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Inbox from './Pages/Inbox';
import Users from './Pages/Users';
import Branches from './Pages/Branches';
import Departments from './Pages/Departments';
import Roles from './Pages/Roles';
import Types from './Pages/Types';
import Years from './Pages/Years';
import Categories from './Pages/Categories';
import Documents from './Pages/Documents';
import Approves from './Pages/Approves';
import LoginPage from './Pages/LoginPage';
import PrivateRoute from './Components/PrivateRoute';
import YourComponent from './Data/YourComponent';
import { UserProvider } from './Components/UserContext';  // Import UserProvider

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute allowedRoles={['ADMIN', 'USER']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <Inbox />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute allowedRoles={['ADMIN']}>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-branch"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <Branches />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-department"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <Departments />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-role"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <Roles />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-type"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <Types />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-year"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <Years />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-category"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <Categories />
                </PrivateRoute>
              }
            />
            <Route
              path="/all-documents"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <Documents />
                </PrivateRoute>
              }
            />
            <Route
              path="/approve-documents"
              element={
                <PrivateRoute allowedRoles={['ADMIN']}>
                  <Approves />
                </PrivateRoute>
              }
            />
            <Route
              path="/YourComponent"
              element={
                <PrivateRoute allowedRoles={['USER']}>
                  <YourComponent />
                </PrivateRoute>
              }
            />
            <Route path="/auth" element={<LoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
>>>>>>> 9c2e08c1303f505d8e1b011b77a20c46472f84ba
  );
}

export default App;
