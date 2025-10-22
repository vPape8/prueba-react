// src/utils/exportToExcel.js
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (calculos, filename = 'reportes') => {
  if (!calculos || calculos.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  try {
    // Crear nuevo workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'LogistNav';
    workbook.created = new Date();
    
    // Hoja de reportes detallados
    const worksheet = workbook.addWorksheet('Reportes');
    
    // Definir columnas
    const columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Tipo', key: 'tipo', width: 12 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Tonelaje (TRB)', key: 'tonelaje', width: 15 },
      { header: 'Eslora (m)', key: 'eslora', width: 12 },
      { header: 'Pasajeros', key: 'pasajeros', width: 12 },
      { header: 'Días', key: 'dias', width: 8 },
      { header: 'Tipo de Carga/Buque', key: 'tipoDetalle', width: 20 },
      { header: 'Servicios', key: 'servicios', width: 20 },
      { header: 'Tarifa Base', key: 'tarifaBase', width: 15 },
      { header: 'Servicios Costo', key: 'costoServicios', width: 15 },
      { header: 'Impuestos', key: 'impuestos', width: 15 },
      { header: 'ID', key: 'id', width: 12 }
    ];

    worksheet.columns = columns;

    // Agregar encabezados con estilo
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' }
    };
    headerRow.alignment = { horizontal: 'center' };

    // Agregar datos
    calculos.forEach(calculo => {
      const rowData = {
        fecha: new Date(calculo.fecha).toLocaleString(),
        tipo: calculo.tipoDisplay,
        total: `$${calculo.total.toFixed(2)}`,
        id: calculo.id
      };

      // Llenar datos específicos según el tipo
      if (calculo.details) {
        switch (calculo.tipo) {
          case 'comercial':
            Object.assign(rowData, {
              tonelaje: calculo.details.tonelaje,
              dias: calculo.details.dias,
              tipoDetalle: calculo.details.tipo,
              servicios: calculo.details.servicios,
              tarifaBase: `$${calculo.details.tarifaBase?.toFixed(2)}`,
              costoServicios: `$${calculo.details.costoServicios?.toFixed(2)}`,
              impuestos: `$${calculo.details.impuestos?.toFixed(2)}`
            });
            break;
          
          case 'especial':
            Object.assign(rowData, {
              tonelaje: calculo.details.tonelaje,
              dias: calculo.details.dias,
              tipoDetalle: calculo.details.tipo,
              servicios: calculo.details.servicios,
              tarifaBase: `$${calculo.details.tarifaBase?.toFixed(2)}`,
              costoServicios: `$${calculo.details.especialServicios?.toFixed(2)}`,
              impuestos: `$${calculo.details.impuestos?.toFixed(2)}`
            });
            break;
          
          case 'pasajero':
            Object.assign(rowData, {
              eslora: calculo.details.eslora,
              pasajeros: calculo.details.pasajeros,
              dias: calculo.details.dias,
              tipoDetalle: calculo.details.tipo,
              tarifaBase: `$${calculo.details.tarifaBase?.toFixed(2)}`,
              costoServicios: `$${calculo.details.tarifaPasajero?.toFixed(2)}`,
              impuestos: `$${calculo.details.impuestos?.toFixed(2)}`
            });
            break;
        }
      }

      worksheet.addRow(rowData);
    });

    // Aplicar bordes a todas las celdas con datos
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Alinear números a la derecha
        if (rowNumber > 1 && (cell.value && typeof cell.value === 'string' && cell.value.startsWith('$'))) {
          cell.alignment = { horizontal: 'right' };
        }
      });
    });

    // Crear hoja de resumen
    await crearHojaResumen(workbook, calculos);

    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().split('T')[0];
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, `${filename}_${fecha}.xlsx`);
    
    console.log('✅ Archivo Excel exportado exitosamente');

  } catch (error) {
    console.error('❌ Error al exportar a Excel:', error);
    alert('Error al exportar el archivo Excel. Revisa la consola para más detalles.');
  }
};

const crearHojaResumen = async (workbook, calculos) => {
  if (!calculos || calculos.length === 0) return;

  const worksheet = workbook.addWorksheet('Resumen');

  // Calcular estadísticas
  const totalCalculos = calculos.length;
  const totalIngresos = calculos.reduce((sum, calc) => sum + calc.total, 0);
  const promedio = totalIngresos / totalCalculos;

  const porTipo = calculos.reduce((acc, calc) => {
    acc[calc.tipo] = (acc[calc.tipo] || 0) + 1;
    return acc;
  }, {});

  const ingresosPorTipo = calculos.reduce((acc, calc) => {
    acc[calc.tipo] = (acc[calc.tipo] || 0) + calc.total;
    return acc;
  }, {});

  // Título principal
  worksheet.mergeCells('A1:C1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'RESUMEN DE REPORTES - LOGISTNAV';
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2F75B5' }
  };
  titleCell.alignment = { horizontal: 'center' };

  // Estadísticas generales
  worksheet.mergeCells('A3:C3');
  const statsTitle = worksheet.getCell('A3');
  statsTitle.value = 'ESTADÍSTICAS GENERALES';
  statsTitle.font = { bold: true, size: 14 };

  worksheet.addRow(['Total de cálculos:', totalCalculos, '']);
  worksheet.addRow(['Ingresos totales:', `$${totalIngresos.toFixed(2)}`, '']);
  worksheet.addRow(['Promedio por cálculo:', `$${promedio.toFixed(2)}`, '']);
  worksheet.addRow(['', '', '']);

  // Estadísticas por tipo
  worksheet.mergeCells('A8:C8');
  const typeTitle = worksheet.getCell('A8');
  typeTitle.value = 'ESTADÍSTICAS POR TIPO';
  typeTitle.font = { bold: true, size: 14 };

  // Encabezados de tabla
  const headerRow = worksheet.getRow(9);
  headerRow.values = ['Tipo', 'Cantidad', 'Ingresos'];
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '70AD47' }
  };
  headerRow.alignment = { horizontal: 'center' };

  // Datos por tipo
  let currentRow = 10;
  Object.entries(porTipo).forEach(([tipo, cantidad]) => {
    const tipoDisplay = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const ingresos = ingresosPorTipo[tipo] || 0;
    
    worksheet.getCell(`A${currentRow}`).value = tipoDisplay;
    worksheet.getCell(`B${currentRow}`).value = cantidad;
    worksheet.getCell(`C${currentRow}`).value = `$${ingresos.toFixed(2)}`;
    currentRow++;
  });

  // Aplicar bordes y estilos
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= 4 && rowNumber <= 6) {
      // Estadísticas generales
      row.getCell(2).font = { bold: true };
    }
    
    if (rowNumber >= 10) {
      // Datos de tipos
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  });

  // Ajustar anchos de columna
  worksheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 15 }
  ];
};

export const exportAllData = async () => {
  try {
    const comerciales = JSON.parse(localStorage.getItem('calculosComerciales') || '[]');
    const especiales = JSON.parse(localStorage.getItem('calculosEspeciales') || '[]');
    const pasajeros = JSON.parse(localStorage.getItem('calculosPasajeros') || '[]');

    const todosCalculos = [
      ...comerciales.map(c => ({ ...c, tipo: 'comercial', tipoDisplay: 'Comercial' })),
      ...especiales.map(c => ({ ...c, tipo: 'especial', tipoDisplay: 'Especial' })),
      ...pasajeros.map(c => ({ ...c, tipo: 'pasajero', tipoDisplay: 'Pasajero' }))
    ];

    if (todosCalculos.length === 0) {
      alert('No hay datos en el sistema para exportar');
      return;
    }

    await exportToExcel(todosCalculos, 'reportes_completos');
    
  } catch (error) {
    console.error('Error al exportar todos los datos:', error);
    alert('Error al exportar los datos completos');
  }
};