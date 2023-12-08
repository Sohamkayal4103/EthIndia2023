import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import CreateDAO from "./pages/CreateDAO/CreateDAO";
import RegisterUser from "./pages/RegisterUser/RegisterUser";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-dao" element={<CreateDAO />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
    </Router>
  );
}

export default App;
