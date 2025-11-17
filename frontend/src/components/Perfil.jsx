import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cerrarSesion } from "../services/authService";

export default function Perfil() {
    const { usuario, userData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await cerrarSesion();
        navigate('/login');
    };

    if (!usuario) {
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <h3>You are not authenticated</h3>
                        <p>Please sign in to view your profile.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Profile</h3>
                            <p><strong>Name:</strong> {userData?.displayName || usuario.email}</p>
                            <p><strong>Email:</strong> {usuario.email}</p>
                            <button className="btn btn-danger" onClick={handleLogout}>Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
