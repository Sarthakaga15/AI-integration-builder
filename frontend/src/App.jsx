import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InputPage from './pages/InputPage';
import ResultsPage from './pages/ResultsPage';
import SandboxPage from './pages/SandboxPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
      </Routes>
    </Router>
  );
}

export default App;
