# GYE-TECH

## Tecnologías Utilizadas

- Next.js (Frontend SSR)
- React.js (Frontend)
- Zustand (State Management)
- Prisma (ORM)
- PostgreSQL (Base de datos)
- Cloudinary (Almacenamiento de imágenes)
- Mercado Pago (Pagos online)
- Google Cloud Platform (GCP)
- Google Maps API
- Nodemailer (Envío de mails)

---

## Configuración de Servicios Externos

### 1. Cloudinary
1. Crear una cuenta en https://cloudinary.com/
2. Ir a Dashboard y copiar `CLOUD_NAME`, `API_KEY` y `API_SECRET`.
3. Agregar estas variables a tu archivo `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

### 2. Mercado Pago
1. Crear una cuenta en https://www.mercadopago.com/
2. Ir a "Tus aplicaciones" y crear una nueva.
3. Copiar las credenciales `PUBLIC_KEY` y `ACCESS_TOKEN`.
4. Agregar al `.env`:
   ```env
   MP_PUBLIC_KEY=tu_public_key
   MP_ACCESS_TOKEN=tu_access_token
   ```

### 3. Google Cloud Platform (GCP)
1. Crear una cuenta en https://console.cloud.google.com/
2. Crear un nuevo proyecto.
3. Habilitar las APIs necesarias (por ejemplo, Google Maps, Gmail, etc).
4. Crear credenciales (API Key, OAuth, etc) según el servicio.
5. Descargar el archivo JSON de credenciales si aplica y agregar la ruta/variables al `.env`.

### 4. Habilitar API Key de Google Maps
1. En GCP, ir a "APIs y servicios" > "Credenciales".
2. Crear una nueva API Key.
3. Restringir el uso de la API Key según corresponda.
4. Agregar al `.env`:
   ```env
   GOOGLE_MAPS_API_KEY=tu_api_key
   ```

### 5. Envío de Mails (Nodemailer / Gmail)
1. Crear una cuenta de Gmail o usar una existente.
2. Habilitar "Acceso de apps menos seguras" o crear una contraseña de aplicación (recomendado).
3. Agregar al `.env`:
   ```env
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_contraseña_o_app_password
   ```

---

## Scripts para correr el proyecto

### Modo Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo (Next.js)
npm run dev
```

### Modo Producción

```bash
# Construir la aplicación
npm run build

# Iniciar en modo producción
npm start
```

Asegúrate de tener configuradas las variables de entorno antes de iniciar el proyecto.

---

## Sincronizar la base de datos y correr en modo desarrollo

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Realiza la migración de la base de datos con Prisma:
   ```bash
   npx prisma migrate dev
   ```

3. (Opcional) Genera el cliente de Prisma si hiciste cambios en el esquema:
   ```bash
   npx prisma generate
   ```

4. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```

---

