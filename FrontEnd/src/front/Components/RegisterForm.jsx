import '../Styles/SForms.css';
import { Helmet } from 'react-helmet';
import axios from 'axios'; 
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post('https://pyfjs.onrender.com/api/auth/register', {
        email,    
        password
      });
      
      console.log('Registro exitoso:', response.data);
      navigate('/login');

    } catch (error) {
      console.error('Error al registrar:', error);
      setError("Error al registrar. Intenta de nuevo."); 
    }
  };

  return (
    <>
      <Helmet>
        <title>Regístrate</title>
      </Helmet>
      <div className="solo-form-container">
        <form className="loginForm" onSubmit={handleSubmit}>
          <legend>Regístrate</legend>
          <label className="labelForm">Email:</label>
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label className="labelForm">Contraseña:</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <label className="labelForm">Confirmar Contraseña:</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          {error && <p className="error">{error}</p>} 
          <button type="submit">Regístrate</button>
          <label>¿Ya tienes una cuenta? <a href="/login">Iniciar Sesión</a></label>
        </form>
      </div>
    </>
  );
}
