// src/pages/Especiales.jsx
import React, { useState } from 'react';
import '../assets/css/styleCalcula.css';

// IP Pública de tu EC2
const API_URL = 'http://54.88.10.118:8080/api/boletas';

const Especiales = () => {
  
  const [codBuque, setCodBuque] = useState('');
  const [idPuerto, setIdPuerto] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  
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
        
        // Endpoint correcto para cálculo con JSON
        const url = `${API_URL}/calcular`; 
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
           
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
            setStatus({ loading: false, error: 'Error: Verifica que el Buque Especial y demás IDs existan en la BD.' });
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
          {/* Título específico para diferenciar la página */}
          <h2>Buques Especiales</h2>
          <p>Cálculo oficial para buques de investigación, militares o pesqueros</p>
        </div>
        
        <div className="calculator-grid">
          {/* Inputs adaptados a IDs */}
          <div className="form-group">
            <label htmlFor="cod-buque">Código del Buque Especial</label>
            <input 
              type="text" 
              id="cod-buque"
              placeholder="Ej: ESP-001"
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
        
        {/* Mensajes de Feedback */}
        {status.error && <div className="error" style={{display: 'block', marginBottom: '1rem'}}>{status.error}</div>}
        {status.loading && <div className="info" style={{color: '#007bff', marginBottom: '1rem'}}>Procesando tarifa especial...</div>}

        <div className="button-group">
          <button 
            id="calcular-especial" 
            className="btn"
            onClick={calcularEnBackend}
            disabled={status.loading}
          >
            {status.loading ? 'Calculando...' : 'Calcular Costo'}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={resetearFormulario}
            style={{backgroundColor: '#6c757d', marginTop: '0.5rem'}}
          >
            Limpiar
          </button>
        </div>
        
        {/* Resultados */}
        {resultado.mostrar && (
          <div id="result-especial" className="result" style={{display: 'block'}}>
            <h3>Boleta Generada</h3>
            <div className="cost">$ <span id="total-especial">{resultado.total.toFixed(2)}</span></div>
            
            <div className="details">
              <p>Detalles de la transacción:</p>
              <ul>
                <li><strong>ID Boleta:</strong> <span>{resultado.idBoleta}</span></li>
                <li><strong>Fecha:</strong> <span>{resultado.fecha}</span></li>
                <li><strong>Buque:</strong> <span>{codBuque}</span></li>
                <li><strong>Estado:</strong> <span style={{color: 'green'}}>Guardado en BD</span></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Especiales;
