import { useEffect, useState } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

export default function Admin() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [form, setForm] = useState({ titulo: '', contenido: '', imagen: '', enlace: '', fecha: '' });
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Cargar usuarios y noticias
  const fetchUsuarios = async () => {
    const res = await api.get('/users');
    setUsuarios(res.data);
  };
  const fetchNoticias = async () => {
    const res = await api.get('/news');
    setNoticias(res.data);
  };
  useEffect(() => { fetchUsuarios(); fetchNoticias(); }, []);

  // Manejo de formulario de noticia
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/news/${editId}`, form);
        setMensaje('Noticia actualizada');
      } else {
        await api.post('/news', form);
        setMensaje('Noticia creada');
      }
      setForm({ titulo: '', contenido: '', imagen: '', enlace: '', fecha: '' });
      setEditId(null);
      fetchNoticias();
    } catch {
      setMensaje('Error al guardar noticia');
    }
  };
  const handleEdit = n => {
    setEditId(n.id);
    setForm({ titulo: n.titulo, contenido: n.contenido, imagen: n.imagen || '', enlace: n.enlace || '', fecha: n.fecha?.slice(0, 10) || '' });
  };
  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar noticia?')) return;
    try {
      await api.delete(`/news/${id}`);
      setMensaje('Noticia eliminada');
      fetchNoticias();
    } catch {
      setMensaje('Error al eliminar noticia');
    }
  };
  const handleCancel = () => {
    setEditId(null);
    setForm({ titulo: '', contenido: '', imagen: '', enlace: '', fecha: '' });
  };

  if (user.rol !== 'admin') return <div><h2>Acceso solo para administradores</h2></div>;

  return (
    <div>
      <h2>Panel de Administración</h2>
      <h3>Usuarios</h3>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nombre} ({u.email}) - {u.rol}</li>
        ))}
      </ul>
      <h3>Noticias manuales</h3>
      {mensaje && <p style={{ color: mensaje.includes('Error') ? 'red' : 'green' }}>{mensaje}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
        <textarea name="contenido" placeholder="Contenido" value={form.contenido} onChange={handleChange} required />
        <input name="imagen" placeholder="URL de imagen" value={form.imagen} onChange={handleChange} />
        <input name="enlace" placeholder="Enlace externo" value={form.enlace} onChange={handleChange} />
        <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'} noticia</button>
        {editId && <button type="button" onClick={handleCancel}>Cancelar</button>}
      </form>
      <ul>
        {noticias.map(n => (
          <li key={n.id} style={{ marginBottom: 20 }}>
            <b>{n.titulo}</b> <span style={{ color: '#888' }}>{new Date(n.fecha).toLocaleDateString()}</span><br/>
            <span>{n.contenido}</span><br/>
            {n.imagen && <img src={n.imagen} alt="" style={{ width: 120 }} />}<br/>
            {n.enlace && <a href={n.enlace} target="_blank" rel="noopener noreferrer">Leer más</a>}<br/>
            <button onClick={() => handleEdit(n)}>Editar</button>
            <button onClick={() => handleDelete(n.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 