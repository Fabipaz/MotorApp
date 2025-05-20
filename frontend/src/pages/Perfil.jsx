import { useEffect, useState } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

export default function Perfil() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    foto: '', biografia: '', ciudad: '', moto: '', redes_sociales: ''
  });
  const [mensaje, setMensaje] = useState('');

  const fetchPerfil = async () => {
    try {
      const res = await api.get('/profile/me');
      setPerfil(res.data);
      setForm({
        foto: res.data.foto || '',
        biografia: res.data.biografia || '',
        ciudad: res.data.ciudad || '',
        moto: res.data.moto || '',
        redes_sociales: res.data.redes_sociales ? JSON.stringify(res.data.redes_sociales) : ''
      });
    } catch {
      setPerfil(null);
    }
  };

  useEffect(() => { fetchPerfil(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async e => {
    e.preventDefault();
    setMensaje('');
    try {
      const redes = form.redes_sociales ? JSON.parse(form.redes_sociales) : null;
      await api.put('/profile/me', { ...form, redes_sociales: redes });
      setMensaje('Perfil actualizado');
      setEditando(false);
      fetchPerfil();
    } catch {
      setMensaje('Error al actualizar el perfil');
    }
  };

  if (!perfil && !editando) return <div><h2>Perfil</h2><p>No tienes perfil aún. Haz clic en "Editar" para crear uno.</p><button onClick={() => setEditando(true)}>Editar</button></div>;

  return (
    <div>
      <h2>Perfil</h2>
      {mensaje && <p style={{ color: mensaje.includes('Error') ? 'red' : 'green' }}>{mensaje}</p>}
      {editando ? (
        <form onSubmit={handleGuardar} style={{ maxWidth: 400 }}>
          <input name="foto" placeholder="URL de foto" value={form.foto} onChange={handleChange} />
          <textarea name="biografia" placeholder="Biografía" value={form.biografia} onChange={handleChange} />
          <input name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} />
          <input name="moto" placeholder="Moto" value={form.moto} onChange={handleChange} />
          <textarea name="redes_sociales" placeholder='Redes sociales (JSON: {"instagram":"url",...})' value={form.redes_sociales} onChange={handleChange} />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
        </form>
      ) : (
        <div style={{ maxWidth: 400 }}>
          {perfil?.foto && <img src={perfil.foto} alt="Foto de perfil" style={{ width: 100, borderRadius: '50%' }} />}
          <p><b>Nombre:</b> {user.nombre}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Biografía:</b> {perfil?.biografia}</p>
          <p><b>Ciudad:</b> {perfil?.ciudad}</p>
          <p><b>Moto:</b> {perfil?.moto}</p>
          <p><b>Redes sociales:</b></p>
          <ul>
            {perfil?.redes_sociales && Object.entries(perfil.redes_sociales).map(([k, v]) => (
              <li key={k}><a href={v} target="_blank" rel="noopener noreferrer">{k}</a></li>
            ))}
          </ul>
          <button onClick={() => setEditando(true)}>Editar</button>
        </div>
      )}
    </div>
  );
} 