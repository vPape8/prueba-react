// src/pages/Pasajeros.jsx
import React, { useState } from 'react';
import '../assets/css/styleCalcula.css';

const Pasajeros = () => {
  // Estados para los campos del formulario
  const [eslora, setEslora] = useState('');
  const [pasajeros, setPasajeros] = useState('');
  const [dias, setDias] = useState('1');
  const [tipoBuque, setTipoBuque] = useState('crucero');
  
  // Estados para errores
  const [errors, setErrors] = useState({
    eslora: false,
    pasajeros: false,
    dias: false
  });
  
  // Estados para resultados
  const [resultado, setResultado] = useState({
    mostrar: false,
    total: 0,
    tarifaBase: 0,
    tarifaPasajero: 0,
    impuestos: 0
  });

  // Funciones de validación
  const validarNumero = (valor, campo) => {
    const num = parseFloat(valor);
    if (isNaN(num) || num < 0) {
      setErrors(prev => ({ ...prev, [campo]: true }));
      return null;
    } else {
      setErrors(prev => ({ ...prev, [campo]: false }));
      return num;
    }
  };

  const validarDias = (valor) => {
    const num = parseInt(valor);
    if (isNaN(num) || num < 1) {
      setErrors(prev => ({ ...prev, dias: true }));
      return null;
    } else {
      setErrors(prev => ({ ...prev, dias: false }));
      return num;
    }
  };

  // Función para calcular costos
  const calcularCosto = () => {
    // Validar entrada
    const esloraValida = validarNumero(eslora, 'eslora');
    const pasajerosValidos = validarNumero(pasajeros, 'pasajeros');
    const diasValidos = validarDias(dias);
    
    if (esloraValida === null || pasajerosValidos === null || diasValidos === null) {
      return; // Detener si hay errores de validación
    }

    // Cálculos de ejemplo
    let tarifaBase = esloraValida * 80;
    
    // Ajustar según tipo de buque
    switch (tipoBuque) {
      case 'crucero':
        tarifaBase *= 1.5;
        break;
      case 'yate':
        tarifaBase *= 2;
        break;
      case 'transbordador':
        // No hay ajuste para transbordador
        break;
      default:
        break;
    }
    
    const tarifaPasajero = pasajerosValidos * 10;
    const impuestos = (tarifaBase + tarifaPasajero) * 0.16;
    const total = (tarifaBase + tarifaPasajero + impuestos) * diasValidos;

    // Mostrar resultados
    setResultado({
      mostrar: true,
      total: total,
      tarifaBase: tarifaBase * diasValidos,
      tarifaPasajero: tarifaPasajero * diasValidos,
      impuestos: impuestos * diasValidos
    });

    // Guardar cálculo
    saveCalculation({
      type: 'pasaje',
      total: total,
      details: {
        eslora: esloraValida,
        pasajeros: pasajerosValidos,
        dias: diasValidos,
        tipo: tipoBuque,
        tarifaBase: tarifaBase * diasValidos,
        tarifaPasajero: tarifaPasajero * diasValidos,
        impuestos: impuestos * diasValidos
      }
    });
  };

  // Función para guardar cálculos
  const saveCalculation = (data) => {
    console.log('Guardando cálculo de pasaje:', data);
    // Guardar en localStorage
    const calculosPrevios = JSON.parse(localStorage.getItem('calculosPasajeros') || '[]');
    calculosPrevios.push({
      ...data,
      fecha: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('calculosPasajeros', JSON.stringify(calculosPrevios));
  };

  // Función para resetear el formulario
  const resetearFormulario = () => {
    setEslora('');
    setPasajeros('');
    setDias('1');
    setTipoBuque('crucero');
    setErrors({ eslora: false, pasajeros: false, dias: false });
    setResultado({
      mostrar: false,
      total: 0,
      tarifaBase: 0,
      tarifaPasajero: 0,
      impuestos: 0
    });
  };

  return (
    <div className="container mt-4">
      <div className="calculator">
        <div className="calculator-header">
          <h2>Buques de Pasaje</h2>
          <p>Calcule el costo de estadía para cruceros y transbordadores</p>
        </div>
        
        <div className="calculator-grid">
          {/* Campo Eslora */}
          <div className="form-group">
            <label htmlFor="pas-eslora">Eslora (metros)</label>
            <input 
              type="number" 
              id="pas-eslora"
              min="0" 
              placeholder="Longitud del buque"
              value={eslora}
              onChange={(e) => setEslora(e.target.value)}
            />
            {errors.eslora && (
              <div className="error" style={{display: 'block'}}>
                Por favor ingrese un valor válido
              </div>
            )}
          </div>
          
          {/* Campo Número de Pasajeros */}
          <div className="form-group">
            <label htmlFor="pas-pasajeros">Número de pasajeros</label>
            <input 
              type="number" 
              id="pas-pasajeros"
              min="0" 
              placeholder="Cantidad de pasajeros"
              value={pasajeros}
              onChange={(e) => setPasajeros(e.target.value)}
            />
            {errors.pasajeros && (
              <div className="error" style={{display: 'block'}}>
                Por favor ingrese un valor válido
              </div>
            )}
          </div>
          
          {/* Campo Días */}
          <div className="form-group">
            <label htmlFor="pas-dias">Días de estadía</label>
            <input 
              type="number" 
              id="pas-dias"
              min="1" 
              placeholder="Número de días" 
              value={dias}
              onChange={(e) => setDias(e.target.value)}
            />
            {errors.dias && (
              <div className="error" style={{display: 'block'}}>
                Por favor ingrese al menos 1 día
              </div>
            )}
          </div>
          
          {/* Select Tipo de Buque */}
          <div className="form-group">
            <label htmlFor="pas-tipo">Tipo de buque</label>
            <select 
              id="pas-tipo"
              value={tipoBuque}
              onChange={(e) => setTipoBuque(e.target.value)}
            >
              <option value="crucero">Crucero</option>
              <option value="transbordador">Transbordador</option>
              <option value="yate">Yate de pasaje</option>
            </select>
          </div>
        </div>
        
        <div className="button-group">
          <button 
            id="calcular-pasaje" 
            className="btn"
            onClick={calcularCosto}
          >
            Calcular Costo
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={resetearFormulario}
            style={{backgroundColor: '#6c757d', marginTop: '0.5rem'}}
          >
            Resetear
          </button>
        </div>
        
        {/* Resultados */}
        {resultado.mostrar && (
          <div id="result-pasaje" className="result" style={{display: 'block'}}>
            <h3>Costo total de estadía</h3>
            <div className="cost">$ <span id="total-pasaje">{resultado.total.toFixed(2)}</span></div>
            <div className="details">
              <p>Desglose de costos:</p>
              <ul>
                <li>Tarifa base: $<span id="base-pasaje">{resultado.tarifaBase.toFixed(2)}</span></li>
                <li>Tarifa por pasajero: $<span id="pasajero-pasaje">{resultado.tarifaPasajero.toFixed(2)}</span></li>
                <li>Impuestos: $<span id="impuestos-pasaje">{resultado.impuestos.toFixed(2)}</span></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pasajeros;