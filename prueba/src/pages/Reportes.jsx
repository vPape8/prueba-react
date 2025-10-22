// src/pages/Reportes.jsx
import React, { useState, useEffect } from 'react';
import ModalDetalles from '../components/ModalDetalles';
import { exportToExcel, exportAllData } from '../utils/exportToExcel';
import '../assets/css/styleReporte.css';

const Reportes = () => {
  const [calculos, setCalculos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [estadisticas, setEstadisticas] = useState({});
  const [calculoSeleccionado, setCalculoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  // Cargar cálculos al montar el componente
  useEffect(() => {
    cargarCalculos();
  }, []);

  const cargarCalculos = () => {
    const comerciales = JSON.parse(localStorage.getItem('calculosComerciales') || '[]');
    const especiales = JSON.parse(localStorage.getItem('calculosEspeciales') || '[]');
    const pasajeros = JSON.parse(localStorage.getItem('calculosPasajeros') || '[]');

    const todosCalculos = [
      ...comerciales.map(c => ({ ...c, tipo: 'comercial', tipoDisplay: 'Comercial' })),
      ...especiales.map(c => ({ ...c, tipo: 'especial', tipoDisplay: 'Especial' })),
      ...pasajeros.map(c => ({ ...c, tipo: 'pasajero', tipoDisplay: 'Pasajero' }))
    ];

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

    const ingresosPorTipo = calculosArray.reduce((acc, calc) => {
      acc[calc.tipo] = (acc[calc.tipo] || 0) + calc.total;
      return acc;
    }, {});

    setEstadisticas({
      totalCalculos: calculosArray.length,
      totalIngresos: totales,
      promedio: promedio,
      porTipo: porTipo,
      ingresosPorTipo: ingresosPorTipo
    });
  };

  // Filtrar cálculos según el tipo seleccionado
  const calculosFiltrados = filtroTipo === 'todos' 
    ? calculos 
    : calculos.filter(calc => calc.tipo === filtroTipo);

  const verDetalles = (calculo) => {
    setCalculoSeleccionado(calculo);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCalculoSeleccionado(null);
  };

  const eliminarCalculo = (id, tipo) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cálculo?')) {
      const key = `calculos${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
      const calculosActuales = JSON.parse(localStorage.getItem(key) || '[]');
      const nuevosCalculos = calculosActuales.filter(calc => calc.id !== id);
      localStorage.setItem(key, JSON.stringify(nuevosCalculos));
      cargarCalculos();
    }
  };

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
    if (calculosFiltrados.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = ['Fecha', 'Tipo', 'Total', 'Detalles'];
    const csvData = calculosFiltrados.map(calculo => [
      new Date(calculo.fecha).toLocaleDateString(),
      calculo.tipoDisplay,
      `$${calculo.total.toFixed(2)}`,
      JSON.stringify(calculo.details)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reportes-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportarExcel = async () => {
    if (calculosFiltrados.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    try {
      await exportToExcel(calculosFiltrados, 'reportes_filtrados');
    } catch (error) {
      console.error('Error en exportación Excel:', error);
      alert('Error al exportar a Excel');
    }
  };

  const exportarTodoExcel = async () => {
    try {
      await exportAllData();
    } catch (error) {
      console.error('Error en exportación completa:', error);
      alert('Error al exportar todos los datos');
    }
  };

  const toggleDropdown = () => {
    setMostrarDropdown(!mostrarDropdown);
  };

  const closeDropdown = () => {
    setMostrarDropdown(false);
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
            {estadisticas.porTipo && (
              <>
                <div className="stat-card">
                  <h4>Comerciales</h4>
                  <p className="stat-number">{estadisticas.porTipo.comercial || 0}</p>
                  <small>${estadisticas.ingresosPorTipo?.comercial?.toFixed(2) || '0.00'}</small>
                </div>
                <div className="stat-card">
                  <h4>Especiales</h4>
                  <p className="stat-number">{estadisticas.porTipo.especial || 0}</p>
                  <small>${estadisticas.ingresosPorTipo?.especial?.toFixed(2) || '0.00'}</small>
                </div>
                <div className="stat-card">
                  <h4>Pasajeros</h4>
                  <p className="stat-number">{estadisticas.porTipo.pasajero || 0}</p>
                  <small>${estadisticas.ingresosPorTipo?.pasajero?.toFixed(2) || '0.00'}</small>
                </div>
              </>
            )}
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
          <div className="dropdown">
            <button 
              className="btn btn-exportar dropdown-toggle" 
              type="button" 
              onClick={toggleDropdown}
            >
              Exportar
            </button>
            {mostrarDropdown && (
              <ul className="dropdown-menu show">
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      exportarExcel();
                      closeDropdown();
                    }}
                  >
                    📊 Excel (Filtrado)
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      exportarTodoExcel();
                      closeDropdown();
                    }}
                  >
                    📈 Excel (Todos los datos)
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      exportarCSV();
                      closeDropdown();
                    }}
                  >
                    📄 CSV
                  </button>
                </li>
              </ul>
            )}
          </div>
          <button className="btn btn-limpiar" onClick={limpiarReportes}>
            🗑️ Limpiar Reportes
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
                      {calculo.tipoDisplay}
                    </span>
                  </td>
                  <td>
                    <strong>${calculo.total.toFixed(2)}</strong>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => verDetalles(calculo)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarCalculo(calculo.id, calculo.tipo)}
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
            <h3>📊 No hay cálculos para mostrar</h3>
            <p>Realiza algunos cálculos en las calculadoras para ver los reportes aquí.</p>
            <div style={{ marginTop: '20px' }}>
              <a href="/calculadora" className="btn btn-exportar">
                Ir a Calculadoras
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {mostrarModal && (
        <ModalDetalles 
          calculo={calculoSeleccionado}
          onClose={cerrarModal}
        />
      )}

      {/* Overlay para cerrar dropdown */}
      {mostrarDropdown && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={closeDropdown}
        />
      )}
    </div>
  );
};

export default Reportes;