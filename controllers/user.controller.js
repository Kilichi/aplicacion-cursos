const UserService = require("../services/user.service")
const { PERFILES } = require("../models/user.model")
const { mensajeError } = require("../utils/formatos")

//Sólo en el CONTROLLER, se trabaja con REQ y RES

//Función para obtener todos los usuarios (vista users/index.ejs)
exports.findAllUsers = async (req, res) => {
    const usuarios = await UserService.getAll()
    res.locals.tituloEJS = "Usuarios"
    res.render("users/index.ejs", { usuarios })
}

//Función para obtener un usuario por ID (vista users/show.ejs)
exports.findUserById = async (req, res) => {
    const { id } = req.params
    const usuario = await UserService.getById(id)
    if (usuario) {
        res.locals.tituloEJS = "Detalle del usuario"
        res.render("users/show.ejs", { usuario })
    } else {
        //Si no existe el usuario, lanzar error personalizado
        res.locals.tituloEJS = "Error"
        res.status(404).render("error.ejs", { msg: "Usuario no encontrado" })
    }
}

//Mostrar el formulario de alta (vista users/new.ejs)
exports.showNewUser = async (req, res) => {
    res.locals.tituloEJS = "Nuevo usuario"
    res.render("users/new.ejs", { perfiles: PERFILES, usuario: {}, error: null })
}

//POST - Crear un usuario con los datos del formulario (req.body)
exports.createUser = async (req, res) => {
    try {
        await UserService.create(req.body)
        res.redirect("/usuarios")
    } catch (err) {
        //Si el DNI está repetido o falla alguna validación, volvemos al formulario
        res.locals.tituloEJS = "Nuevo usuario"
        res.status(400).render("users/new.ejs", { perfiles: PERFILES, usuario: req.body, error: mensajeError(err) })
    }
}

//Mostrar el formulario de edición (vista users/edit.ejs)
exports.showEditUser = async (req, res) => {
    //1 - Obtener el id a partir del req.params
    const { id } = req.params
    //2 - Buscar el usuario con ese id
    const usuario = await UserService.getById(id)
    if (usuario) {
        //3 - Renderizar la vista edit.ejs con ese usuario
        res.locals.tituloEJS = "Editar usuario"
        res.render("users/edit.ejs", { usuario, perfiles: PERFILES, error: null })
    } else {
        res.locals.tituloEJS = "Error"
        res.status(404).render("error.ejs", { msg: "Usuario no encontrado" })
    }
}

//PATCH - Actualizar un usuario
exports.editUser = async (req, res) => {
    const { id } = req.params
    try {
        const userUpdated = await UserService.update(id, req.body)
        if (userUpdated) {
            res.redirect(`/usuarios/${id}`)
        } else {
            res.locals.tituloEJS = "Error"
            res.status(404).render("error.ejs", { msg: "Usuario no actualizado" })
        }
    } catch (err) {
        //Volvemos a mostrar el formulario con lo que había escrito el usuario
        res.locals.tituloEJS = "Editar usuario"
        res.status(400).render("users/edit.ejs", { usuario: { ...req.body, _id: id }, perfiles: PERFILES, error: mensajeError(err) })
    }
}

//DELETE - Borrar un usuario
exports.deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const userDeleted = await UserService.remove(id)
        if (userDeleted) {
            res.redirect("/usuarios")
        } else {
            res.locals.tituloEJS = "Error"
            res.status(404).render("error.ejs", { msg: "Usuario no eliminado" })
        }
    } catch (err) {
        res.locals.tituloEJS = "Error"
        res.status(400).render("error.ejs", { msg: mensajeError(err) })
    }
}

//GET /usuarios/buscar?dni=... --> devuelve el usuario en JSON (prueba del API REST)
exports.findUserByDni = async (req, res) => {
    const { dni } = req.query
    if (!dni) {
        return res.status(400).json({ message: "Falta el parámetro dni" })
    }
    const usuario = await UserService.getByDni(dni)
    if (usuario) {
        res.status(200).json(usuario)
    } else {
        res.status(404).json({ message: "Usuario no encontrado" })
    }
}
