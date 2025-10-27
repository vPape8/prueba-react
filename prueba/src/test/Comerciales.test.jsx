import React from 'react';
import { render, screen } from '@testing-library/react';
import Comerciales from '../pages/Comerciales.jsx';
import '@testing-library/jest-dom';

test('Componente Comerciales se renderiza', () => {
  render(<Comerciales />);
  expect(screen.getByText(/Buques Comerciales/i)).toBeInTheDocument();
});
