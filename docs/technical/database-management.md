# Gestión de Base de Datos - LeanSim

## Descripción

Este documento detalla la configuración y gestión de bases de datos para el proyecto LeanSim, utilizando SQLite en entorno de desarrollo y PostgreSQL en producción. Se incluyen las instrucciones para configurar Prisma ORM con ambas bases de datos, la configuración de Docker para PostgreSQL, y las mejores prácticas para migraciones y seeding.

## Configuración de Prisma ORM

### Instalación de Dependencias

```bash
# Instalar dependencias de Prisma
npm install prisma --save-dev
npm install @prisma/client

# Inicializar Prisma
npx prisma init
```

### Configuración del Schema de Prisma

Crea el archivo `prisma/schema.prisma` con la siguiente configuración:

```prisma
// Definición del generador
generator client {
  provider = "prisma-client-js"
}

// Configuración de la base de datos basada en variables de entorno
datasource db {
  provider = env("DATABASE_PROVIDER")
  url      = env("DATABASE_URL")
}

// Definición de modelos basados en nuestro diagrama ER
model Simulation {
  id             String        @id @default(cuid())
  name           String
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  calculatedKPIs Json?
  deviceId       String
  leanCanvas     LeanCanvas?
  financialData  FinancialData?
}

model LeanCanvas {
  id                  String     @id @default(cuid())
  problem             String
  valueProposition    String
  customerSegment     String
  channels            String
  costRevenueStructure String
  simulation          Simulation @relation(fields: [simulationId], references: [id], onDelete: Cascade)
  simulationId        String     @unique
}

model FinancialData {
  id                       String     @id @default(cuid())
  monthlyRevenue           Float
  fixedCosts               Float
  variableCostsPerCustomer Float
  customerAcquisitionCost  Float
  estimatedCustomers       Int
  averagePricePerCustomer  Float
  customerLifetimeMonths   Float
  simulation               Simulation @relation(fields: [simulationId], references: [id], onDelete: Cascade)
  simulationId             String     @unique
}

model ContextualHelp {
  id          String @id @default(cuid())
  fieldKey    String @unique
  description String
  example     String
}
```

### Configuración de Variables de Entorno

Crea diferentes archivos de entorno para desarrollo y producción:

**`.env.development`**:

```
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./dev.db"
```

**`.env.production`**:

```
DATABASE_PROVIDER=postgresql
DATABASE_URL="postgresql://username:password@localhost:5432/leansim?schema=public"
```

### Script de Configuración de Base de Datos

Crea un script para gestionar la conexión a base de datos basada en el entorno:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Evitar múltiples instancias de Prisma Client en desarrollo con hot reloading
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
```

## Configuración de Docker para PostgreSQL

### Archivo Docker Compose

Crea un archivo `docker-compose.yml` en la raíz del proyecto:

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:14
    container_name: leansim_postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: leansim
      POSTGRES_PASSWORD: leansim_password
      POSTGRES_DB: leansim
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Scripts para Gestión de Docker

Añade los siguientes scripts en `package.json`:

```json
"scripts": {
  "db:start": "docker-compose up -d",
  "db:stop": "docker-compose down",
  "db:reset": "docker-compose down -v && docker-compose up -d"
}
```

## Gestión de Migraciones

### Migraciones para Desarrollo (SQLite)

```bash
# Crear migración inicial
npx prisma migrate dev --name init

# Aplicar migraciones existentes
npx prisma migrate dev

# Reiniciar la base de datos
npx prisma migrate reset
```

### Migraciones para Producción (PostgreSQL)

```bash
# Verificar migraciones antes de aplicar
npx prisma migrate deploy --preview-feature

# Aplicar migraciones en producción
npx prisma migrate deploy
```

## Seed de Datos

### Configuración de Seed Script

Crea un archivo `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed de ayudas contextuales
  const helpItems = [
    {
      fieldKey: "problem",
      description:
        "Describe los principales problemas que tu solución resuelve.",
      example:
        "Ejemplo: Emprendedores sin conocimientos financieros no pueden evaluar la viabilidad de sus ideas.",
    },
    {
      fieldKey: "valueProposition",
      description: "Resume el valor único que tu producto o servicio ofrece.",
      example:
        "Ejemplo: Plataforma que calcula KPIs financieros básicos sin necesidad de conocimientos técnicos.",
    },
    // Añadir más items para todos los campos
  ];

  for (const item of helpItems) {
    await prisma.contextualHelp.upsert({
      where: { fieldKey: item.fieldKey },
      update: item,
      create: item,
    });
  }

  console.log("Base de datos sembrada correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Configuración en package.json

```json
"scripts": {
  "db:seed": "npx ts-node --transpile-only prisma/seed.ts"
}
```

## Gestión de Entornos

### Configuración para Desarrollo

```bash
# Iniciar base de datos SQLite
npm run dev

# Prisma Studio (interfaz visual para la base de datos)
npx prisma studio
```

### Configuración para Producción

```bash
# 1. Iniciar contenedor de PostgreSQL
npm run db:start

# 2. Aplicar migraciones a PostgreSQL
NODE_ENV=production npx prisma migrate deploy

# 3. Seed inicial de datos (si es necesario)
NODE_ENV=production npm run db:seed

# 4. Iniciar aplicación
npm run build && npm start
```

## Buenas Prácticas

1. **Nunca ejecutar `prisma migrate dev` en producción**. Usa siempre `prisma migrate deploy`.

2. **Respaldos automáticos**: Configura respaldos periódicos de PostgreSQL en producción:

```yaml
# Añadir al docker-compose.yml
postgres-backup:
  image: prodrigestivill/postgres-backup-local
  restart: always
  volumes:
    - ./backups:/backups
  environment:
    - POSTGRES_HOST=postgres
    - POSTGRES_DB=leansim
    - POSTGRES_USER=leansim
    - POSTGRES_PASSWORD=leansim_password
    - SCHEDULE=@daily
    - BACKUP_KEEP_DAYS=7
  depends_on:
    - postgres
```

3. **Validación de esquema**: Antes de desplegar, valida que el esquema de Prisma sea compatible con PostgreSQL:

```bash
npx prisma validate
```

4. **Control de versiones de migraciones**: Incluye siempre los archivos de migración en tu repositorio.

5. **Despliegue en Vercel**: Para desplegar en Vercel con PostgreSQL:

   - Usa un proveedor como Supabase, Railway o Heroku para PostgreSQL
   - Configura la variable de entorno `DATABASE_URL` en Vercel
   - Asegúrate de ejecutar `prisma generate` durante el build

## Consideraciones para Vercel

Para el despliegue en Vercel, añade al `package.json`:

```json
"scripts": {
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

Y en Vercel:

1. Configura la variable de entorno `DATABASE_URL` con la URL de tu PostgreSQL
2. Configura la variable de entorno `DATABASE_PROVIDER=postgresql`

## Resolución de Problemas Comunes

1. **Error de conexión con PostgreSQL**:

   - Verifica que las credenciales sean correctas
   - Confirma que el puerto 5432 esté accesible
   - Comprueba que el firewall permita conexiones

2. **Problemas con las migraciones**:

   - Usa `npx prisma migrate reset` solo en desarrollo
   - Si hay conflictos en producción, considera crear una nueva migración

3. **Prisma Client no se actualiza**:
   - Ejecuta `npx prisma generate` después de cambios en el esquema
