import React from 'react';
import { render } from '@testing-library/react';
import ModalDetalles from '../components/ModalDetalles.jsx';
import '@testing-library/jest-dom';

test('el componente ModalDetalles coincide con el snapshot (testing-library)', () => {
  const calculoMock = {
    total: 1000,
    tipoCarga: 'general',
    details: {
      tarifaBase: 800,
      costoServicios: 150,
      impuestos: 50
    }
  };

  const { asFragment } = render(<ModalDetalles calculo={calculoMock} onClose={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});