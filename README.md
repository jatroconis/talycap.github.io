# Movies & Weather — Angular (v20)
Proyecto de prueba técnica para talycap, componentes standalone y “zoneless” (sin Zone.js). Dos datasets sin llaves de API: películas con TVMaze y clima con Open-Meteo.

---

## ¿Qué hace?

- **Home** con dos pestañas:
  - **Películas**: tabla con póster, título, estreno y rating.
    - Búsqueda por nombre (botón “Buscar” o Enter).
  - **Clima**: tabla con ciudades preconfiguradas, temperatura y estado del tiempo (íconos de Material, sin imágenes externas).

- **UI** con Angular Material
  - Paginador en español.
  - En móviles se oculta la columna de póster para que todo se lea mejor.

---

## Requisitos

- Node LTS 18+ (recomendado 20+).
- npm 9+.
- Angular CLI (se instala al crear el proyecto).

---

## Instalación

```bash
# Clonar
git clone <repo>
cd <carpeta-del-proyecto>

# Instalar dependencias
pnpm install
```

No hay que configurar llaves. Las URLs base de TVMaze y Open-Meteo están en `src/environments/*`.

---

## Ejecutar en desarrollo

```bash
npm start
# abre http://localhost:4200
```

---

## Ejecutar con DOCKER 

```bash
docker build -t talycap:prod .
docker run --rm -p 8080:80 talycap:prod
# abre http://localhost:8080
```

---

## Estructura (resumen)

```
src/
  app/
    app.config.ts          # providers (router, http, paginator en ES, interceptores de error)
    app.routes.ts          # rutas con loadComponent
    app.ts.*            # laysout con toolbar y <router-outlet>
    core/
      constants/cities.ts  # ciudades por defecto 
      i18n/paginator.intl.ts
      interceptors/error.interceptor.ts
      models/
        pagination.model.ts
        tvmaze.model.ts
        weather.model.ts
      services/
        movies.service.ts  # TVMaze
        weather.service.ts # Open-Meteo
    features/
      movies/movies-table.component.*
      weather/weather-table.component.*
    pages/
      home/home.page.*
  environments/
    environment.ts
    environment.prod.ts
  styles.scss
```

---

## Scripts 

```bash
npm start         # ng serve
npm run build     # ng build
npm test          # aqui se hizo algunos test unitarios 
```

---

## Testing

Los tests están preparados para el estilo standalone.

Ejecutar:

```bash
ng test
```
---



## Autor y contacto

Proyecto preparado para una prueba técnica.
Juan Troconis
jatroconis4@gmail.com
3105249121