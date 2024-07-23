import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Inbox from './Pages/Inbox';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/inbox" element={<Inbox />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
