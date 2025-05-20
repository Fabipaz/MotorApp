import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">🏍️ MotorApp</div>
        <button className="navbar-toggle" onClick={() => setOpen(o => !o)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className={`navbar-links${open ? ' open' : ''}`}>
          <Link to="/">Inicio</Link>
          <Link to="/viajes">Viajes</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/perfil">Perfil</Link>
          <Link to="/noticias">Noticias</Link>
          {user?.rol === 'admin' && <Link to="/admin">Admin</Link>}
          {user && <button onClick={logout}>Cerrar sesión</button>}
        </div>
      </div>
    </nav>
  );
} 