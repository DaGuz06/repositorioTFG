# ChefPro - Plataforma de Chefs a Domicilio

¡Bienvenido! Sigue estos pasos para poner en marcha el proyecto en **menos de 5 minutos**.

## Requisitos Previos

- **Node.js**: [Descargar aquí](https://nodejs.org/) (Versión 18+ recomendada)
- **MySQL**: Servidor de base de datos en ejecución (ej. XAMPP o servicio local).
- **Git** (Opcional, para clonar).

---

## Instalación Rápida (5 Minutos)

### 1. Base de Datos
1. Abre tu gestor de base de datos (phpMyAdmin, Workbench, o Terminal).
2. Importa el archivo **`chef_pro_final.sql`** ubicado en la raíz de este proyecto.
   - *Este script creará la base de datos `chef_pro`, las tablas y configurará todo automáticamente.*

### 2. Backend (Servidor)
Abre una terminal en la carpeta `Backend - NodeJS`:

```bash
cd "Backend - NodeJS"
npm install
# Crea un archivo .env si no existe y configura tus credenciales de BD (ver abajo)
npm start
```

**Configuración `.env` (si es necesario):**
Crea un archivo llamado `.env` en la carpeta `Backend - NodeJS` con:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=      # Tu contraseña (o déjalo vacío si usas XAMPP por defecto)
DB_NAME=chef_pro
PORT=3000
```

### 3. Frontend (Cliente)
Abre una **nueva** terminal en la carpeta `Frontend - Angular`:

```bash
cd "Frontend - Angular"
npm install
ng serve -o
```

---

## ¡Listo!
La aplicación se abrirá automáticamente en tu navegador (usualmente en `http://localhost:4200`).

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000

### Usuarios de Prueba (Roles)
- **Chef**: Revisa la tabla `users` o crea uno nuevo.
- **Cliente**: Registrate en la web.
- **Admin**: Accede a `/loginAdmin`.

---
**¿Problemas?**
- Si el backend falla, verifica que MySQL esté corriendo y las credenciales en `.env` sean correctas.
- Si faltan tablas, vuelve a importar `chef_pro_final.sql`.
