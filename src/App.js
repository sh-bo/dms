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

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <PrivateRoute>
                <Inbox />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-branch"
            element={
              <PrivateRoute>
                <Branches />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-department"
            element={
              <PrivateRoute>
                <Departments />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-role"
            element={
              <PrivateRoute>
                <Roles />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-type"
            element={
              <PrivateRoute>
                <Types />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-year"
            element={
              <PrivateRoute>
                <Years />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-category"
            element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-documents"
            element={
              <PrivateRoute>
                <Documents />
              </PrivateRoute>
            }
          />
          <Route
            path="/approve-documents"
            element={
              <PrivateRoute>
                <Approves />
              </PrivateRoute>
            }
          />
          <Route path="/auth" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
