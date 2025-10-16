// Historial de cálculos
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!checkAuth()) {
        return;
    }
    
    // Cargar historial
    loadHistorial();
    
    // Configurar filtros
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('filter-type').addEventListener('change', applyFilters);
    document.getElementById('filter-date').addEventListener('change', applyFilters);
    
    // Configurar limpieza de historial
    document.getElementById('clear-history').addEventListener('click', clearHistory);
    
    // Configurar modal
    const modal = document.getElementById('boleta-modal');
    const span = document.getElementsByClassName('close')[0];
    
    span.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

function loadHistorial() {
    const calculations = JSON.parse(localStorage.getItem('userCalculations') || '[]');
    const currentUser = getCurrentUser();
    
    // Filtrar cálculos del usuario actual
    const userCalculations = calculations.filter(calc => calc.userId === currentUser.id);
    
    displayHistorial(userCalculations);
}

function displayHistorial(calculations) {
    const container = document.getElementById('historial-container');
    const noResults = document.getElementById('no-results');
    
    if (calculations.length === 0) {
        container.innerHTML = '<p>No tienes boletas en tu historial.</p>';
        noResults.style.display = 'none';
        return;
    }
    
    // Ordenar por fecha (más recientes primero)
    calculations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    calculations.forEach(calc => {
        html += `
            <div class="boleta-item" data-id="${calc.id}">
                <div class="boleta-info">
                    <div class="boleta-type">${getCalculationType(calc.type)}</div>
                    <div class="boleta-details">${formatBoletaDetails(calc)}</div>
                    <div class="boleta-date">${formatDate(calc.date)}</div>
                </div>
                <div class="boleta-total">$${calc.total.toFixed(2)}</div>
                <div class="boleta-actions">
                    <button class="btn btn-sm btn-primary view-boleta" data-id="${calc.id}">Ver</button>
                    <button class="btn btn-sm btn-secondary download-boleta" data-id="${calc.id}">PDF</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.view-boleta').forEach(btn => {
        btn.addEventListener('click', function() {
            viewBoleta(this.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.download-boleta').forEach(btn => {
        btn.addEventListener('click', function() {
            downloadBoletaPDF(this.getAttribute('data-id'));
        });
    });
}

function applyFilters() {
    const typeFilter = document.getElementById('filter-type').value;
    const dateFilter = document.getElementById('filter-date').value;
    
    const calculations = JSON.parse(localStorage.getItem('userCalculations') || '[]');
    const currentUser = getCurrentUser();
    
    let filteredCalculations = calculations.filter(calc => calc.userId === currentUser.id);
    
    // Aplicar filtro por tipo
    if (typeFilter !== 'all') {
        filteredCalculations = filteredCalculations.filter(calc => calc.type === typeFilter);
    }
    
    // Aplicar filtro por fecha
    if (dateFilter) {
        filteredCalculations = filteredCalculations.filter(calc => {
            const calcDate = new Date(calc.date).toISOString().split('T')[0];
            return calcDate === dateFilter;
        });
    }
    
    displayHistorial(filteredCalculations);
    
    // Mostrar mensaje si no hay resultados
    const noResults = document.getElementById('no-results');
    if (filteredCalculations.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

function viewBoleta(calculationId) {
    const calculations = JSON.parse(localStorage.getItem('userCalculations') || '[]');
    const calculation = calculations.find(calc => calc.id == calculationId);
    
    if (!calculation) return;
    
    const currentUser = getCurrentUser();
    const modal = document.getElementById('boleta-modal');
    const boletaContent = document.getElementById('boleta-content');
    
    boletaContent.innerHTML = generateBoletaHTML(calculation, currentUser);
    modal.style.display = 'block';
    
    // Configurar botones de acción
    document.getElementById('download-pdf').onclick = function() {
        downloadBoletaPDF(calculationId);
    };
    
    document.getElementById('print-boleta').onclick = function() {
        printBoleta(calculationId);
    };
}

function downloadBoletaPDF(calculationId) {
    const calculations = JSON.parse(localStorage.getItem('userCalculations') || '[]');
    const calculation = calculations.find(calc => calc.id == calculationId);
    
    if (!calculation) return;
    
    const currentUser = getCurrentUser();
    const boletaHTML = generateBoletaHTML(calculation, currentUser);
    
    // Configurar opciones para html2pdf
    const options = {
        margin: 10,
        filename: `boleta-${calculation.type}-${calculation.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generar PDF
    html2pdf().from(boletaHTML).set(options).save();
}

function printBoleta(calculationId) {
    const calculations = JSON.parse(localStorage.getItem('userCalculations') || '[]');
    const calculation = calculations.find(calc => calc.id == calculationId);
    
    if (!calculation) return;
    
    const currentUser = getCurrentUser();
    const boletaHTML = generateBoletaHTML(calculation, currentUser);
    
    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Boleta - ${getCalculationType(calculation.type)}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .boleta-preview { max-width: 800px; margin: 0 auto; }
            </style>
        </head>
        <body>
            ${boletaHTML}
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() {
                        window.close();
                    }, 100);
                }
            <\/script>
        </body>
        </html>
    `);
    ventana.document.close();
}

function generateBoletaHTML(calculation, user) {
    const typeText = getCalculationType(calculation.type);
    const date = formatDate(calculation.date);
    const details = calculation.details;
    
    return `
        <div class="boleta-preview">
            <div class="boleta-header">
                <h2 class="boleta-title">Calculadora Portuaria</h2>
                <p class="boleta-subtitle">Boleta de Cálculo - ${typeText}</p>
                <p class="boleta-subtitle">${date}</p>
            </div>
            
            <div class="boleta-body">
                <div class="boleta-detail">
                    <strong>Generado por:</strong> 
                    <span>${user.name} (${user.email})</span>
                </div>
                
                <h3>Detalles del Cálculo</h3>
                
                ${generateDetailsHTML(calculation)}
                
                <div class="boleta-totals">
                    <div class="boleta-detail">
                        <strong>Tarifa Base:</strong> 
                        <span>$${details.tarifaBase.toFixed(2)}</span>
                    </div>
                    
                    ${details.costoServicios ? `
                    <div class="boleta-detail">
                        <strong>Servicios Adicionales:</strong> 
                        <span>$${details.costoServicios.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    ${details.tarifaPasajero ? `
                    <div class="boleta-detail">
                        <strong>Tarifa por Pasajero:</strong> 
                        <span>$${details.tarifaPasajero.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    ${details.especialServicios ? `
                    <div class="boleta-detail">
                        <strong>Servicios Especiales:</strong> 
                        <span>$${details.especialServicios.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    <div class="boleta-detail">
                        <strong>Impuestos (16%):</strong> 
                        <span>$${details.impuestos.toFixed(2)}</span>
                    </div>
                    
                    <div class="boleta-detail">
                        <strong>TOTAL:</strong> 
                        <span class="boleta-total-grande">$${calculation.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div class="boleta-footer">
                <p>Este documento fue generado automáticamente por el sistema de cálculo portuario</p>
            </div>
        </div>
    `;
}

function generateDetailsHTML(calculation) {
    const details = calculation.details;
    let html = '';
    
    switch(calculation.type) {
        case 'comercial':
            html = `
                <div class="boleta-detail">
                    <strong>Tipo de Buque:</strong> 
                    <span>Comercial</span>
                </div>
                <div class="boleta-detail">
                    <strong>Tonelaje (TRB):</strong> 
                    <span>${details.tonelaje}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Días de Estadía:</strong> 
                    <span>${details.dias}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Tipo de Carga:</strong> 
                    <span>${getTipoCarga(details.tipo)}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Servicios:</strong> 
                    <span>${getTipoServicios(details.servicios)}</span>
                </div>
            `;
            break;
            
        case 'pasaje':
            html = `
                <div class="boleta-detail">
                    <strong>Tipo de Buque:</strong> 
                    <span>De Pasaje</span>
                </div>
                <div class="boleta-detail">
                    <strong>Eslora (metros):</strong> 
                    <span>${details.eslora}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Número de Pasajeros:</strong> 
                    <span>${details.pasajeros}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Días de Estadía:</strong> 
                    <span>${details.dias}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Tipo de Buque:</strong> 
                    <span>${getTipoBuquePasaje(details.tipo)}</span>
                </div>
            `;
            break;
            
        case 'especial':
            html = `
                <div class="boleta-detail">
                    <strong>Tipo de Buque:</strong> 
                    <span>Especial</span>
                </div>
                <div class="boleta-detail">
                    <strong>Tonelaje (TRB):</strong> 
                    <span>${details.tonelaje}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Días de Estadía:</strong> 
                    <span>${details.dias}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Tipo de Buque:</strong> 
                    <span>${getTipoBuqueEspecial(details.tipo)}</span>
                </div>
                <div class="boleta-detail">
                    <strong>Servicios Especiales:</strong> 
                    <span>${getTipoServiciosEspeciales(details.servicios)}</span>
                </div>
            `;
            break;
    }
    
    return html;
}

function clearHistory() {
    if (!confirm('¿Estás seguro de que deseas eliminar todo tu historial? Esta acción no se puede deshacer.')) {
        return;
    }
    
    const calculations = JSON.parse(localStorage.getItem('userCalculations') || '[]');
    const currentUser = getCurrentUser();
    
    // Mantener solo los cálculos de otros usuarios
    const filteredCalculations = calculations.filter(calc => calc.userId !== currentUser.id);
    
    localStorage.setItem('userCalculations', JSON.stringify(filteredCalculations));
    loadHistorial();
}

// Funciones auxiliares
function getCalculationType(type) {
    const types = {
        'comercial': 'Buque Comercial',
        'pasaje': 'Buque de Pasaje',
        'especial': 'Buque Especial'
    };
    
    return types[type] || 'Cálculo';
}

function formatBoletaDetails(calc) {
    switch(calc.type) {
        case 'comercial':
            return `Tonelaje: ${calc.details.tonelaje} TRB, Días: ${calc.details.dias}`;
        case 'pasaje':
            return `Eslora: ${calc.details.eslora}m, Pasajeros: ${calc.details.pasajeros}`;
        case 'especial':
            return `Tonelaje: ${calc.details.tonelaje} TRB, Días: ${calc.details.dias}`;
        default:
            return 'Detalles del cálculo';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTipoCarga(tipo) {
    const tipos = {
        'general': 'Carga General',
        'contenedores': 'Contenedores',
        'granel': 'Granel Sólido',
        'liquido': 'Granel Líquido'
    };
    return tipos[tipo] || tipo;
}

function getTipoServicios(servicios) {
    const tipos = {
        'basico': 'Solo estadía',
        'medio': 'Estadía + Remolque',
        'completo': 'Estadía + Remolque + Suministros'
    };
    return tipos[servicios] || servicios;
}

function getTipoBuquePasaje(tipo) {
    const tipos = {
        'crucero': 'Crucero',
        'transbordador': 'Transbordador',
        'yate': 'Yate de pasaje'
    };
    return tipos[tipo] || tipo;
}

function getTipoBuqueEspecial(tipo) {
    const tipos = {
        'investigacion': 'Investigación',
        'pesca': 'Pesquero',
        'proteccion': 'Protección ambiental',
        'militar': 'Militar'
    };
    return tipos[tipo] || tipo;
}

function getTipoServiciosEspeciales(servicios) {
    const tipos = {
        'ninguno': 'Ninguno',
        'seguridad': 'Seguridad adicional',
        'tecnicos': 'Servicios técnicos',
        'completos': 'Servicios completos'
    };
    return tipos[servicios] || servicios;
}