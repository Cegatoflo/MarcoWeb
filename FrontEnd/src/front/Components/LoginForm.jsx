import '../Styles/SForms.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://pyfjs.onrender.com/api/auth/login', {
                email,
                password
            }, {
                withCredentials: true // Permite el envío de cookies
            });

            console.log('Inicio de sesión exitoso:', response.data);

            // Si el backend ya envía el token como cookie, no necesitas guardarlo aquí
            // Puedes acceder a la cookie en futuras solicitudes automáticamente
            navigate('/menu'); // Navega a la página de menú después del inicio de sesión exitoso
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el inicio de sesión');
            console.error('Error en el inicio de sesión:', err);
        }
    };

    const handleForgotPassword = async () => {
        setInfoMessage('');
        setError('');

        try {
            await axios.post('https://pyfjs.onrender.com/api/auth/solicitarCambioContrasena', {
                email
            });
            setInfoMessage('Una clave de acceso ha sido enviada a tu correo electrónico.');
            navigate('/recuperar');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al solicitar el cambio de contraseña');
            console.error('Error al solicitar el cambio de contraseña:', err);
        }
    };

    return (
        <>
            <Helmet>
                <title>Iniciar Sesión</title>
            </Helmet>
            <div className="solo-form-container">
                <form className="loginForm" onSubmit={handleSubmit}>
                    <legend>Iniciar Sesión</legend>
                    <label className="labelForm">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className="labelForm">Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <div className="error-message">{error}</div>}
                    {infoMessage && <div className="info-message">{infoMessage}</div>}
                    {/* <button type="button" className="linksForm saliente" onClick={handleForgotPassword}>
                        Olvidé mi contraseña
                    </button> */}
                    <div className='linksc'>
                    <a href="/recuperar" className="linksForm" onClick={handleForgotPassword}>
                        Olvidé mi contraseña
                    </a></div>
                    <button type="submit">Iniciar sesión</button>
                    <label>¿Aún no tienes una cuenta? <a href="/register">Regístrate</a></label>
                </form>
            </div>
        </>
    );
}