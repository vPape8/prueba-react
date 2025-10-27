import React from 'react';
import { render, screen } from '@testing-library/react';
import ModalDetalles from '../components/ModalDetalles.jsx';
import '@testing-library/jest-dom';

test('renderiza ModalDetalles sin errores', () => {
  const calculoMock = { total: 1000, tipo: 'comercial' };
  render(<ModalDetalles calculo={calculoMock} onClose={() => {}} />);
  expect(screen.getByText(/\$1000/)).toBeInTheDocument();
});