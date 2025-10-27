import React from 'react';
import '@testing-library/jest-dom';             // <- IMPORTANTE: agrega jest-dom
import { render, screen, fireEvent } from '@testing-library/react';
import Comerciales from '../pages/Comerciales.jsx';

test('flujo E2E básico: calcula un costo comercial', () => {
  render(<Comerciales />);

  // Buscar por placeholder (tu componente utiliza placeholder en los inputs)
  const inputTonelaje = screen.getByPlaceholderText(/Tonelaje/i);
  const inputDias = screen.getByPlaceholderText(/Días/i);
  const botonCalcular = screen.getByText(/Calcular Costo/i);

  fireEvent.change(inputTonelaje, { target: { value: '100' } });
  fireEvent.change(inputDias, { target: { value: '2' } });

  fireEvent.click(botonCalcular);

  // Verificar resultado: puede ser 116 o 116.00 según cómo renderices,
  // por eso el match usa \d+(?:\.\d+)? para aceptar 116 o 116.00
  expect(screen.getByText(/\$\s*116(?:\.00)?/)).toBeInTheDocument();
});