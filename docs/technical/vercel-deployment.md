# Guía de Despliegue en Vercel - LeanSim

## Descripción

Este documento detalla el proceso completo para desplegar la aplicación LeanSim en Vercel, desde la configuración inicial hasta la puesta en producción. Incluye la integración con bases de datos PostgreSQL, configuración de variables de entorno, y mejores prácticas recomendadas por Vercel.

## Prerrequisitos

Antes de iniciar el despliegue, asegúrate de contar con:

1. Una cuenta en [Vercel](https://vercel.com)
2. Repositorio de código en GitHub, GitLab o Bitbucket
3. Base de datos PostgreSQL accesible desde Internet (Supabase, Railway, Neon, etc.)
4. Proyecto Next.js funcionando correctamente en entorno local

## Proceso de Despliegue

### 1. Preparación del Proyecto

#### Configuración de package.json

Añade los siguientes scripts para optimizar el despliegue en Vercel:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

#### Configuración de next.config.js

Asegúrate de que tu archivo `next.config.js` incluya las configuraciones óptimas para producción:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["yourdomain.com"],
  },
  // Optimizaciones específicas para Vercel
  experimental: {
    outputFileTracingRoot:
      process.env.NODE_ENV === "production" ? undefined : process.cwd(),
  },
};

module.exports = nextConfig;
```

### 2. Configuración de la Base de Datos PostgreSQL

Para LeanSim, se recomienda utilizar servicios gestionados de PostgreSQL compatibles con Vercel:

| Servicio | Características                                         | Recomendado para                       |
| -------- | ------------------------------------------------------- | -------------------------------------- |
| Neon     | Serverless, escalado automático, capa gratuita generosa | MVP, startups                          |
| Supabase | PostgreSQL + Auth + Storage + Funciones                 | Proyectos que necesitan más que una BD |
| Railway  | Fácil de usar, despliegue rápido                        | Desarrollo rápido                      |

#### Conexión desde Vercel

1. Obtén la cadena de conexión de tu proveedor de PostgreSQL
2. Asegúrate de que incluya SSL para conexiones seguras
3. Verifica que la base de datos permita conexiones desde los rangos IP de Vercel o desde cualquier IP

### 3. Despliegue desde el Dashboard de Vercel

1. Inicia sesión en [Vercel](https://vercel.com)
2. Haz clic en "Add New..." → "Project"
3. Importa tu repositorio desde GitHub, GitLab o Bitbucket
4. Configura el proyecto con los siguientes ajustes:

   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (o la carpeta donde se encuentra tu proyecto)
   - **Build Command**: Deja el valor predeterminado (usa el script del package.json)
   - **Output Directory**: Deja el valor predeterminado (`.next`)
   - **Environment Variables**: Configura las siguientes variables de entorno:

     ```
     DATABASE_PROVIDER=postgresql
     DATABASE_URL=postgresql://usuario:contraseña@host:puerto/basedatos?sslmode=require
     NEXTAUTH_URL=https://tu-dominio.vercel.app (si usas NextAuth.js)
     NEXTAUTH_SECRET=un-secreto-aleatorio-y-seguro (si usas NextAuth.js)
     ```

5. Haz clic en "Deploy"

### 4. Verificación y Configuración Post-Despliegue

Una vez completado el despliegue inicial:

1. Verifica que la aplicación se haya desplegado correctamente
2. Comprueba los logs de build y despliegue para posibles errores
3. Verifica que la conexión a la base de datos funcione correctamente
4. Configura un dominio personalizado (opcional):
   - En el dashboard del proyecto, ve a "Settings" → "Domains"
   - Añade tu dominio personalizado y sigue las instrucciones para verificarlo

### 5. Configuración de Despliegue Continuo

Vercel configura automáticamente la integración con Git para despliegue continuo:

- **Production Branch**: Cada push a la rama principal (main/master) genera un despliegue en producción
- **Preview Deployments**: Cada pull request genera un despliegue de vista previa con URL única
- **Environment Variables por Entorno**: Puedes configurar variables de entorno diferentes para producción y previews

Para optimizar el flujo de trabajo:

1. Configura verificaciones de calidad antes del despliegue:

   - En el dashboard del proyecto, ve a "Settings" → "Git"
   - Activa "Require Production Pipeline" para ejecutar pruebas antes del despliegue

2. Configura protección de ramas en tu repositorio Git para requerir revisiones de código antes de fusionar con la rama principal

### 6. Manejo de la Base de Datos en Producción

#### Migraciones Seguras

Para manejar migraciones en producción:

1. Nunca ejecutes `prisma migrate dev` en producción
2. Usa la configuración automática en `vercel-build` script que ejecuta `prisma migrate deploy`
3. Mantén todas las migraciones en control de versiones

#### Configuración Específica para Prisma en Vercel

Para un rendimiento óptimo:

```typescript
// src/lib/prisma.ts optimizado para Vercel
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Optimizaciones para entornos serverless como Vercel
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 7. Optimizaciones y Mejores Prácticas

#### Optimización de Imágenes

Vercel ofrece un servicio de optimización de imágenes integrado:

```jsx
import Image from "next/image";

function MyComponent() {
  return (
    <Image
      src="/path/to/image.jpg"
      alt="Descripción"
      width={500}
      height={300}
      priority
    />
  );
}
```

#### Edge Functions y Middlewares

Aprovecha las Edge Functions de Vercel para mejorar el rendimiento:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Lógica de middleware
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
```

#### Analytics y Monitorización

Activa Vercel Analytics para obtener información sobre el rendimiento:

1. En el dashboard del proyecto, ve a "Analytics"
2. Haz clic en "Enable Analytics"
3. Configura las métricas que deseas monitorizar

### 8. Resolución de Problemas Comunes

#### Error en Migraciones de Base de Datos

Si las migraciones fallan durante el despliegue:

1. Verifica los logs de build en Vercel
2. Asegúrate de que la URL de conexión a la base de datos sea correcta
3. Verifica que el usuario tenga permisos suficientes para crear tablas
4. Considera ejecutar las migraciones manualmente antes del despliegue

```bash
# Ejecutar migraciones manualmente
npx prisma migrate deploy
```

#### Errores 500 o Timeout

Si la aplicación desplegada muestra errores 500 o timeouts:

1. Verifica la conexión a la base de datos
2. Comprueba que las variables de entorno estén correctamente configuradas
3. Revisa los logs de serverless functions en el dashboard de Vercel

#### Problema con la Generación del Cliente Prisma

Si Prisma Client no se genera correctamente:

1. Verifica que el script `postinstall` esté configurado
2. Fuerza una regeneración del cliente en el siguiente despliegue:
   - En Vercel, ve a "Settings" → "General"
   - Haz clic en "Build & Development Settings"
   - Activa "Install Command" y configúralo como `npm install && npx prisma generate`

## Recursos Adicionales

- [Documentación oficial de Vercel](https://vercel.com/docs)
- [Guía de despliegue de Next.js en Vercel](https://nextjs.org/docs/deployment)
- [Mejores prácticas para Prisma en entornos serverless](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel CLI para despliegues y pruebas locales](https://vercel.com/cli)

## Consideraciones de Seguridad

- No expongas variables de entorno sensibles en el código cliente
- Utiliza siempre conexiones SSL para la base de datos
- Configura políticas de Content Security Policy (CSP) apropiadas
- Habilita protección contra DDoS utilizando los servicios de Vercel
