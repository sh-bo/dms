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

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/inbox" element={<Inbox />}/>
          <Route path="/users" element={<Users />}/>
          <Route path="/create-branch" element={<Branches />}/>
          <Route path="/create-department" element={<Departments />}/>
          <Route path="/create-role" element={<Roles />}/>
          <Route path="/create-type" element={<Types />}/>
          <Route path="/create-year" element={<Years />}/>
          <Route path="/create-category" element={<Categories />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
