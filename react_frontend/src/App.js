import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import VoterDetail from './VoterDetail';
import SearchPage from './SearchPage';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/details/:ncid" element={<VoterDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;