import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';

// Je kunt hier later meer pagina's toevoegen, zoals /instellingen of /geschiedenis
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/history" element={<HistoryPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;