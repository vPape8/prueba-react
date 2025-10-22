// src/components/ModalDetalles.jsx
import React from 'react';
import '../assets/css/styleModal.css';

const ModalDetalles = ({ calculo, onClose }) => {
  if (!calculo) return null;

  const renderizarDetallesEspecificos = () => {
    if (!calculo.details) return <p>No hay detalles disponibles para este cálculo.</p>;

    switch (calculo.tipo) {
      case 'comercial':
        return (
          <div className="detalles-especificos">
            <h4>📦 Información de Buque Comercial</h4>
            <div className="detalles-grid">
              <div className="detalle-item">
                <strong>Tonelaje:</strong>
                <span>{calculo.details.tonelaje} TRB</span>
              </div>
              <div className="detalle-item">
                <strong>Días de estadía:</strong>
                <span>{calculo.details.dias}</span>
              </div>
              <div className="detalle-item">
                <strong>Tipo de carga:</strong>
                <span>{calculo.details.tipo}</span>
              </div>
              <div className="detalle-item">
                <strong>Servicios:</strong>
                <span>{calculo.details.servicios}</span>
              </div>
            </div>
            
            <h4>💰 Desglose de Costos</h4>
            <div className="costos-grid">
              <div className="costo-item">
                <strong>Tarifa base:</strong>
                <span>${calculo.details.tarifaBase?.toFixed(2)}</span>
              </div>
              <div className="costo-item">
                <strong>Costos de servicios:</strong>
                <span>${calculo.details.costoServicios?.toFixed(2)}</span>
              </div>
              <div className="costo-item">
                <strong>Impuestos:</strong>
                <span>${calculo.details.impuestos?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      
      case 'especial':
        return (
          <div className="detalles-especificos">
            <h4>🔬 Información de Buque Especial</h4>
            <div className="detalles-grid">
              <div className="detalle-item">
                <strong>Tonelaje:</strong>
                <span>{calculo.details.tonelaje} TRB</span>
              </div>
              <div className="detalle-item">
                <strong>Días de estadía:</strong>
                <span>{calculo.details.dias}</span>
              </div>
              <div className="detalle-item">
                <strong>Tipo de buque:</strong>
                <span>{calculo.details.tipo}</span>
              </div>
              <div className="detalle-item">
                <strong>Servicios especiales:</strong>
                <span>{calculo.details.servicios}</span>
              </div>
            </div>
            
            <h4>💰 Desglose de Costos</h4>
            <div className="costos-grid">
              <div className="costo-item">
                <strong>Tarifa base:</strong>
                <span>${calculo.details.tarifaBase?.toFixed(2)}</span>
              </div>
              <div className="costo-item">
                <strong>Servicios especiales:</strong>
                <span>${calculo.details.especialServicios?.toFixed(2)}</span>
              </div>
              <div className="costo-item">
                <strong>Impuestos:</strong>
                <span>${calculo.details.impuestos?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      
      case 'pasajero':
        return (
          <div className="detalles-especificos">
            <h4>👥 Información de Buque de Pasaje</h4>
            <div className="detalles-grid">
              <div className="detalle-item">
                <strong>Eslora:</strong>
                <span>{calculo.details.eslora} metros</span>
              </div>
              <div className="detalle-item">
                <strong>Número de pasajeros:</strong>
                <span>{calculo.details.pasajeros}</span>
              </div>
              <div className="detalle-item">
                <strong>Días de estadía:</strong>
                <span>{calculo.details.dias}</span>
              </div>
              <div className="detalle-item">
                <strong>Tipo de buque:</strong>
                <span>{calculo.details.tipo}</span>
              </div>
            </div>
            
            <h4>💰 Desglose de Costos</h4>
            <div className="costos-grid">
              <div className="costo-item">
                <strong>Tarifa base:</strong>
                <span>${calculo.details.tarifaBase?.toFixed(2)}</span>
              </div>
              <div className="costo-item">
                <strong>Tarifa por pasajero:</strong>
                <span>${calculo.details.tarifaPasajero?.toFixed(2)}</span>
              </div>
              <div className="costo-item">
                <strong>Impuestos:</strong>
                <span>${calculo.details.impuestos?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="detalles-especificos">
            <p>Detalles no disponibles para este tipo de cálculo.</p>
            <pre style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px'}}>
              {JSON.stringify(calculo.details, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          border: '1px solid #ddd'
        }}
      >
        {/* Header del Modal */}
        <div className="modal-header">
          <h2>📊 Detalles del Cálculo</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Información General */}
        <div className="modal-general-info">
          <div className="info-grid">
            <div className="info-item">
              <strong>🔹 Tipo</strong>
              <span>{calculo.tipoDisplay}</span>
            </div>
            <div className="info-item">
              <strong>📅 Fecha</strong>
              <span>{new Date(calculo.fecha).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <strong>💰 Total</strong>
              <span>${calculo.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Detalles Específicos */}
        {renderizarDetallesEspecificos()}

        {/* Footer del Modal */}
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalles;