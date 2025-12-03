🚢 Sistema de Gestión Portuaria

Este proyecto es una aplicación web integral para la gestión de operaciones portuarias. Permite a los administradores y operadores gestionar buques, calcular tarifas de atraque y descarga, y generar reportes detallados de las operaciones.

El sistema está construido con una arquitectura moderna separada en Frontend (React) y Backend (Spring Boot), desplegada en la nube de AWS.
🚀 Tecnologías Utilizadas
Frontend

    React + Vite: Para una interfaz de usuario rápida y reactiva.

    React Router: Manejo de rutas y navegación (protección de rutas privadas).

    CSS Puro / Módulos: Estilos personalizados (auth.css, panel.css, etc.).

    Axios / Fetch: Comunicación con la API REST.

Backend

    Java 17 + Spring Boot: Núcleo de la lógica de negocio.

    Spring Security + JWT: Autenticación segura y manejo de sesiones sin estado.

    Hibernate / JPA: ORM para la gestión de datos.

    MySQL: Base de datos relacional.

    Swagger UI: Documentación interactiva de la API.

Infraestructura (Cloud)

    AWS EC2: Servidor Linux alojando el Backend (Docker/Java).

    AWS S3: Alojamiento estático del Frontend.

    AWS RDS (Opcional): Base de datos MySQL gestionada.

📋 Funcionalidades Principales

    Autenticación Segura:

        Login con validación de credenciales contra base de datos.

        Protección de rutas mediante JWT (JSON Web Tokens).

        Redirección automática de usuarios no autenticados.

    Módulo de Calculadora:

        Cálculo de costos basado en el tipo de buque (Comercial, Pasajeros, Especiales).

        Integración con tarifas de puerto y eslora del buque.

    Gestión de Reportes:

        Visualización de historial de boletas y operaciones.

        Tablas dinámicas con detalles de funcionarios y fechas.

        Exportación a Excel: Funcionalidad para descargar reportes en .xlsx.

    Panel de Administración:

        Dashboard centralizado para acceso rápido a las secciones (Comerciales, Pasajeros, Historial).

🛠️ Instalación y Despliegue Local
Requisitos Previos

    Node.js (v18 o superior)

    Java JDK 17

    MySQL Server

    Maven
