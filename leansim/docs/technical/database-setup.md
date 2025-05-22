# Configuración de la Base de Datos para LeanSim

Este documento describe la configuración de la base de datos y Prisma ORM para el proyecto LeanSim.

## Requisitos previos

- Docker y Docker Compose instalados
- Node.js y npm instalados
- Acceso a la línea de comandos

## Estructura de la Base de Datos

LeanSim utiliza Prisma ORM con:

- SQLite para desarrollo local (opcional)
- PostgreSQL para desarrollo con Docker y producción

El esquema de la base de datos incluye las siguientes entidades principales:

- User: Usuarios de la aplicación
- LeanCanvas: Documentos Lean Canvas simplificados
- Simulation: Simulaciones financieras

## Configuración del Entorno

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
# Base de datos
DATABASE_URL="postgresql://leansim:leansim_password@localhost:5432/leansim?schema=public"

# Configuración de PostgreSQL
POSTGRES_USER=leansim
POSTGRES_PASSWORD=leansim_password
POSTGRES_DB=leansim
POSTGRES_PORT=5432

# Configuración de pgAdmin
PGADMIN_PORT=5050
PGADMIN_EMAIL=admin@leansim.com
PGADMIN_PASSWORD=admin

# Otras variables
NODE_ENV=development
```

### 2. Iniciar los Contenedores Docker

Ejecuta el siguiente comando para iniciar los contenedores de PostgreSQL y pgAdmin:

```bash
npm run docker:up
```

### 3. Generar el Cliente Prisma

Para generar el cliente Prisma basado en el esquema:

```bash
npm run prisma:generate
```

### 4. Crear las Migraciones

Para crear una nueva migración después de cambiar el esquema:

```bash
npm run prisma:migrate:dev -- --name nombre_descriptivo
```

### 5. Aplicar Migraciones

Para aplicar las migraciones a la base de datos:

```bash
npm run prisma:migrate:deploy
```

### 6. Seed de Datos

Para poblar la base de datos con datos iniciales:

```bash
npm run db:seed
```

### 7. Explorar la Base de Datos

Para abrir Prisma Studio y explorar/editar datos:

```bash
npm run prisma:studio
```

También puedes acceder a pgAdmin en http://localhost:5050 usando las credenciales definidas en las variables de entorno.

## Cambiar Entre Entornos

### Desarrollo con SQLite (Opcional)

Para usar SQLite en desarrollo, modifica la sección `datasource` en `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Producción con PostgreSQL

Para producción, asegúrate de que la sección `datasource` esté configurada para PostgreSQL y que la variable `DATABASE_URL` apunte a tu base de datos de producción.

## Solución de Problemas

Si encuentras errores al conectar con la base de datos:

1. Verifica que los contenedores Docker estén en ejecución:

   ```bash
   docker ps
   ```

2. Comprueba los logs de PostgreSQL:

   ```bash
   docker logs leansim-postgres
   ```

3. Asegúrate de que las variables de entorno sean correctas y que la URL de conexión sea válida.

4. Si has cambiado el esquema de Prisma, regenera el cliente:

   ```bash
   npm run prisma:generate
   ```

5. Para resetear la base de datos (⚠️ se perderán todos los datos):
   ```bash
   npm run prisma:migrate:reset
   ```
