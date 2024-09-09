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
  );
}

export default App;
