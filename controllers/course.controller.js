const CourseService = require("../services/course.service")
const { CATEGORIAS } = require("../models/course.model")
const { mensajeError } = require("../utils/formatos")

//Sólo en el CONTROLLER, se trabaja con REQ y RES

//Función para obtener todos los cursos (vista courses/index.ejs)
exports.findAllCourses = async (req, res) => {
    const cursos = await CourseService.getAll()
    res.locals.tituloEJS = "Cursos"
    res.render("courses/index.ejs", { cursos })
}

//Función para obtener un curso por ID (vista courses/show.ejs)
exports.findCourseById = async (req, res) => {
    const { id } = req.params
    const curso = await CourseService.getById(id)
    if (curso) {
        res.locals.tituloEJS = "Detalle del curso"
        res.render("courses/show.ejs", { curso })
    } else {
        //Si no existe el curso, lanzar error personalizado
        res.locals.tituloEJS = "Error"
        res.status(404).render("error.ejs", { msg: "Curso no encontrado" })
    }
}

//Mostrar el formulario de alta (vista courses/new.ejs)
exports.showNewCourse = async (req, res) => {
    res.locals.tituloEJS = "Nuevo curso"
    res.render("courses/new.ejs", { categorias: CATEGORIAS, curso: {}, error: null })
}

//POST - Crear un curso con los datos del formulario (req.body)
exports.createCourse = async (req, res) => {
    try {
        await CourseService.create(req.body)
        res.redirect("/cursos")
    } catch (err) {
        //Si falla la validación, volvemos al formulario con los datos y el error
        res.locals.tituloEJS = "Nuevo curso"
        res.status(400).render("courses/new.ejs", { categorias: CATEGORIAS, curso: req.body, error: mensajeError(err) })
    }
}

//Mostrar el formulario de edición (vista courses/edit.ejs)
exports.showEditCourse = async (req, res) => {
    //1 - Obtener el id a partir del req.params
    const { id } = req.params
    //2 - Buscar el curso con ese id
    const curso = await CourseService.getById(id)
    if (curso) {
        //3 - Renderizar la vista edit.ejs con ese curso
        res.locals.tituloEJS = "Editar curso"
        res.render("courses/edit.ejs", { curso, categorias: CATEGORIAS, error: null })
    } else {
        res.locals.tituloEJS = "Error"
        res.status(404).render("error.ejs", { msg: "Curso no encontrado" })
    }
}

//PATCH - Actualizar un curso
exports.editCourse = async (req, res) => {
    const { id } = req.params
    try {
        const courseUpdated = await CourseService.update(id, req.body)
        if (courseUpdated) {
            res.redirect(`/cursos/${id}`)
        } else {
            res.locals.tituloEJS = "Error"
            res.status(404).render("error.ejs", { msg: "Curso no actualizado" })
        }
    } catch (err) {
        //Volvemos a mostrar el formulario con lo que había escrito el usuario
        res.locals.tituloEJS = "Editar curso"
        res.status(400).render("courses/edit.ejs", { curso: { ...req.body, _id: id }, categorias: CATEGORIAS, error: mensajeError(err) })
    }
}

//DELETE - Borrar un curso
exports.deleteCourse = async (req, res) => {
    const { id } = req.params
    try {
        const courseDeleted = await CourseService.remove(id)
        if (courseDeleted) {
            res.redirect("/cursos")
        } else {
            res.locals.tituloEJS = "Error"
            res.status(404).render("error.ejs", { msg: "Curso no eliminado" })
        }
    } catch (err) {
        res.locals.tituloEJS = "Error"
        res.status(400).render("error.ejs", { msg: mensajeError(err) })
    }
}
