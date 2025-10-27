// src/components/ModalDetalles.jsx
import React from 'react';

const ModalDetalles = ({ calculo, onClose }) => {
  if (!calculo) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>📊 Detalles del Cálculo</h2>
        <button onClick={onClose}>Cerrar</button>

        <div>
          <strong>Tipo:</strong> <span>{calculo.tipoCarga || 'Buque Comercial'}</span>
        </div>
        <div>
          <strong>Total:</strong> <span>${calculo.total.toFixed(2)}</span>
        </div>

        {calculo.details ? (
          <div>
            <p>Tarifa base: ${calculo.details.tarifaBase.toFixed(2)}</p>
            <p>Servicios: ${calculo.details.costoServicios.toFixed(2)}</p>
            <p>Impuestos: ${calculo.details.impuestos.toFixed(2)}</p>
          </div>
        ) : (
          <p>No hay detalles disponibles para este cálculo.</p>
        )}
      </div>
    </div>
  );
};

export default ModalDetalles;
