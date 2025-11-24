import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './Login.css';

const Login = ({ mode = 'admin' }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useStore();
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      const success = login(password);
      
      if (success) {
        navigate('/admin/bags');
      } else {
        setError('Mot de passe incorrect');
        setPassword('');
      }
      
      setIsLoading(false);
    }, 300);
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          
          <h1 className="login-title">JambonRider</h1>
          <p className="login-subtitle">
            Mode Administrateur
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe Admin
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe admin"
              className="form-input"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="login-button primary"
            disabled={isLoading || !password}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="login-button"
            style={{ marginTop: 'var(--spacing-sm)' }}
          >
            ← Retour à l'accueil
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
