# AGENTS.md — Reglas para asistentes de IA en este repositorio

Este archivo define cómo debe trabajar cualquier asistente de IA (Claude, Copilot, Cursor…) en el proyecto. Resume las decisiones de arquitectura para que el código generado sea coherente con el existente.

## Contexto

- Monorepo con **npm workspaces**: `apps/api` (Express 5 + Prisma + SQLite), `apps/web` (React + Vite + Tailwind v4 + shadcn/ui) y `packages/shared` (esquemas Zod, tipos y eventos de socket).
- TypeScript estricto en todo el repo. En `apps/web` rige `erasableSyntaxOnly`: no usar `enum` ni *parameter properties*.
- Idioma: código e identificadores en inglés; textos de la UI, mensajes de error y documentación en español.

## Reglas generales

1. **Pasos pequeños y verificables.** Cada cambio debe poder comprobarse (test, petición `.http`, DevTools) antes del siguiente.
2. **No agregar dependencias sin justificarlas** (qué problema resuelven y por qué no basta lo existente). **No quitar dependencias sin verificar** su origen y quién las usa.
3. **No sobreingeniería:** cada pieza debe nombrar el problema concreto que evita. Si es un extra, decirlo.
4. **No tocar archivos fuera del alcance pedido.** Los componentes de `apps/web/src/components/ui/` son generados por shadcn: solo se adaptan cuando hace falta.
5. Commits en formato **Conventional Commits** (`feat(api): …`, `feat(web): …`, `test: …`, `docs: …`, `ci: …`).

## Contrato compartido (`packages/shared`)

- Toda regla de validación de datos vive en un **esquema Zod** de `shared` y la usan **tanto la API como los formularios**. Nunca duplicar una regla en un solo lado.
- Los tipos se **derivan** de los esquemas (`z.infer`); no se escriben a mano.
- Los eventos de Socket.io se declaran en `ServerToClientEvents` / `ClientToServerEvents`.
- Las etiquetas de presentación ("Ubuntu 24.04 LTS", "Encendida") viven en el front (`vm-labels.ts`), no en `shared`.

## API (`apps/api`)

- Capas: `routes → controller → service → repository`. El **service** no conoce `req`/`res` ni Prisma; el **repository** es el único que usa Prisma.
- Orden de middlewares en rutas protegidas: `authenticate → authorize(rol) → validateParams/validateBody → controller`.
- Errores: lanzar `HttpError(status, code, message, details?)`; el `errorHandler` produce `{ error: { code, message, details? } }`. Nunca `try/catch` en controllers (Express 5 captura los errores de funciones `async`).
- **Seguridad — no negociable:**
  - El JWT viaja **solo** en la cookie `vm_session` (`HttpOnly`, `Secure`, `SameSite=Strict`). **Nunca** devolverlo en el body ni aceptarlo por header.
  - Toda la lógica del token está en `lib/session.ts` (REST y socket usan las mismas funciones).
  - La autorización por rol se aplica siempre en el backend; ocultar botones en el front es solo UX.
  - Nunca devolver `passwordHash`. Mensajes de login genéricos.
  - Variables de entorno solo a través de `config/env.ts` (validado con Zod), nunca `process.env` directo.
- Tiempo real: los eventos se emiten desde el **service**, **después** de confirmar en la base.
- Todo endpoint nuevo lleva test en `apps/api/tests` y petición en `apps/api/http/`.

## Frontend (`apps/web`)

- Organización **por feature** (`features/<nombre>/`): `*.api.ts` (fetch puro, sin React) → `*.queries.ts` / `*.mutations.ts` / `use-*.ts` (hooks) → componentes.
- **Clasificación del estado (obligatoria):**
  - Datos de la API → **TanStack Query** (nunca en Zustand ni Context).
  - Estado global del cliente → **Zustand**, solo si se comparte entre componentes lejanos o se lee fuera de React.
  - Filtros y búsqueda → **URL** (`useSearchParams`), validando los valores.
  - Formularios → **React Hook Form** + `zodResolver` con esquemas de `shared`.
  - Lo que se puede calcular a partir de otro estado **no se guarda** (`useMemo`).
- **Una sola fuente de verdad para las VMs:** la clave `vmKeys.all`. Mutaciones optimistas y eventos del socket escriben ahí.
- **Mutaciones:** siempre con el patrón optimista completo (`cancelQueries` → foto → `setQueryData` → rollback en `onError` + toast → `invalidateQueries` en `onSettled`).
- **Permisos en la UI:** `<Can role>` para elementos (no se renderizan, no basta `disabled`) y `<RequireRole>` para rutas.
- Cliente HTTP: solo `lib/http.ts` (`credentials: 'include'`, sin header `Authorization`).
- Estilos: tokens del tema (`bg-card`, `text-muted-foreground`, `text-success`, `ring-highlight`…); nunca colores fijos que rompan el modo oscuro.
- Accesibilidad: elementos nativos (`button`, `a`, `input` + `label`), `aria-label` en botones de solo ícono, `aria-invalid`/`aria-describedby` en campos, animaciones con `motion-safe:`.
- Toda pantalla contempla sus estados: cargando (skeleton con la forma real), vacío, error con reintento.

## Cómo pedir trabajo a la IA (plantilla)

> **Contexto:** dónde va el cambio y qué existe ya.
> **Decisión:** qué hacer y con qué patrón del proyecto.
> **Restricciones:** qué no tocar, qué no agregar.
> **Criterio de aceptación:** cómo se comprueba (test, petición, comportamiento visible).

Ejemplo:

> "En `apps/api/src/realtime/socket.ts` crea el servidor Socket.io. Autentica el handshake leyendo la cookie `vm_session` con `verifySessionToken` de `lib/session.ts` y rechaza conexiones sin sesión. Expón funciones para que `vms.service.ts` emita **después** de guardar en la base. Tipa los eventos en `packages/shared`. No modifiques otros archivos. Criterio de aceptación: un cliente sin cookie recibe `connect_error`."
