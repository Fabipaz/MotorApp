import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import Viajes from './pages/Viajes';
import Chat from './pages/Chat';
import Perfil from './pages/Perfil';
import Noticias from './pages/Noticias';
import Admin from './pages/Admin';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function Home() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Bienvenido, {user?.nombre}</h2>
      <p>¡Explora la app desde el menú superior!</p>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/viajes" element={<PrivateRoute><Viajes /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/noticias" element={<PrivateRoute><Noticias /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}
