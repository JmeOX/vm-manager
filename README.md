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

El archivo [`apps/api/requests.http`](apps/api/requests.http) contiene las peticiones listas para ejecutar con la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) de VS Code.

> **Nota:** la cookie de sesión es `Secure`. Los navegadores aceptan cookies `Secure` en `http://localhost`, pero REST Client no las reenvía por HTTP. Por eso en `requests.http` la cookie del login se envía manualmente con `Cookie: {{login.response.headers.Set-Cookie}}`.

### Endpoints

| Método y ruta | Acceso | Respuesta |
| --- | --- | --- |
| `GET /api/health` | Público | `200 { status }` |
| `POST /api/auth/login` | Público | `200 { user }` + cookie HttpOnly |
| `GET /api/auth/me` | Autenticado | `200 { user }` |
| `POST /api/auth/logout` | Público | `204` + cookie eliminada |

*(pendiente: endpoints de VMs)*

---

## Arquitectura

*(pendiente: diagrama de componentes y de secuencia)*

### Estructura del monorepo

```
vm-manager/
├─ apps/
│  ├─ api/            # API REST (Express 5 + Prisma + SQLite)
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
| Capas `routes → controller → service` | Lógica en las rutas | El service no conoce HTTP; se puede probar y reutilizar (p. ej. desde Socket.io) |

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

*(pendiente: helmet, CORS, rate limit, autorización por rol, autenticación del socket)*

---

## Testing

*(pendiente)*

---

## Limitaciones y siguientes pasos

- **Logout con JWT stateless:** el logout elimina la cookie del navegador, pero el token sigue siendo válido hasta su expiración (8 h), porque el servidor no guarda sesiones. Mitigaciones posibles: expiración corta con *refresh tokens*, o una lista de tokens revocados (Redis / BD).

---

## Bitácora de IA

### Herramientas utilizadas

*(pendiente)*

### Qué delegué y dónde intervine

*(pendiente)*

### Prompts clave

*(pendiente)*
