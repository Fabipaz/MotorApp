import { useEffect, useState, useRef } from 'react';
import socket from '../services/socket';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

export default function Chat() {
  const { user } = useAuth();
  const [tab, setTab] = useState('general');
  const [tripId, setTripId] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [viajes, setViajes] = useState([]);
  const chatRef = useRef(null);

  // Cargar viajes donde el usuario es participante
  useEffect(() => {
    api.get('/trips').then(res => {
      const misViajes = res.data.filter(v => v.participantes.some(p => p.id === user.id));
      setViajes(misViajes);
      if (misViajes.length && !tripId) setTripId(misViajes[0].id);
    });
  }, [user.id]);

  // Conexión y eventos de socket
  useEffect(() => {
    socket.connect();
    socket.emit('joinGeneral');
    return () => { socket.disconnect(); };
  }, []);

  // Cargar historial y escuchar mensajes
  useEffect(() => {
    if (tab === 'general') {
      api.get('/messages/general').then(res => setMensajes(res.data));
      socket.on('newGeneralMessage', msg => setMensajes(m => [...m, msg]));
      return () => socket.off('newGeneralMessage');
    } else if (tab === 'viaje' && tripId) {
      socket.emit('joinTrip', tripId);
      api.get(`/messages/trip/${tripId}`).then(res => setMensajes(res.data));
      socket.on('newTripMessage', msg => setMensajes(m => [...m, msg]));
      return () => socket.off('newTripMessage');
    }
  }, [tab, tripId]);

  // Scroll automático al final
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes]);

  const enviarMensaje = e => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    if (tab === 'general') {
      socket.emit('generalMessage', { userId: user.id, contenido: mensaje });
    } else if (tab === 'viaje' && tripId) {
      socket.emit('tripMessage', { userId: user.id, tripId, contenido: mensaje });
    }
    setMensaje('');
  };

  return (
    <div className="chat-page">
      <h2>Chat</h2>
      <div className="chat-tabs">
        <button onClick={() => setTab('general')} className={tab==='general' ? 'active' : ''}>General</button>
        <button onClick={() => setTab('viaje')} className={tab==='viaje' ? 'active' : ''}>Por viaje</button>
        {tab === 'viaje' && (
          <select value={tripId} onChange={e => setTripId(e.target.value)}>
            {viajes.map(v => <option key={v.id} value={v.id}>{v.titulo}</option>)}
          </select>
        )}
      </div>
      <div ref={chatRef} className="chat-window">
        {mensajes.map(m => (
          <div
            key={m.id}
            className={`chat-bubble${m.userId === user.id ? ' me' : ''}`}
          >
            <div className="chat-meta">
              <span className="chat-user">{m.User?.nombre || 'Usuario'}</span>
              <span className="chat-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="chat-text">{m.contenido}</div>
          </div>
        ))}
      </div>
      <form onSubmit={enviarMensaje} className="chat-form">
        <input value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="Escribe tu mensaje..." />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
} 