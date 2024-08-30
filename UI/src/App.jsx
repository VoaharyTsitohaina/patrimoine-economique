import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListPossessionPage from './pages/ListPossessionPage';
import CreatePossessionPage from './pages/CreatePossessionPage';
import UpdatePossessionPage from './pages/UpdatePossessionPage';
import PatrimoinePage from './pages/PatrimoinePage';
import NavigationBar from './components/NavigationBar';

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/possession" element={<ListPossessionPage />} />
        <Route path="/possession/create" element={<CreatePossessionPage />} />
        <Route path="/possession/:libelle/update" element={<UpdatePossessionPage />} />
        <Route path="/patrimoine" element={<PatrimoinePage />} />
        {/* Autres routes si nécessaire */}
      </Routes>
    </Router>
  );
};

export default App;
