# Despliegue - Chapitos Membresías Demo

Este proyecto está configurado para funcionar **sin backend**, usando datos mock locales. Ideal para demostraciones públicas.

## Requisitos

- Docker
- Docker Compose

## Métodos de Despliegue

### Opción 1: Docker Compose (Recomendado)

#### Pasos:

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Construir y ejecutar los contenedores:**
   ```bash
   docker-compose up -d --build
   ```

3. **Verificar que los servicios estén运行:**
   ```bash
   docker-compose ps
   ```

4. **Ver los logs:**
   ```bash
   docker-compose logs -f
   ```

#### Puertos expuestos:

| Servicio | Puerto | URL |
|----------|--------|-----|
| Nginx | 80 | http://localhost |
| Next.js (directo) | 3000 | http://localhost:3000 |

---

### Opción 2: Solo Next.js (Sin Nginx)

Si solo necesitas la aplicación sin el proxy:

```bash
cd frontend

# Construir la imagen
docker build -t chapitos-demo .

# Ejecutar el contenedor
docker run -d -p 3000:3000 --name chapitos-demo chapitos-demo
```

---

### Opción 3: Docker con API Externa

Si deseas conectar a un backend real:

```bash
cd frontend

# Establecer la URL de la API
export NEXT_PUBLIC_API_URL=http://tu-api:8080

# Construir y ejecutar
docker-compose build --build-arg NEXT_PUBLIC_API_URL=http://tu-api:8080
docker-compose up -d
```

---

## Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL del backend | (vacío - modo demo) |

### Modo Demo

El modo demo está **habilitado por defecto**:
- Los datos son locales (mock)
- Todas las operaciones de escritura muestran "Función deshabilitada en modo demo"
- Login acepta cualquier credencial

Para **deshabilitar el modo demo**, edita `src/lib/demo.ts`:

```typescript
export const IS_DEMO_MODE = false
```

Luego reconstruye la imagen:
```bash
docker-compose build --no-cache
docker-compose up -d
```

---

## Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir sin caché
docker-compose build --no-cache
docker-compose up -d
```

---

## Estructura de Archivos

```
frontend/
├── Dockerfile              # Imagen de Next.js
├── docker-compose.yml      # Orquestación de servicios
├── nginx.conf             # Configuración de Nginx
├── .dockerignore          # Archivos ignorados en build
├── src/
│   ├── lib/
│   │   └── demo.ts        # Configuración de modo demo
│   └── ...
└── ...
```

---

## Producción

Para un despliegue en producción real:

1. **Cambiar el puerto** en `docker-compose.yml` si es necesario
2. **Configurar SSL/TLS** en `nginx.conf` (agregar certificados)
3. **Ajustar recursos** de los contenedores según necesidades
4. **Configurar dominio** en el archivo nginx

### Ejemplo con SSL (Let's Encrypt):

```bash
# Obtener certificado
certbot certonly --nginx -d tudominio.com

# Actualizar nginx.conf con los certificados
```

---

## Solución de Problemas

### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs app

# Verificar puertos ocupados
netstat -tulpn | grep 3000
```

### Error de memoria en build

```bash
# Aumentar memoria para Docker
# En Docker Desktop: Settings > Resources > Memory
```

### La página no carga

```bash
# Verificar que el contenedor esté ejecutándose
docker ps

# Reiniciar el servicio
docker-compose restart app
```

---

## Información Adicional

- **Puerto HTTP:** 80
- **Puerto Next.js directo:** 3000
- **Stack:** Next.js 14, React, TypeScript, Tailwind CSS
- **Modo:** Demo (sin backend requerido)
