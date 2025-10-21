// src/pages/Reportes.jsx
import React, { useState, useEffect } from 'react';
import '../assets/css/styleReporte.css';

const Reportes = () => {
  const [calculos, setCalculos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [estadisticas, setEstadisticas] = useState({});

  // Cargar cálculos al montar el componente
  useEffect(() => {
    cargarCalculos();
  }, []);

  const cargarCalculos = () => {
    // Cargar cálculos de las tres calculadoras
    const comerciales = JSON.parse(localStorage.getItem('calculosComerciales') || '[]');
    const especiales = JSON.parse(localStorage.getItem('calculosEspeciales') || '[]');
    const pasajeros = JSON.parse(localStorage.getItem('calculosPasajeros') || '[]');

    // Combinar todos los cálculos con su tipo
    const todosCalculos = [
      ...comerciales.map(c => ({ ...c, tipo: 'comercial' })),
      ...especiales.map(c => ({ ...c, tipo: 'especial' })),
      ...pasajeros.map(c => ({ ...c, tipo: 'pasajero' }))
    ];

    // Ordenar por fecha (más reciente primero)
    todosCalculos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    setCalculos(todosCalculos);
    calcularEstadisticas(todosCalculos);
  };

  const calcularEstadisticas = (calculosArray) => {
    if (calculosArray.length === 0) {
      setEstadisticas({});
      return;
    }

    const totales = calculosArray.reduce((acc, calc) => acc + calc.total, 0);
    const promedio = totales / calculosArray.length;
    const porTipo = calculosArray.reduce((acc, calc) => {
      acc[calc.tipo] = (acc[calc.tipo] || 0) + 1;
      return acc;
    }, {});

    setEstadisticas({
      totalCalculos: calculosArray.length,
      totalIngresos: totales,
      promedio: promedio,
      porTipo: porTipo
    });
  };

  // Filtrar cálculos según el tipo seleccionado
  const calculosFiltrados = filtroTipo === 'todos' 
    ? calculos 
    : calculos.filter(calc => calc.tipo === filtroTipo);

  const limpiarReportes = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los reportes? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('calculosComerciales');
      localStorage.removeItem('calculosEspeciales');
      localStorage.removeItem('calculosPasajeros');
      setCalculos([]);
      setEstadisticas({});
    }
  };

  const exportarCSV = () => {
    // Implementaremos esto después
    console.log('Exportando CSV...');
  };

  return (
    <div className="container mt-4">
      <div className="reporte-header">
        <h1>Reportes de Cálculos</h1>
        <p>Visualiza y gestiona todos los cálculos realizados</p>
      </div>

      {/* Estadísticas */}
      {calculos.length > 0 && (
        <div className="estadisticas">
          <h3>Estadísticas</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total de Cálculos</h4>
              <p className="stat-number">{estadisticas.totalCalculos}</p>
            </div>
            <div className="stat-card">
              <h4>Ingresos Totales</h4>
              <p className="stat-number">${estadisticas.totalIngresos?.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h4>Promedio por Cálculo</h4>
              <p className="stat-number">${estadisticas.promedio?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Controles */}
      <div className="controles-reporte">
        <div className="filtros">
          <label htmlFor="filtro-tipo">Filtrar por tipo:</label>
          <select 
            id="filtro-tipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos los tipos</option>
            <option value="comercial">Comerciales</option>
            <option value="especial">Especiales</option>
            <option value="pasajero">Pasajeros</option>
          </select>
        </div>

        <div className="acciones">
          <button className="btn btn-exportar" onClick={exportarCSV}>
            Exportar CSV
          </button>
          <button className="btn btn-limpiar" onClick={limpiarReportes}>
            Limpiar Reportes
          </button>
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div className="tabla-reportes">
        {calculosFiltrados.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Detalles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calculosFiltrados.map((calculo) => (
                <tr key={calculo.id}>
                  <td>{new Date(calculo.fecha).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${calculo.tipo}`}>
                      {calculo.tipo}
                    </span>
                  </td>
                  <td>${calculo.total.toFixed(2)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => console.log('Ver detalles:', calculo)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => console.log('Eliminar:', calculo.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <p>No hay cálculos para mostrar.</p>
            <p>Realiza algunos cálculos en las calculadoras para ver los reportes aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;