import React, { useState } from 'react';
import '../assets/css/styleCalcula.css'; // Mantiene tus estilos originales

// IP Pública de tu EC2
const API_URL = 'http://54.88.10.118:8080/api/boletas';

const Pasajeros = () => {
  // Usamos los IDs requeridos por el Backend
  const [codBuque, setCodBuque] = useState('');
  const [idPuerto, setIdPuerto] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  
  // Estado para resultados (adaptado a lo que devuelve el backend)
  const [resultado, setResultado] = useState({
    mostrar: false,
    total: 0,
    idBoleta: '',
    fecha: ''
  });

  const [status, setStatus] = useState({ loading: false, error: '' });

  const calcularEnBackend = async () => {
    setStatus({ loading: false, error: '' });
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Debes iniciar sesión primero");
        return;
    }

    if (!codBuque || !idPuerto || !idFuncionario) {
        setStatus({ loading: false, error: 'Por favor completa todos los campos (IDs)' });
        return;
    }

    try {
        setStatus({ loading: true, error: '' });
        
        // Endpoint que usa el @RequestBody JSON
        const url = `${API_URL}/calcular`; 
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            // Enviamos el objeto JSON exacto que espera Java
            body: JSON.stringify({
                codBuque: codBuque,
                idPuerto: parseInt(idPuerto),
                idFuncionario: parseInt(idFuncionario)
            })
        });

        if (response.ok) {
            const boleta = await response.json();
            
            setResultado({
                mostrar: true,
                total: boleta.monto,
                idBoleta: boleta.idBoleta,
                fecha: boleta.fechaEmision || new Date().toLocaleDateString()
            });
            setStatus({ loading: false, error: '' });
        } else {
            setStatus({ loading: false, error: 'Error: Verifica que el Buque de Pasajeros exista en la BD.' });
        }
    } catch (error) {
        console.error(error);
        setStatus({ loading: false, error: 'No se pudo conectar con el servidor.' });
    }
  };

  const resetearFormulario = () => {
    setCodBuque('');
    setIdPuerto('');
    setIdFuncionario('');
    setResultado({ mostrar: false, total: 0, idBoleta: '', fecha: '' });
    setStatus({ loading: false, error: '' });
  };

  return (
    <div className="container mt-4">
      <div className="calculator">
        <div className="calculator-header">
          {/* Título específico de esta página */}
          <h2>Buques de Pasajeros</h2>
          <p>Calcule el costo de estadía para cruceros y transbordadores</p>
        </div>
        
        <div className="calculator-grid">
          {/* Inputs adaptados a IDs para el Backend */}
          <div className="form-group">
            <label htmlFor="cod-buque">Código del Buque (Pasajeros)</label>
            <input 
              type="text" 
              id="cod-buque"
              placeholder="Ej: CRUCERO-001"
              value={codBuque}
              onChange={(e) => setCodBuque(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="id-puerto">ID Puerto</label>
            <input 
              type="number" 
              id="id-puerto"
              placeholder="Ej: 1" 
              value={idPuerto}
              onChange={(e) => setIdPuerto(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="id-funcionario">ID Funcionario</label>
            <input 
              type="number" 
              id="id-funcionario"
              placeholder="Ej: 1" 
              value={idFuncionario}
              onChange={(e) => setIdFuncionario(e.target.value)}
            />
          </div>
        </div>
        
        {/* Mensajes de Estado */}
        {status.error && <div className="error" style={{display: 'block', marginBottom: '1rem'}}>{status.error}</div>}
        {status.loading && <div className="info" style={{color: '#007bff', marginBottom: '1rem'}}>Conectando con la terminal de pasajeros...</div>}

        <div className="button-group">
          <button 
            id="calcular-pasaje" 
            className="btn"
            onClick={calcularEnBackend}
            disabled={status.loading}
          >
            {status.loading ? 'Procesando...' : 'Calcular Costo'}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={resetearFormulario}
            style={{backgroundColor: '#6c757d', marginTop: '0.5rem'}}
          >
            Resetear
          </button>
        </div>
        
        {/* Resultados - Mismo diseño, datos reales */}
        {resultado.mostrar && (
          <div id="result-pasaje" className="result" style={{display: 'block'}}>
            <h3>Costo total de estadía</h3>
            <div className="cost">$ <span id="total-pasaje">{resultado.total.toFixed(2)}</span></div>
            <div className="details">
              <p>Detalles de la boleta:</p>
              <ul>
                <li><strong>ID Transacción:</strong> <span>{resultado.idBoleta}</span></li>
                <li><strong>Fecha Emisión:</strong> <span>{resultado.fecha}</span></li>
                <li><strong>Buque:</strong> <span>{codBuque}</span></li>
                <li><strong>Estado:</strong> <span style={{color: 'green'}}>Registrado en Sistema</span></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pasajeros;