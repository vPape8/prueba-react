import React, { useState } from 'react';
import '../assets/css/styleCalcula.css';

// IP Pública de tu EC2
const API_URL = 'http://54.88.10.118:8080/api/boleta';

const Comerciales = () => {
  // Estados para los IDs que pide el Backend
  const [codBuque, setCodBuque] = useState('');
  const [idPuerto, setIdPuerto] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  
  // Estado para mostrar resultados
  const [resultado, setResultado] = useState({
    mostrar: false,
    total: 0,
    idBoleta: '',
    fecha: ''
  });

  // Estado para mensajes de error/carga
  const [status, setStatus] = useState({ loading: false, error: '' });

  const calcularEnBackend = async () => {
    setStatus({ loading: false, error: '' });
    
    // 1. Validar Token
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Debes iniciar sesión primero");
        return;
    }

    // 2. Validar Campos
    if (!codBuque || !idPuerto || !idFuncionario) {
        setStatus({ loading: false, error: 'Por favor completa todos los campos (IDs)' });
        return;
    }

    try {
        setStatus({ loading: true, error: '' });
        
        // 3. Llamada al Backend (EC2)
        // Nota: Tu backend espera parámetros en la URL (?cod_buque=...)
        const url = `${API_URL}/PostBoleta/?cod_buque=${codBuque}&id_puerto=${idPuerto}&id_funcionario=${idFuncionario}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const boleta = await response.json();
            
            // 4. Mostrar resultado del Backend en la UI original
            setResultado({
                mostrar: true,
                total: boleta.monto,
                idBoleta: boleta.idBoleta,
                fecha: boleta.fechaEmision || new Date().toLocaleDateString()
            });
            setStatus({ loading: false, error: '' });
        } else {
            setStatus({ loading: false, error: 'Error: Verifica que los IDs existan en la base de datos.' });
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
          <h2>Buques Comerciales</h2>
          <p>Generar boleta y calcular estadía (Conectado a AWS)</p>
        </div>
        
        <div className="calculator-grid">
          {/* Campo: Código Buque */}
          <div className="form-group">
            <label htmlFor="cod-buque">Código del Buque</label>
            <input 
              type="text" 
              id="cod-buque"
              placeholder="Ej: BUQUE-001"
              value={codBuque}
              onChange={(e) => setCodBuque(e.target.value)}
            />
          </div>
          
          {/* Campo: ID Puerto */}
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
          
          {/* Campo: ID Funcionario */}
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
        {status.loading && <div className="info" style={{color: '#007bff', marginBottom: '1rem'}}>Calculando en el servidor...</div>}

        <div className="button-group">
          <button 
            id="calcular-comercial" 
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
            Nueva Consulta
          </button>
        </div>
        
        {/* Resultados con el estilo original */}
        {resultado.mostrar && (
          <div id="result-comercial" className="result" style={{display: 'block'}}>
            <h3>Boleta Generada</h3>
            <div className="cost">$ <span id="total-comercial">{resultado.total.toFixed(2)}</span></div>
            
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

export default Comerciales;