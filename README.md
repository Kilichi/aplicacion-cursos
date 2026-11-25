# Academia - Gestor de Cursos (Proyecto Parte I)

API REST con el patrón **MVC** usando **Node.js + Express + EJS + MongoDB (Mongoose)**.
Permite gestionar **cursos**, **usuarios** (administradores, profesores y alumnos) y las **matrículas** de los usuarios en los cursos.

## 🚀 Puesta en marcha

Requisitos: Node.js y **MongoDB en local** (`mongod` escuchando en `127.0.0.1:27017`).

```bash
npm install
cp example.env .env       # PUERTO=3010 y MONGODB_URI=mongodb://127.0.0.1:27017/academia_cursos
npm run seed              # crea la BBDD academia_cursos con sus 3 colecciones y datos de ejemplo
npm run dev               # http://localhost:3010
```

## 🗂️ Estructura

```
├── models/        course.model.js, user.model.js, enrollment.model.js
├── services/      lógica de BBDD (Mongoose) de cada modelo
├── controllers/   reciben req, llaman al service y hacen res.render / res.redirect
├── routes/        /cursos, /usuarios, /matriculas
├── views/         courses/, users/, enrollments/, partials/, index.ejs, error.ejs
├── seeds/         course.seed.js, user.seed.js, enrollment.seed.js, index.js
├── utils/         mongodb.config.js (conexión), formatos.js (fechas y errores)
├── public/        styles.css
├── .env           variables de entorno (no se sube, ver example.env)
└── index.js       servidor Express
```

## 🔗 Rutas

| Método | Ruta | Acción |
|--------|------|--------|
| GET | `/cursos` · `/usuarios` · `/matriculas` | Listado |
| GET | `/cursos/new` · `/usuarios/new` · `/matriculas/new` | Formulario de alta |
| POST | `/cursos` · `/usuarios` · `/matriculas` | Crear |
| GET | `/cursos/:id` · `/usuarios/:id` | Detalle |
| GET | `/cursos/:id/edit` · `/usuarios/:id/edit` · `/matriculas/:id/edit` | Formulario de edición |
| PATCH | `/cursos/:id` · `/usuarios/:id` · `/matriculas/:id` | Actualizar (`?_method=PATCH`) |
| DELETE | `/cursos/:id` · `/usuarios/:id` · `/matriculas/:id` | Eliminar (`?_method=DELETE`) |
| GET | `/usuarios/buscar?dni=12345678Z` | Usuario en JSON |

## 📏 Reglas de negocio

- **Restricción 1:N**: un curso puede tener muchos usuarios, pero un usuario sólo puede tener **una matrícula activa** (pendiente o confirmada) a la vez. Se controla en `enrollment.service.js` y con un índice único parcial en `enrollment.model.js`. Las matrículas canceladas no cuentan.
- Las vistas de matrículas usan **populate** para mostrar nombre, apellidos, DNI y título del curso en lugar de los IDs.
- El **DNI** es único y debe tener 8 números y una letra.
- La fecha de fin de un curso debe ser posterior a la de inicio.
- No se puede borrar un curso o un usuario que tenga matrículas.

---

# Informe de trabajo en equipo con Git y GitHub

## 🧑‍🤝‍🧑 Integrantes del grupo

| Nombre completo     | Usuario GitHub | Rol asumido en el grupo |
|---------------------|----------------|-------------------------|
| Jose Poveda         | Kilichi        | Coordinador del repositorio, módulo Usuarios y Seeds |
| Ibai Hernandez Ruiz | IbaiHdez       | Estructura base, estilos y módulo Cursos |
| Alejandro Sanchiz   | Rotver         | Módulo Matrículas (populate y restricción 1:N) y README |

---

## 🔀 Ramas utilizadas

- `main`: rama principal (versión entregada)
- `develop`: rama de integración
- `feature/courses-ibai`: base del proyecto + Cursos (Ibai)
- `feature/users-jose`: Usuarios + Seeds (Jose)
- `feature/enrollments-alejandro`: Matrículas + README (Alejandro)

---

## 📌 Estrategia de trabajo con Git

- Jose creó la estructura base vacía y las issues (#1 a #15) con el reparto de tareas.
- Cada miembro trabajó en su propia rama `feature/...` y la integraba en `develop` con `merge --no-ff` cuando su parte funcionaba.
- Antes de seguir trabajando, cada uno actualizaba su rama con `git merge develop` (por ejemplo, Matrículas necesitaba los services de Cursos y Usuarios).
- Los commits cierran las issues con `Closes #N`.
- Cuando todo funcionó en `develop`, se hizo el merge final a `main`.
- El flujo está documentado en [docs/FLUJO_GIT.md](docs/FLUJO_GIT.md).

---

## 📊 Estadísticas de participación (según Git)

Resultado de `git shortlog --summary --numbered --all`:

```
     6	Jose Poveda
     5	Rotver
     4	Ibai Hernandez Ruiz
```

> Estadísticas antes de aceptar los Pull Requests. Se actualizarán tras el merge final a `main`.

---

## ✅ Tareas realizadas por cada miembro

- **Jose Poveda**:
  - Creó el repositorio, la estructura base vacía, el `.env`/`example.env` y las issues.
  - Modelo, service, controller, rutas y vistas de **Usuarios** (DNI único, perfiles).
  - **Seeds** de cursos, usuarios y matrículas (`npm run seed`).
  - Documentó el flujo de Git y las plantillas de issues/PR. Merge final a `main`.

- **Ibai Hernandez Ruiz**:
  - `index.js`, conexión con MongoDB, menú de navegación, página de inicio, vista de error y `styles.css`.
  - Modelo, service, controller, rutas y vistas de **Cursos** (validación de fechas).
  - Manejo de errores de IDs con formato incorrecto.

- **Alejandro Sanchiz**:
  - Modelo de **Matrículas** con la restricción 1:N (índice único parcial).
  - Service con **populate** y comprobación de matrícula activa.
  - Controller, rutas y vistas de matrículas mostrando nombres en lugar de IDs.
  - Integridad referencial: no borrar cursos/usuarios con matrículas. README.

---

## 🧪 Testeo y pruebas

Probado a mano desde las vistas con MongoDB local, después de `npm run seed`:

- Cursos: listar, detalle, crear, editar y eliminar. Error si la fecha de fin es anterior a la de inicio.
- Usuarios: listar, detalle, crear, editar y eliminar. Error si el DNI está repetido, el email es incorrecto o la fecha de nacimiento es futura.
- Matrículas: listar (con populate), crear, editar y eliminar. Error al matricular a un usuario que ya tiene una matrícula activa; se permite si la nueva está cancelada.
- No se puede borrar un curso o usuario con matrículas.
- Rutas inexistentes muestran 404 y los IDs mal formados muestran un error 400.
- No se han usado tests automatizados en esta fase.

---

## 🧠 Lecciones aprendidas

- Trabajar con ramas `feature/*` + `develop` + `main` evita pisarse el trabajo.
- Hay que integrar pronto en `develop` lo que otros necesitan (los services de cursos y usuarios para las matrículas).
- `populate` de Mongoose permite mostrar los datos reales de las referencias en lugar de los ObjectId.
- Las restricciones de datos se pueden poner en el modelo (índices únicos) y además comprobarlas en el service para dar mensajes claros.
- `runValidators: true` es necesario para que `findByIdAndUpdate` valide los datos.

---

## 📅 Fechas clave

- Inicio del proyecto (reparto e issues): 19/11/2026
- Estructura base en el repositorio: 23/11/2026
- Primer merge a develop: 25/11/2026
- Finalización (merge a main): 25/11/2026
