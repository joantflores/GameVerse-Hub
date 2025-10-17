import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Catalogo from "./components/Catalogo";
import Estadisticas from "./components/Estadisticas";
import Trivia from "./components/Trivia";

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Catalogo />} />
                <Route path="/estadisticas" element={<Estadisticas />} />
                <Route path="/trivia" element={<Trivia />} />
            </Routes>
        </Router>
    );
}
