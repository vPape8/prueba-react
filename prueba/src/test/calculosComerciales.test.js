import { calcularCostoComercial } from '../utils/calculos.js'; 
test('calcula correctamente los costos de un buque comercial básico', () => { 
  const datos = { tonelaje: 100, 
    dias: 2, 
    tipoCarga: 'general', 
    servicios: 'basico' }; 
    const resultado = calcularCostoComercial(datos); 
    expect(resultado.total).toBe(116); // según tu cálculo 
    expect(resultado.details.tarifaBase).toBe(100); 
    expect(resultado.details.impuestos).toBe(16); 
    expect(resultado.details.costoServicios).toBe(0); 
  });