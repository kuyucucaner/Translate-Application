import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TranslateForm from './components/translate-form';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<TranslateForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
