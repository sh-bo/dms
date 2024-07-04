import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FormPage from './Pages/FormPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<FormPage />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
