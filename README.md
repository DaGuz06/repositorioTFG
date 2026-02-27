# 🍽️ ChefPro - Experiencias Culinarias a Domicilio

**ChefPro** es una plataforma web que conecta a amantes de la buena comida con personas apasionadas de la cocina. Los usuarios pueden explorar perfiles, descubrir menús exclusivos y contratar a un chef para disfrutar de comida casera en la comodidad de su hogar sin tener que cocinar.

---

## Requisitos Previos

- **Node.js**: [Descargar aquí](https://nodejs.org/) (Versión 18+ recomendada)
- **PostgreSQL**: Servidor de base de datos en ejecución (ej. pgAdmin local o Supabase en la nube).
- **Git** (Opcional, para clonar).

---

## Instalación Rápida (5 Minutos)

### 1. Base de Datos
Este proyecto utiliza PostgreSQL alojado en Supabase (o un servidor local equivalente).
1. Abre tu gestor de base de datos (pgAdmin, DBeaver, psql).
2. Importa el archivo **`chef_pro_final.sql`** ubicado en la raíz de este proyecto.
   - *Este script creará las tablas necesarias en tu esquema de PostgreSQL y cargará los datos de prueba (`users`, `chef_profiles`, etc.).*

### 2. Backend (Servidor)
Abre una terminal en la carpeta `Backend - NodeJS`:

```bash
cd "Backend - NodeJS"
npm install
npm run dev
```

**Configuración `.env` (si es necesario):**
Crea un archivo llamado `.env` en la carpeta `Backend - NodeJS` con:
```env
DB_HOST=aws-1-eu-west-1.pooler.supabase.com
DB_USER=postgres.uzqbhnvkiuaokkyvzxnv
DB_PASSWORD=      # Tu contraseña o ChefProMedac
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=super_secret_key
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

### Usuarios de Prueba (Pre-cargados)
Asegúrate de importar `chef_pro_final.sql` para tener estos usuarios:

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Chef** | `chef@test.com` | `123456` |
| **Cliente** | `cliente@test.com` | `123456` |
| **Admin** | `admin@test.com` | `123456` |

---
**¿Problemas?**
- Si el backend falla, verifica que PostgreSQL esté corriendo y las credenciales en `.env` sean correctas.
- Si faltan tablas, vuelve a importar `chef_pro_final.sql`.
- Si hay errores de dependencias en el frontend, ejecuta `npm install --legacy-peer-deps`.

---

## 🛠️ Detalles Técnicos

### Arquitectura
El proyecto sigue una arquitectura **Cliente-Servidor (SPA)** separada:
- **Frontend**: Aplicación Angular (Single Page Application) que consume la API.
- **Backend**: API RESTful en Node.js/Express que gestiona la lógica y la base de datos.

### Tecnologías Clave
*   **Frontend**: Angular 17+ (Standalone Components), TypeScript, CSS Modular.
*   **Backend**: Node.js, Express, TypeScript.
*   **Base de Datos**: PostgreSQL (Relacional).
*   **Acceso a datos**: `pg` (node-postgres module) como gestor de conexiones eficiente.
*   `db.ts`: Capa de abstracción para manejar el pool de conexiones y consultas (`pool.query(...)`).
*   **Autenticación**: JWT (JSON Web Tokens) y Bcrypt (Hashing de contraseñas).

### Funcionalidades
1.  **Usuarios**: Registro/Login (Clientes y Chefs). Autenticación con Google.
2.  **Chefs**: Perfil detallado (Bio, Especialidades), gestión de Menús (Platos) y zona de trabajo.
3.  **Reservas**:
    *   Cliente selecciona Chef -> Ve platos -> Reserva fecha.
    *   Formulario incluye datos de contacto y se asocia al Chef seleccionado.
4.  **Admin**: Panel de administración para gestión global (ruta `/loginAdmin`).

---

## 🗄️ Esquema de Base de Datos

La base de datos consta de 6 tablas principales (ver `chef_pro_final.sql`):

| Tabla | Descripción |
| :--- | :--- |
| **`users`** | Almacena todos los usuarios (Clientes, Chefs, Admin). Diferenciados por `role_id`. |
| **`roles`** | Define los roles: 1=Chef, 2=Comensal, 3=Admin. |
| **`chef_profiles`** | Información extendida de los Chefs (Bio, Especialidades, Coche, Valoración). Vinculado a `users`. |
| **`menus`** | Platos disponibles creados por cada Chef. Vinculado a `users` (chef_id). |
| **`reservations`** | Citas concertadas. Incluye fecha, contacto del cliente y el `chef_id` asignado. |
| **`reviews`** | Opiniones y puntuaciones que los usuarios dejan a los Chefs. |
