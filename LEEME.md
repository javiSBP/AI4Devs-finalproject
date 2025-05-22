# LeanSim

Simulador de modelos de negocio para emprendedores. LeanSim permite a los usuarios crear y simular diferentes escenarios para sus modelos de negocio utilizando el enfoque Lean Canvas.

## Características

- Creación de modelos de negocio utilizando Lean Canvas
- Formularios de entrada para datos financieros
- Simulación de escenarios financieros
- Visualización de KPIs y resultados
- Sistema de ayudas contextuales
- Historial de simulaciones

## Tecnologías

- **Next.js** - Framework de React para aplicaciones web
- **TypeScript** - Superset tipado de JavaScript
- **TailwindCSS** - Framework de CSS utilitario
- **Prisma** - ORM para la base de datos
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Vitest** - Framework de testing

## Inicio rápido

### Prerrequisitos

- Node.js (v18.18 o superior)
- npm

### Instalación

1. Clone el repositorio

   ```
   git clone <url-repositorio>
   cd leansim
   ```

2. Instale las dependencias

   ```
   npm install
   ```

3. Configure las variables de entorno

   ```
   cp .env.example .env.local
   ```

4. Inicie el servidor de desarrollo

   ```
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) en su navegador

## Comandos disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm test` - Ejecuta los tests

## Documentación

Para más información, consulte la carpeta `docs/`:

- Documentación técnica: `docs/technical/`
- Documentación de desarrollo: `docs/dev/`
- Documentación de negocio: `docs/business/`

## Licencia

[MIT](LICENSE)
