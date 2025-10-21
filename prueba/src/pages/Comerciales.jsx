// src/pages/Comerciales.jsx
import React, { useState } from 'react';
import '../assets/css/styleCalcula.css';

const Comerciales = () => {
  const [tonelaje, setTonelaje] = useState('');
  const [dias, setDias] = useState('1');
  const [tipoCarga, setTipoCarga] = useState('general');
  const [servicios, setServicios] = useState('basico');
  
  const [errors, setErrors] = useState({
    tonelaje: false,
    dias: false
  });
  
  const [resultado, setResultado] = useState({
    mostrar: false,
    total: 0,
    tarifaBase: 0,
    costoServicios: 0,
    impuestos: 0
  });

  const validarTonelaje = (valor) => {
    const num = parseFloat(valor);
    if (isNaN(num) || num < 0) {
      setErrors(prev => ({ ...prev, tonelaje: true }));
      return null;
    } else {
      setErrors(prev => ({ ...prev, tonelaje: false }));
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

  const calcularCosto = () => {
    const tonelajeValido = validarTonelaje(tonelaje);
    const diasValidos = validarDias(dias);
    
    if (tonelajeValido === null || diasValidos === null) {
      return;
    }

    let tarifaBase = tonelajeValido * 0.5;
    
    switch (tipoCarga) {
      case 'contenedores':
        tarifaBase *= 1.2;
        break;
      case 'granel':
        tarifaBase *= 0.9;
        break;
      case 'liquido':
        tarifaBase *= 1.1;
        break;
      default:
        break;
    }
    
    let costoServicios = 0;
    switch (servicios) {
      case 'medio':
        costoServicios = 500;
        break;
      case 'completo':
        costoServicios = 1200;
        break;
      default:
        break;
    }
    
    const impuestos = (tarifaBase + costoServicios) * 0.16;
    const total = (tarifaBase + costoServicios + impuestos) * diasValidos;

    setResultado({
      mostrar: true,
      total: total,
      tarifaBase: tarifaBase * diasValidos,
      costoServicios: costoServicios * diasValidos,
      impuestos: impuestos * diasValidos
    });

    // Guardar cálculo
    saveCalculation({
      type: 'comercial',
      total: total,
      details: {
        tonelaje: tonelajeValido,
        dias: diasValidos,
        tipo: tipoCarga,
        servicios: servicios,
        tarifaBase: tarifaBase * diasValidos,
        costoServicios: costoServicios * diasValidos,
        impuestos: impuestos * diasValidos
      }
    });
  };

  const saveCalculation = (data) => {
    console.log('Guardando cálculo:', data);
    // Aquí implementarás la lógica para guardar
  };

  const resetearFormulario = () => {
    setTonelaje('');
    setDias('1');
    setTipoCarga('general');
    setServicios('basico');
    setErrors({ tonelaje: false, dias: false });
    setResultado({
      mostrar: false,
      total: 0,
      tarifaBase: 0,
      costoServicios: 0,
      impuestos: 0
    });
  };

  return (
    <div className="container mt-4">
      <div className="calculator">
        <div className="calculator-header">
          <h2>Buques Comerciales</h2>
          <p>Calcule el costo de estadía para buques de carga</p>
        </div>
        
        <div className="calculator-grid">
          {/* Campo Tonelaje */}
          <div className="form-group">
            <label htmlFor="com-tonelaje">Tonelaje (TRB)</label>
            <input 
              type="number" 
              id="com-tonelaje"
              min="0" 
              placeholder="Ingrese el tonelaje"
              value={tonelaje}
              onChange={(e) => setTonelaje(e.target.value)}
            />
            {/* Mensaje de error condicional */}
            {errors.tonelaje && (
              <div className="error" style={{display: 'block'}}>
                Por favor ingrese un valor válido
              </div>
            )}
          </div>
          
          {/* Campo Días */}
          <div className="form-group">
            <label htmlFor="com-dias">Días de estadía</label>
            <input 
              type="number" 
              id="com-dias"
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
          
          {/* Select Tipo de Carga */}
          <div className="form-group">
            <label htmlFor="com-tipo">Tipo de carga</label>
            <select 
              id="com-tipo"
              value={tipoCarga}
              onChange={(e) => setTipoCarga(e.target.value)}
            >
              <option value="general">Carga General</option>
              <option value="contenedores">Contenedores</option>
              <option value="granel">Granel Sólido</option>
              <option value="liquido">Granel Líquido</option>
            </select>
          </div>
          
          {/* Select Servicios Adicionales */}
          <div className="form-group">
            <label htmlFor="com-servicios">Servicios adicionales</label>
            <select 
              id="com-servicios"
              value={servicios}
              onChange={(e) => setServicios(e.target.value)}
            >
              <option value="basico">Solo estadía</option>
              <option value="medio">Estadía + Remolque</option>
              <option value="completo">Estadía + Remolque + Suministros</option>
            </select>
          </div>
        </div>
        
        <div className="button-group">
          <button 
            id="calcular-comercial" 
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
        
        {/* Resultados - condicional */}
        {resultado.mostrar && (
          <div id="result-comercial" className="result" style={{display: 'block'}}>
            <h3>Costo total de estadía</h3>
            <div className="cost">$ <span id="total-comercial">{resultado.total.toFixed(2)}</span></div>
            <div className="details">
              <p>Desglose de costos:</p>
              <ul>
                <li>Tarifa base: $<span id="base-comercial">{resultado.tarifaBase.toFixed(2)}</span></li>
                <li>Servicios: $<span id="servicios-comercial">{resultado.costoServicios.toFixed(2)}</span></li>
                <li>Impuestos: $<span id="impuestos-comercial">{resultado.impuestos.toFixed(2)}</span></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comerciales;