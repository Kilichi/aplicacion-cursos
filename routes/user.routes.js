const userController = require("../controllers/user.controller")
const express = require("express")
const router = express.Router()

//Todas estas rutas cuelgan de /usuarios (ver index.js)

//Mostrar VISTA EJS users/index.ejs con el listado de usuarios
router.get("/", userController.findAllUsers)

//Mostrar vista EJS users/new.ejs para crear un usuario
router.get("/new", userController.showNewUser)

//Buscar un usuario por DNI y devolverlo en JSON (/usuarios/buscar?dni=12345678Z)
router.get("/buscar", userController.findUserByDni)

//POST - Crear usuario
router.post("/", userController.createUser)

//Mostrar vista EJS users/edit.ejs para editar un usuario
router.get("/:id/edit", userController.showEditUser)

//IMPORTANTE!!! GET dinámico (con parámetros) al final siempre
//Mostrar VISTA EJS users/show.ejs con los detalles de un usuario
router.get("/:id", userController.findUserById)

//PATCH - Actualizar un usuario
router.patch("/:id", userController.editUser)

//DELETE - Borrar un usuario
router.delete("/:id", userController.deleteUser)

//Exportar rutas
module.exports = router
