const enrollmentController = require("../controllers/enrollment.controller")
const express = require("express")
const router = express.Router()

//Todas estas rutas cuelgan de /matriculas (ver index.js)

//Mostrar VISTA EJS enrollments/index.ejs con el listado de matrículas (con POPULATE)
router.get("/", enrollmentController.findAllEnrollments)

//Mostrar vista EJS enrollments/new.ejs para crear una matrícula
router.get("/new", enrollmentController.showNewEnrollment)

//POST - Crear matrícula
router.post("/", enrollmentController.createEnrollment)

//Mostrar vista EJS enrollments/edit.ejs para editar una matrícula
router.get("/:id/edit", enrollmentController.showEditEnrollment)

//PATCH - Actualizar una matrícula
router.patch("/:id", enrollmentController.editEnrollment)

//DELETE - Borrar una matrícula
router.delete("/:id", enrollmentController.deleteEnrollment)

//Exportar rutas
module.exports = router
