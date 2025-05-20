import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nuevo, setNuevo] = useState({
    titulo: '', descripcion: '', fecha_salida: '', origen: '', destino: '', ruta_mapa: ''
  });
  const [creando, setCreando] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [accion, setAccion] = useState('');

  const fetchViajes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trips');
      setViajes(res.data);
    } catch (err) {
      setError('Error al cargar los viajes');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetalle = async (id) => {
    setError('');
    setDetalle(null);
    try {
      const res = await api.get(`/trips/${id}`);
      setDetalle(res.data);
    } catch (err) {
      setError('Error al obtener detalles');
    }
  };

  useEffect(() => { fetchViajes(); }, []);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleCrear = async e => {
    e.preventDefault();
    setCreando(true);
    setError('');
    try {
      await api.post('/trips', nuevo);
      setNuevo({ titulo: '', descripcion: '', fecha_salida: '', origen: '', destino: '', ruta_mapa: '' });
      fetchViajes();
    } catch (err) {
      setError('Error al crear el viaje');
    } finally {
      setCreando(false);
    }
  };

  const handleUnirse = async (id) => {
    setAccion('uniendo');
    setError('');
    try {
      await api.post(`/trips/${id}/join`);
      fetchDetalle(id);
      fetchViajes();
    } catch (err) {
      setError('Error al unirse al viaje');
    } finally {
      setAccion('');
    }
  };

  const handleSalir = async (id) => {
    setAccion('saliendo');
    setError('');
    try {
      await api.post(`/trips/${id}/leave`);
      fetchDetalle(id);
      fetchViajes();
    } catch (err) {
      setError('Error al salir del viaje');
    } finally {
      setAccion('');
    }
  };

  return (
    <div>
      <h2>Viajes</h2>
      <form onSubmit={handleCrear} style={{ marginBottom: 20 }}>
        <input name="titulo" placeholder="Título" value={nuevo.titulo} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={nuevo.descripcion} onChange={handleChange} />
        <input name="fecha_salida" type="datetime-local" value={nuevo.fecha_salida} onChange={handleChange} required />
        <input name="origen" placeholder="Origen" value={nuevo.origen} onChange={handleChange} required />
        <input name="destino" placeholder="Destino" value={nuevo.destino} onChange={handleChange} required />
        <input name="ruta_mapa" placeholder="URL de mapa" value={nuevo.ruta_mapa} type='url' onChange={handleChange}  />
        <button type="submit" disabled={creando}>{creando ? 'Creando...' : 'Crear viaje'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>Cargando viajes...</p> : (
        <ul>
          {viajes.map(v => (
            <li key={v.id}>
              <b>{v.titulo}</b> | {v.origen} → {v.destino} | {new Date(v.fecha_salida).toLocaleString()}<br/>
              {v.descripcion && <span>{v.descripcion}<br/></span>}
              <span>Participantes: {v.participantes?.length || 0}</span><br/>
              <button onClick={() => fetchDetalle(v.id)}>Ver detalles</button>
            </li>
          ))}
        </ul>
      )}
      {detalle && (
        <div style={{ border: '1px solid #ccc', marginTop: 20, padding: 10 }}>
          <h3>Detalles de viaje: {detalle.titulo}</h3>
          <p><b>Origen:</b> {detalle.origen}</p>
          <p><b>Destino:</b> {detalle.destino}</p>
          <p><b>Fecha salida:</b> {new Date(detalle.fecha_salida).toLocaleString()}</p>
          <p><b>Descripción:</b> {detalle.descripcion}</p>
          <p><b>Mapa:</b> {detalle.ruta_mapa ? <a href={detalle.ruta_mapa} target="_blank">Ver ruta</a> : 'No especificado'}</p>
          <p><b>Participantes:</b></p>
          <ul>
            {detalle.participantes?.map(p => <li key={p.id}>{p.nombre} ({p.email})</li>)}
          </ul>
          <button onClick={() => handleUnirse(detalle.id)} disabled={accion==='uniendo'}>Unirse</button>
          <button onClick={() => handleSalir(detalle.id)} disabled={accion==='saliendo'}>Salir</button>
          <button onClick={() => setDetalle(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
} 