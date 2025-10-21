// src/pages/Especiales.jsx
import React, { useState } from 'react';
import '../assets/css/styleCalcula.css';

const Especiales = () => {
    const [tonelaje, setTonelaje] = useState('');
    const [dias, setDias] = useState('1');
    const [tipoBuque, setTipoBuque] = useState('general');
    const [serviciosEspeciales, setServiciosEspeciales] = useState('basico');

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

    if (tonelajeValido === null || diasValidos === null){
        return;
    }

    let tarifaBase = tonelajeValido * 0.4;

    switch(tipoBuque) {
        case 'investigacion':
            tarifaBase *= 0.7;
            break;
        case 'militar':
            tarifaBase *= 1.2;
            break;
        case 'pesca':
            tarifaBase *= 0.9;
            break;
        case 'proteccion':
            tarifaBase *= 0.8;
            break;
        default:
            break;
    }

    let costoServicios = 0;
    switch(serviciosEspeciales) {
        case 'seguridad':
            costoServicios = 800;
            break;
        case 'tecnico':
            costoServicios = 1500;
            break;
        case 'completo':
            costoServicios = 3000;
            break;
        default:
            break;
    }

    const impuestos = (tarifaBase + costoServicios) * 0.16;
    const total = (tarifaBase + costoServicios + impuestos) * diasValidos;

    // Mostrar resultados
    setResultado({
      mostrar: true,
      total: total,
      tarifaBase: tarifaBase * diasValidos,
      especialServicios: costoServicios * diasValidos,
      impuestos: impuestos * diasValidos
    });

    // Guardar cálculo
    saveCalculation({
      type: 'especial',
      total: total,
      details: {
        tonelaje: tonelajeValido,
        dias: diasValidos,
        tipo: tipoBuque,
        servicios: serviciosEspeciales,
        tarifaBase: tarifaBase * diasValidos,
        especialServicios: costoServicios * diasValidos,
        impuestos: impuestos * diasValidos
      }
    });
  };

  // Función para guardar cálculos
  const saveCalculation = (data) => {
    console.log('Guardando cálculo especial:', data);
    // Aquí implementarás la lógica para guardar en localStorage o base de datos
    // Por ahora solo guardamos en localStorage como ejemplo
    const calculosPrevios = JSON.parse(localStorage.getItem('calculosEspeciales') || '[]');
    calculosPrevios.push({
      ...data,
      fecha: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('calculosEspeciales', JSON.stringify(calculosPrevios));
  };

  // Función para resetear el formulario
  const resetearFormulario = () => {
    setTonelaje('');
    setDias('1');
    setTipoBuque('investigacion');
    setServiciosEspeciales('ninguno');
    setErrors({ tonelaje: false, dias: false });
    setResultado({
      mostrar: false,
      total: 0,
      tarifaBase: 0,
      especialServicios: 0,
      impuestos: 0
    });
  };

  return (
    <div className="container mt-4">
      <div className="calculator">
        <div className="calculator-header">
          <h2>Buques Especiales</h2>
          <p>Calcule el costo de estadía para buques especializados</p>
        </div>
        
        <div className="calculator-grid">
          {/* Campo Tonelaje */}
          <div className="form-group">
            <label htmlFor="esp-tonelaje">Tonelaje (TRB)</label>
            <input 
              type="number" 
              id="esp-tonelaje"
              min="0" 
              placeholder="Ingrese el tonelaje"
              value={tonelaje}
              onChange={(e) => setTonelaje(e.target.value)}
            />
            {errors.tonelaje && (
              <div className="error" style={{display: 'block'}}>
                Por favor ingrese un valor válido
              </div>
            )}
          </div>
          
          {/* Campo Días */}
          <div className="form-group">
            <label htmlFor="esp-dias">Días de estadía</label>
            <input 
              type="number" 
              id="esp-dias"
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
            <label htmlFor="esp-tipo">Tipo de buque</label>
            <select 
              id="esp-tipo"
              value={tipoBuque}
              onChange={(e) => setTipoBuque(e.target.value)}
            >
              <option value="investigacion">Investigación</option>
              <option value="pesca">Pesquero</option>
              <option value="proteccion">Protección ambiental</option>
              <option value="militar">Militar</option>
            </select>
          </div>
          
          {/* Select Servicios Especiales */}
          <div className="form-group">
            <label htmlFor="esp-especial">Servicios especiales requeridos</label>
            <select 
              id="esp-especial"
              value={serviciosEspeciales}
              onChange={(e) => setServiciosEspeciales(e.target.value)}
            >
              <option value="ninguno">Ninguno</option>
              <option value="seguridad">Seguridad adicional</option>
              <option value="tecnicos">Servicios técnicos</option>
              <option value="completos">Servicios completos</option>
            </select>
          </div>
        </div>
        
        <div className="button-group">
          <button 
            id="calcular-especiales" 
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
          <div id="result-especiales" className="result" style={{display: 'block'}}>
            <h3>Costo total de estadía</h3>
            <div className="cost">$ <span id="total-especiales">{resultado.total.toFixed(2)}</span></div>
            <div className="details">
              <p>Desglose de costos:</p>
              <ul>
                <li>Tarifa base: $<span id="base-especiales">{resultado.tarifaBase.toFixed(2)}</span></li>
                <li>Servicios especiales: $<span id="especial-servicios">{resultado.especialServicios.toFixed(2)}</span></li>
                <li>Impuestos: $<span id="impuestos-especiales">{resultado.impuestos.toFixed(2)}</span></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Especiales;
