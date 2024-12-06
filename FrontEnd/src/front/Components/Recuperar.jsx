import { useState } from 'react';
import axios from 'axios';

export function Recuperar() {
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [message, setMessage] = useState('');

    const cambiarContrasena = async () => {
        setMessage(''); // Resetear mensaje antes de enviar solicitud
        try {
            const response = await axios.post('https://pyfjs.onrender.com/api/auth/cambiarContrasena', {
                email,
                nuevaContrasena,
                claveAccesoUser: codigo // Usa el nombre correcto esperado por tu backend
            });
            alert(response.data.message || 'Contraseña cambiada exitosamente');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al cambiar la contraseña');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Recuperar Contraseña</h2>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Código:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nueva Contraseña:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={nuevaContrasena}
                                        onChange={(e) => setNuevaContrasena(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="button" className="btn btn-primary w-100" onClick={cambiarContrasena}>
                                    Cambiar Contraseña
                                </button>
                            </form>
                            {message && <div className="alert alert-danger mt-3">{message}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}