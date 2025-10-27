// src/pages/Comerciales.jsx
import React, { useState } from 'react';
import { calcularCostoComercial } from '../utils/calculos.js';

const Comerciales = () => {
  const [tonelaje, setTonelaje] = useState(0);
  const [dias, setDias] = useState(1);
  const [tipoCarga, setTipoCarga] = useState('general');
  const [servicios, setServicios] = useState('basico');

  const [resultado, setResultado] = useState({
    mostrar: false,
    total: 0,
    details: {
      tarifaBase: 0,
      costoServicios: 0,
      impuestos: 0
    }
  });

  const handleCalcular = () => {
    const res = calcularCostoComercial({ tonelaje, dias, tipoCarga, servicios });
    setResultado({ mostrar: true, ...res });
  };

  return (
    <div>
      <h2>Buques Comerciales</h2>
      <input
        type="number"
        placeholder="Tonelaje"
        value={tonelaje}
        onChange={(e) => setTonelaje(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Días"
        value={dias}
        onChange={(e) => setDias(Number(e.target.value))}
      />
      <select value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)}>
        <option value="general">Carga General</option>
        <option value="contenedores">Contenedores</option>
        <option value="granel">Granel Sólido</option>
        <option value="liquido">Granel Líquido</option>
      </select>
      <select value={servicios} onChange={(e) => setServicios(e.target.value)}>
        <option value="basico">Solo estadía</option>
        <option value="medio">Estadía + Remolque</option>
        <option value="completo">Estadía + Remolque + Suministros</option>
      </select>

      <button onClick={handleCalcular}>Calcular Costo</button>

      {resultado.mostrar && (
        <div>
          <h3>Total: ${resultado.total.toFixed(2)}</h3>
          <p>Tarifa base: ${resultado.details.tarifaBase.toFixed(2)}</p>
          <p>Servicios: ${resultado.details.costoServicios.toFixed(2)}</p>
          <p>Impuestos: ${resultado.details.impuestos.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Comerciales;
