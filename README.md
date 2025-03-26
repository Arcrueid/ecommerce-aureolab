# Aureolab Store

Monorepo Aureolab Store, construido con turborepo, pnpm y typescript.

## Estructura del Proyecto

```
ecommerce-aureolab/
├── apps/
│   ├── api/       # Backend API
│   └── web/       # Frontend web
├── packages/
│   ├── database/  # Módulo compartido de base de datos
│   └── eslint-config/ # Configuraciones compartidas de ESLint
```

## Requisitos previos

- Node.js (versión recomendada: >= 20)
- pnpm (versión 10.6.5 o compatible)
- PostgreSQL

## Instalación

1. Instala las dependencias

```bash
pnpm install
```

2. Configura las variables de entorno

```bash
cp .env.example .env
# Edita el archivo .env con tus configuraciones
```

3. Inicializa la base de datos

```bash
pnpm db:init
```

## Comandos principales

| Comando      | Descripción                                   |
| ------------ | --------------------------------------------- |
| `pnpm dev`   | Inicia todos los proyectos en modo desarrollo |
| `pnpm build` | Compila todos los proyectos                   |
| `pnpm start` | Inicia todos los proyectos en modo producción |
| `pnpm lint`  | Ejecuta el linter en todos los proyectos      |
| `pnpm test`  | Ejecuta los tests en todos los proyectos      |

## Comandos de base de datos

| Comando            | Descripción                                             |
| ------------------ | ------------------------------------------------------- |
| `pnpm db:check`    | Verifica el esquema de la base de datos                 |
| `pnpm db:generate` | Genera el cliente Prisma                                |
| `pnpm db:migrate`  | Ejecuta las migraciones pendientes                      |
| `pnpm db:seed`     | Puebla la base de datos con datos iniciales             |
| `pnpm db:init`     | Inicializa la base de datos (generate + migrate + seed) |

## Desarrollo

### Todo el proyecto

```bash
pnpm dev
```

### API (Backend)

```bash
# Inicia solo el backend en modo desarrollo
cd apps/api && pnpm dev

# O desde la raíz
pnpm --filter api dev
```

### Web (Frontend)

```bash
# Inicia solo el frontend en modo desarrollo
cd apps/web && pnpm dev

# O desde la raíz
pnpm --filter web dev
```

## Despliegue

1. Construye todas las aplicaciones:

```bash
pnpm build
```

2. Inicia en modo producción:

```bash
pnpm start
```

## Características principales

- **Monorepo**: Gestión centralizada con Turborepo y pnpm workspace
- **API**: Backend construido con Node.js y TypeScript
- **Web**: Frontend construido con tecnologías web modernas
- **Database**: Módulo compartido para gestión de base de datos
