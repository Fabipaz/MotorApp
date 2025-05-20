import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [externas, setExternas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Noticias manuales desde el backend
  useEffect(() => {
    api.get('/news').then(res => setNoticias(res.data)).finally(() => setLoading(false));
  }, []);

  // Noticias externas (ejemplo: NewsAPI, puedes cambiar la fuente)
  useEffect(() => {
    fetch('https://newsapi.org/v2/everything?q=motorcycle&language=es&sortBy=publishedAt&apiKey=TU_API_KEY')
      .then(r => r.json())
      .then(data => setExternas(data.articles || []));
  }, []);

  return (
    <div>
      <h2>Noticias de la comunidad</h2>
      {loading ? <p>Cargando...</p> : (
        <ul>
          {noticias.map(n => (
            <li key={n.id} style={{ marginBottom: 20 }}>
              {n.imagen && <img src={n.imagen} alt="" style={{ width: 120, float: 'left', marginRight: 10 }} />}
              <b>{n.titulo}</b> <span style={{ color: '#888' }}>{new Date(n.fecha).toLocaleDateString()}</span><br/>
              <span>{n.contenido}</span><br/>
              {n.enlace && <a href={n.enlace} target="_blank" rel="noopener noreferrer">Leer más</a>}
              <div style={{ clear: 'both' }}></div>
            </li>
          ))}
        </ul>
      )}
      <h2>Noticias externas sobre motos</h2>
      <ul>
        {externas.map((n, i) => (
          <li key={i} style={{ marginBottom: 20 }}>
            {n.urlToImage && <img src={n.urlToImage} alt="" style={{ width: 120, float: 'left', marginRight: 10 }} />}
            <b>{n.title}</b> <span style={{ color: '#888' }}>{n.publishedAt && new Date(n.publishedAt).toLocaleDateString()}</span><br/>
            <span>{n.description}</span><br/>
            <a href={n.url} target="_blank" rel="noopener noreferrer">Leer más</a>
            <div style={{ clear: 'both' }}></div>
          </li>
        ))}
      </ul>
    </div>
  );
} 