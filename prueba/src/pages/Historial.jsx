import React, { useState, useEffect } from 'react';
import '../assets/css/styleReporte.css'; // Asegúrate de que esta ruta exista

// Endpoint de tu Backend
const API_URL = 'http://54.88.10.118:8080/api/boletas';

const Historial = () => {
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setError('Debes iniciar sesión para ver el historial.');
        setLoading(false);
        return;
    }

    try {
      // Petición GET al backend
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // data es un array de objetos Boleta: [{idBoleta, monto, buque: {...}, ...}]
        setBoletas(data);
      } else {
        setError('Error al obtener el historial del servidor.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con la Base de Datos.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-4"><p>Cargando boletas...</p></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-4">
      <h2>Historial de Boletas (Base de Datos)</h2>
      
      {boletas.length === 0 ? (
        <div className="alert alert-info">No hay boletas registradas en el sistema.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID Transacción</th>
                <th>Fecha Emisión</th>
                <th>Buque</th>
                <th>Puerto</th>
                <th>Funcionario</th>
                <th>Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {boletas.map((boleta) => (
                <tr key={boleta.idBoleta}>
                  <td><small>{boleta.idBoleta}</small></td>
                  <td>{new Date(boleta.fechaEmision).toLocaleDateString()} {new Date(boleta.fechaEmision).toLocaleTimeString()}</td>
                  <td>{boleta.buque ? boleta.buque.nombre : 'N/A'} <br/><small className="text-muted">({boleta.buque?.codBuque})</small></td>
                  <td>{boleta.puerto ? boleta.puerto.nombre : 'N/A'}</td>
                  <td>{boleta.funcionario ? boleta.funcionario.nombre : 'N/A'}</td>
                  <td className="fw-bold text-success">${boleta.monto.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Historial;