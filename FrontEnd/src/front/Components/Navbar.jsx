import { NavItem } from './NavItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const navItems = ["Home", "Clientes", "Ordenes", "Inventario", "Informes"];

export function Navbar() {
    const navigate = useNavigate(); // Inicializa el hook para la navegación

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4000/api/auth/logout', {}, {
                withCredentials: true 
            });
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
