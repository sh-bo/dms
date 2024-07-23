import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Inbox from './Pages/Inbox';
import Users from './Pages/Users';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/inbox" element={<Inbox />}/>
          <Route path="/users" element={<Users />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
