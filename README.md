# Front_ET - Product Management Frontend

Frontend estático desarrollado en Java y desplegado mediante contenedores Docker sobre AWS ECS Fargate.

## Tecnologías

* Java 17
* Maven
* Docker
* Nginx Alpine
* Amazon ECR
* Amazon ECS Fargate
* GitHub Actions

## Arquitectura

El frontend consume dos microservicios:

* Backend Node.js (Usuarios)
* Backend Python Flask (Productos)

La comunicación se realiza mediante peticiones HTTP REST.

## Generación del Frontend

Compilar y generar archivos estáticos:

```bash
mvn clean compile
mvn exec:java
```

Los archivos se generan en:

```text
output/
├── index.html
├── styles.css
└── script.js
```

## Docker

Construcción local:

```bash
docker build -t front-et .
```

Ejecución local:

```bash
docker run -p 80:80 front-et
```

## CI/CD

El proyecto incorpora GitHub Actions para:

1. Compilar proyecto Java.
2. Generar archivos estáticos.
3. Construir imagen Docker.
4. Publicar imagen en Amazon ECR.

Workflow:

```text
.github/workflows/deploy.yml
```

## AWS

Servicios utilizados:

* Amazon ECR
* Amazon ECS Fargate
* CloudWatch Logs
* IAM

## Variables de Entorno

Las credenciales AWS son administradas mediante GitHub Secrets:

* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_SESSION_TOKEN
* AWS_REGION
* AWS_ACCOUNT_ID

## Evidencia DevOps

Cada push a la rama main ejecuta automáticamente el pipeline CI/CD y publica una nueva versión de la imagen Docker en Amazon ECR.

## Docker Compose

Para facilitar el desarrollo local se implementó Docker Compose, permitiendo levantar todos los componentes del sistema mediante un único comando.

### Servicios incluidos

* Frontend
* Backend Node.js (Usuarios)
* Backend Python (Productos)
* MariaDB

### Levantar entorno completo

```bash
docker compose up -d
```

### Ver contenedores

```bash
docker ps
```

### Detener entorno

```bash
docker compose down
```

### Arquitectura local

Frontend (Puerto 80)
↓
Backend Node.js (Puerto 8081)
↓
MariaDB

Frontend (Puerto 80)
↓
Backend Python (Puerto 8082)
↓
MariaDB

Docker Compose permite replicar localmente la arquitectura utilizada posteriormente en AWS ECS Fargate.
