import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">GameVerse Hub</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Catálogo</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/estadisticas">Estadísticas</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/trivia">Trivia</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
