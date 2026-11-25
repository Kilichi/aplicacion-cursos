# Flujo de trabajo con Git

## Ramas

| Rama | Uso |
|------|-----|
| `main` | Versión estable que se entrega. Sólo recibe merges desde `develop`. |
| `develop` | Integración: aquí se juntan las ramas `feature/*` cuando funcionan. |
| `feature/courses-ibai` | Base del proyecto + módulo Cursos (Ibai). |
| `feature/users-jose` | Módulo Usuarios + Seeds (Jose). |
| `feature/enrollments-alejandro` | Módulo Matrículas + README (Alejandro). |

## Pasos para trabajar en una tarea

```bash
# 1. Ponerse al día con develop
git checkout develop
git pull origin develop

# 2. Pasar a tu rama y traer lo último de develop
git checkout feature/<tu-rama>
git merge develop

# 3. Programar, probar y hacer commits pequeños
git add <ficheros>
git commit -m "feat(modulo): descripción corta"

# 4. Subir la rama y abrir un Pull Request contra develop
git push origin feature/<tu-rama>
```

## Mensajes de commit

Formato: `tipo(módulo): descripción en presente`

- `feat` → funcionalidad nueva
- `fix` → corrección de un error
- `docs` → documentación
- `chore` → configuración, dependencias...

Para cerrar una issue desde el commit o el PR: `Closes #N`.

## Antes de hacer merge a develop

- [ ] `npm run seed` funciona.
- [ ] `npm run dev` arranca sin errores y conecta con MongoDB.
- [ ] Se han probado Listar / Crear / Editar / Eliminar desde las vistas.
- [ ] El código está comentado.

## Base de datos

Usamos **MongoDB local** (`mongodb://127.0.0.1:27017/academia_cursos`).
Copia `example.env` a `.env` (el `.env` no se sube a GitHub).
