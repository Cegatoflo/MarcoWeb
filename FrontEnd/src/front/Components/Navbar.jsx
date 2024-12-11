import { NavItem } from './NavItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const navItems = ["Home", "Clientes", "Ordenes", "Inventario", "Informes"];

export function Navbar() {
    const navigate = useNavigate(); // Inicializa el hook para la navegación

    const handleLogout = async () => {
        try {
            // Realiza la solicitud de logout al backend
            await axios.post('https://pyfjs.onrender.com/api/auth/logout', {}, {
                withCredentials: true
            });

            // Elimina el token de la cookie
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=pyfjs.onrender.com; Secure; HttpOnly; SameSite=None";

            // Redirige al usuario a la página de login
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error.response?.data?.message || 'Error');
        }
    };

    return (
        <div className='navbar-container'>
            <div className='navbar-content'>
                <ul>
                    {navItems.map((item) => (
                        <NavItem key={item} locate={item} />
                    ))}
                </ul>
            </div>
            <div className='logout-container'>
                <button className='logout' onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
}
