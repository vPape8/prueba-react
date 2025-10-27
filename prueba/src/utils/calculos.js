export function calcularCostoComercial({ tonelaje, dias, tipoCarga, servicios }) {
  let tarifaBase = tonelaje * 0.5;

  switch (tipoCarga) {
    case 'contenedores': tarifaBase *= 1.2; break;
    case 'granel': tarifaBase *= 0.9; break;
    case 'liquido': tarifaBase *= 1.1; break;
    default: break;
  }

  let costoServicios = 0;
  switch (servicios) {
    case 'medio': costoServicios = 500; break;
    case 'completo': costoServicios = 1200; break;
    default: break;
  }

  const impuestos = (tarifaBase + costoServicios) * 0.16;
  const total = (tarifaBase + costoServicios + impuestos) * dias;

  return {
    total,
    details: {
      tarifaBase: tarifaBase * dias,
      costoServicios: costoServicios * dias,
      impuestos: impuestos * dias
    }
  };
}
