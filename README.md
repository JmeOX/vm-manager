# VM Manager — Prueba Técnica Full Stack (IFX)

SPA para gestionar máquinas virtuales con roles (Administrador / Cliente), Optimistic UI y actualizaciones en tiempo real, más una API REST de soporte con autenticación por cookie HttpOnly.

> 🚧 En construcción. Las secciones marcadas como *(pendiente)* se completan al final.

---

## Características

*(pendiente: checklist de requisitos del enunciado, en el mismo orden del PDF)*

---

## Inicio rápido

### Requisitos

- Node.js 20 o superior (incluye npm 10)
- Git

### Pasos

```bash
# 1. Instalar dependencias de todo el monorepo
npm install

# 2. Crear el archivo de variables de entorno de la API
cp apps/api/.env.example apps/api/.env
#    (en Windows PowerShell: Copy-Item apps/api/.env.example apps/api/.env)
#    y reemplazar JWT_SECRET por un texto aleatorio de 32+ caracteres:
#    node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
#    SIMULATED_LATENCY_MS (opcional) agrega un retraso artificial en /api/vms para ver la Optimistic UI; 0 lo desactiva

# 3. Crear la base de datos SQLite, aplicar migraciones y cargar datos de prueba
npm run db:setup -w apps/api

# 4. Levantar la API
npm run dev -w apps/api
```

*(pendiente: levantar front y back con un solo comando)*

---

## Credenciales de prueba

Creadas por el seed (`apps/api/prisma/seed.ts`):

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@ifx.test` | `Admin123!` |
| Cliente | `cliente@ifx.test` | `Cliente123!` |

---

## Probar la API

La carpeta [`apps/api/http/`](apps/api/http/) contiene colecciones de peticiones listas para ejecutar con la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) de VS Code, una por módulo:

- [`auth.http`](apps/api/http/auth.http): health, login (éxito, credenciales inválidas, validación), sesión, logout y CORS.
- [`vms.http`](apps/api/http/vms.http): CRUD de VMs y permisos por rol (`200`, `201`, `204`, `400`, `403`, `404`, `409`).

Cada archivo incluye su propio login, porque REST Client no comparte variables entre archivos.

> **Nota:** la cookie de sesión es `Secure`. Los navegadores aceptan cookies `Secure` en `http://localhost`, pero REST Client no las reenvía por HTTP. Por eso en `requests.http` la cookie del login se envía manualmente con `Cookie: {{login.response.headers.Set-Cookie}}`.

### Endpoints

| Método y ruta | Acceso | Respuesta |
| --- | --- | --- |
| `GET /api/health` | Público | `200 { status }` |
| `POST /api/auth/login` | Público | `200 { user }` + cookie HttpOnly · `400` · `401` · `429` |
| `GET /api/auth/me` | Autenticado | `200 { user }` · `401` |
| `POST /api/auth/logout` | Público | `204` + cookie eliminada |
| `GET /api/vms` | Admin, Cliente | `200 Vm[]` · `401` |
| `POST /api/vms` | Admin | `201 Vm` · `400` · `401` · `403` · `409` nombre duplicado |
| `PUT /api/vms/:id` | Admin | `200 Vm` · `400` · `401` · `403` · `404` · `409` |
| `DELETE /api/vms/:id` | Admin | `204` · `400` · `401` · `403` · `404` |

### Eventos en tiempo real (Socket.io)

El servidor de sockets comparte puerto con la API (`http://localhost:4000`, ruta `/socket.io`). Solo acepta conexiones con una cookie de sesión válida.

| Evento (servidor → clientes) | Payload | Se emite cuando |
| --- | --- | --- |
| `vm:created` | `Vm` | Se crea una VM (después de guardarla en la base) |
| `vm:updated` | `Vm` | Se actualiza una VM (después de guardarla) |
| `vm:deleted` | `{ id }` | Se elimina una VM (después de borrarla) |

Los eventos están tipados en [`packages/shared/src/socket-events.ts`](packages/shared/src/socket-events.ts) y los usan tanto el servidor como el cliente.

### Probar el tiempo real sin frontend

```bash
# Terminal 1
npm run dev -w apps/api

# Terminal 2: inicia sesión como Cliente, abre el socket e imprime cada evento recibido
npm run socket:probe -w apps/api

# Sin cookie, la conexión se rechaza (UNAUTHENTICATED)
npm run socket:probe -w apps/api -- --sin-cookie
```

Con la sonda abierta, ejecuta las peticiones de [`vms.http`](apps/api/http/vms.http) (crear, encender, eliminar): cada cambio aparece al instante en la terminal 2. Una petición que falla (p. ej. `409`) no emite evento.

### Modo demostración (solo en desarrollo)

Para que la Optimistic UI y su rollback se puedan ver en local, las rutas `/api/vms` pasan por el middleware [`devSimulation`](apps/api/src/middleware/dev-simulation.ts), activo **solo** con `NODE_ENV=development`:

- **Latencia:** cada petición espera `SIMULATED_LATENCY_MS` (por defecto 800 ms en `.env.example`).
- **Fallo a pedido:** una petición de escritura con el header `x-simulate-failure: 1` responde `503 SIMULATED_FAILURE` sin modificar la base.

Todos los errores siguen el formato `{ "error": { "code", "message", "details"? } }`. En errores de validación, `details` es una lista `[{ "field", "message" }]` que el frontend muestra bajo cada campo.

---

## Arquitectura

*(pendiente: diagrama de componentes y de secuencia)*

### Estructura del monorepo

```
vm-manager/
├─ apps/
│  ├─ api/            # API REST (Express 5 + Prisma + SQLite)
│  │  ├─ http/        # Colecciones de peticiones (REST Client)
│  │  ├─ prisma/      # schema.prisma, migraciones y seed
│  │  ├─ scripts/     # socket-probe.ts: prueba el tiempo real desde la terminal
│  │  └─ src/
│  │     ├─ config/       # Variables de entorno validadas
│  │     ├─ lib/          # Prisma client, HttpError, sesión (JWT + cookie)
│  │     ├─ middleware/   # authenticate, authorize, validate, rate-limit, devSimulation, errorHandler
│  │     ├─ modules/
│  │     │  ├─ auth/      # routes → controller → service
│  │     │  └─ vms/       # routes → controller → service → repository
│  │     ├─ realtime/     # Servidor Socket.io: autenticación del handshake y emisión de eventos
│  │     ├─ app.ts        # Construye la app de Express (sin abrir puerto; usada por los tests)
│  │     └─ server.ts     # Crea el servidor HTTP, monta Socket.io y abre el puerto
│  └─ web/            # SPA (React + Vite)  (pendiente)
└─ packages/
   └─ shared/         # Esquemas Zod y tipos compartidos entre front y back
```

*(pendiente: estructura de carpetas del frontend explicada)*

---

## Decisiones arquitectónicas

| Decisión | Alternativa descartada | Motivo |
| --- | --- | --- |
| Monorepo con npm workspaces | Repos separados | Las reglas de validación y los tipos (`packages/shared`) se escriben una vez y los usan front y back; un solo `npm install` para revisar |
| Esquemas Zod compartidos | Validar por separado en cada lado | El formulario y la API aplican exactamente las mismas reglas; los tipos TypeScript se derivan del esquema |
| Express 5 | Express 4 | Captura automática de errores en handlers `async`, sin `try/catch` repetidos |
| Prisma 6 + SQLite | PostgreSQL | Cero instalación para el revisor. Migrar a PostgreSQL = cambiar `provider` y `DATABASE_URL` y regenerar migraciones; el código de la API no cambia |
| `role`, `os`, `status` como `String` en BD | Enums de BD | SQLite no tiene enums nativos; la integridad la garantizan los esquemas Zod antes de guardar |
| Variables de entorno validadas con Zod al arrancar | Leer `process.env` directo | *Fail-fast*: la API no arranca si falta o es inválida una variable (p. ej. `JWT_SECRET` corto) |
| Capas `routes → controller → service → repository` | Lógica en las rutas | Cada capa tiene una responsabilidad: rutas y middlewares / HTTP / reglas de negocio / acceso a datos. El service no conoce HTTP ni Prisma, así que se reutiliza (p. ej. para emitir eventos de Socket.io) y el ORM se puede cambiar tocando solo el repository |
| Orden de middlewares: `authenticate → authorize → validate → controller` | Validar antes de autorizar | Un Cliente recibe `403` sin importar el body enviado; no se revelan las reglas de validación a quien no tiene permiso |
| Errores de unicidad detectados por el código Prisma `P2002` | Consultar si el nombre existe antes de guardar | Evita condiciones de carrera entre dos creaciones simultáneas; se traduce a `409` con `details` en el campo `name` |
| `PUT /api/vms/:id` acepta actualizaciones parciales | `PATCH` | El enunciado define `PUT`; permitir campos parciales simplifica acciones como encender/apagar (`{ "status": "RUNNING" }`). Un body vacío se rechaza con `400` |
| Socket.io sobre el mismo servidor HTTP que Express (`createServer(app)`) | Un servicio de tiempo real aparte | Un solo puerto y un solo origen: la cookie de sesión viaja también en el handshake del socket, sin configuración extra |
| Eventos emitidos desde el service **después** de confirmar en la base | Emitir antes de guardar, o desde el controller | Si la base falla (p. ej. nombre duplicado), ningún cliente recibe un cambio que nunca existió. Al estar en el service, la emisión ocurre igual sin importar quién invoque la operación |
| Eventos de socket tipados en `packages/shared` | Nombres de evento como strings sueltos | Un error de tipeo en el nombre o en el payload no compila, ni en el servidor ni en el cliente |
| Middleware `devSimulation` (solo desarrollo): latencia configurable y fallo a pedido con `x-simulate-failure: 1` | Probar el rollback apagando la API | Hace visibles la Optimistic UI y el rollback en local, donde la API responde en milisegundos y nunca falla. No tiene efecto en producción ni en tests |
| Lógica del JWT centralizada en `lib/session.ts` | Firmar y verificar en cada lugar que lo necesite | Login, middleware y (más adelante) el socket usan las mismas funciones y opciones de cookie |

*(pendiente: decisiones del frontend)*

---

## Seguridad

- JWT firmado (HS256) enviado **solo** en cookie `HttpOnly`, `Secure`, `SameSite=Strict`. El body del login devuelve únicamente el usuario y su rol; el frontend nunca ve ni guarda el token.
- `GET /api/auth/me` permite al frontend recuperar la sesión al recargar, ya que no puede leer la cookie.
- Contraseñas almacenadas como hash con bcrypt (costo 10); nunca en texto plano.
- Mensaje de login genérico ("Credenciales inválidas") y comparación contra un hash ficticio cuando el email no existe, para no revelar qué cuentas existen.
- `jwt.verify` restringido al algoritmo `HS256`.
- Validación de todos los bodies en el servidor con Zod; errores con formato uniforme `{ error: { code, message, details? } }`.
- En producción, los errores 500 no exponen detalles internos.
- `.env` fuera del repositorio; `.env.example` documenta las variables.

- Autorización por rol en cada endpoint de escritura (`authorize('ADMIN')` → `403` para Cliente). Ocultar botones en el frontend es UX; la seguridad real está en el backend.
- `401` (sin sesión o sesión inválida) diferenciado de `403` (sesión válida sin permiso).
- `helmet` para cabeceras de seguridad (CSP, `nosniff`, frameguard) y para ocultar `X-Powered-By`.
- CORS restringido a `CLIENT_ORIGIN` con `credentials: true`; nunca `*`.
- Límite de 5 intentos fallidos de login por minuto por IP (`express-rate-limit`), con respuesta `429` en el formato de error estándar. Los logins exitosos no cuentan.
- Parámetros de URL validados (`:id` debe ser UUID) antes de consultar la base.
- Bodies JSON limitados a 10 KB.

- Socket.io autenticado: un middleware (`io.use`) lee la cookie `vm_session` del handshake y la verifica con la misma función que la API REST. Sin sesión válida, la conexión se rechaza y no se reciben datos de VMs.
- CORS del socket restringido a `CLIENT_ORIGIN`.

---

## Testing

*(pendiente)*

---

## Limitaciones y siguientes pasos

- **Rate limit en memoria:** el contador vive en el proceso; se reinicia al reiniciar la API y no se comparte entre varias instancias. En producción se usaría un store compartido (p. ej. Redis).
- **Logout con JWT stateless:** el logout elimina la cookie del navegador, pero el token sigue siendo válido hasta su expiración (8 h), porque el servidor no guarda sesiones. Mitigaciones posibles: expiración corta con *refresh tokens*, o una lista de tokens revocados (Redis / BD).

---

## Bitácora de IA

### Herramientas utilizadas

*(pendiente)*

### Qué delegué y dónde intervine

*(pendiente)*

### Prompts clave

*(pendiente)*
