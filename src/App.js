import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Inbox from './Pages/Inbox';
import Users from './Pages/Users';
import Branches from './Pages/Branches';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/inbox" element={<Inbox />}/>
          <Route path="/users" element={<Users />}/>
          <Route path="/create-branch" element={<Branches />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
