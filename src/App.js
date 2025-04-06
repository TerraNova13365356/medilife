import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/dashboard';
import MediLife from './pages/HomePage';
import MedicineSearchPage from './pages/store';
import AddMedicine from './pages/donate_page';
import History from './pages/history';
import MedicineOrdersPage from './pages/view-order';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Default page - medicine search/store */}
          <Route path="/search" element={<MedicineSearchPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Home page */}
          <Route path="/" element={<MediLife />} />

          {/* Donate Medicine page */}
          <Route path="/donate" element={<AddMedicine />} />
          <Route path="/history" element={<History/>} />
          <Route path="/order" element={<MedicineOrdersPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
