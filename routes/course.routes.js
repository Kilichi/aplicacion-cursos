const courseController = require("../controllers/course.controller")
const express = require("express")
const router = express.Router()

//Todas estas rutas cuelgan de /cursos (ver index.js)

//Mostrar VISTA EJS courses/index.ejs con el listado de cursos
router.get("/", courseController.findAllCourses)

//Mostrar vista EJS courses/new.ejs para crear un curso
router.get("/new", courseController.showNewCourse)

//POST - Crear curso
router.post("/", courseController.createCourse)

//Mostrar vista EJS courses/edit.ejs para editar un curso
router.get("/:id/edit", courseController.showEditCourse)

//IMPORTANTE!!! GET dinámico (con parámetros) al final siempre
//Mostrar VISTA EJS courses/show.ejs con los detalles de un curso
router.get("/:id", courseController.findCourseById)

//PATCH - Actualizar un curso
router.patch("/:id", courseController.editCourse)

//DELETE - Borrar un curso
router.delete("/:id", courseController.deleteCourse)

//Exportar rutas
module.exports = router
