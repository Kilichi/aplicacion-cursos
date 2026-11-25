const EnrollmentService = require("../services/enrollment.service")
const CourseService = require("../services/course.service")
const UserService = require("../services/user.service")
const { ESTADOS } = require("../models/enrollment.model")
const { mensajeError } = require("../utils/formatos")

//Sólo en el CONTROLLER, se trabaja con REQ y RES

//Carga los datos que necesitan los <select> de los formularios new y edit
const datosFormulario = async () => ({
    cursos: await CourseService.getAll(),
    usuarios: await UserService.getAll(),
    estados: ESTADOS
})

//Función para obtener todas las matrículas (vista enrollments/index.ejs)
exports.findAllEnrollments = async (req, res) => {
    //getAll ya viene con POPULATE --> m.courseId.title, m.userId.firstName...
    const matriculas = await EnrollmentService.getAll()
    res.locals.tituloEJS = "Matrículas"
    res.render("enrollments/index.ejs", { matriculas })
}

//Mostrar el formulario de alta (vista enrollments/new.ejs)
exports.showNewEnrollment = async (req, res) => {
    res.locals.tituloEJS = "Nueva matrícula"
    //Permite llegar con un curso o usuario preseleccionado (?courseId=...&userId=...)
    const matricula = { courseId: req.query.courseId, userId: req.query.userId, enrollmentDate: new Date() }
    res.render("enrollments/new.ejs", { ...(await datosFormulario()), matricula, error: null })
}

//POST - Crear una matrícula
exports.createEnrollment = async (req, res) => {
    try {
        await EnrollmentService.create(req.body)
        res.redirect("/matriculas")
    } catch (err) {
        //Si el usuario ya está matriculado en otro curso, volvemos al formulario con el error
        res.locals.tituloEJS = "Nueva matrícula"
        res.status(400).render("enrollments/new.ejs", { ...(await datosFormulario()), matricula: req.body, error: mensajeError(err) })
    }
}

//Mostrar el formulario de edición (vista enrollments/edit.ejs)
exports.showEditEnrollment = async (req, res) => {
    const { id } = req.params
    const matricula = await EnrollmentService.getById(id)
    if (matricula) {
        res.locals.tituloEJS = "Editar matrícula"
        res.render("enrollments/edit.ejs", { ...(await datosFormulario()), matricula, error: null })
    } else {
        res.locals.tituloEJS = "Error"
        res.status(404).render("error.ejs", { msg: "Matrícula no encontrada" })
    }
}

//PATCH - Actualizar una matrícula
exports.editEnrollment = async (req, res) => {
    const { id } = req.params
    try {
        const enrollmentUpdated = await EnrollmentService.update(id, req.body)
        if (enrollmentUpdated) {
            res.redirect("/matriculas")
        } else {
            res.locals.tituloEJS = "Error"
            res.status(404).render("error.ejs", { msg: "Matrícula no actualizada" })
        }
    } catch (err) {
        res.locals.tituloEJS = "Editar matrícula"
        res.status(400).render("enrollments/edit.ejs", { ...(await datosFormulario()), matricula: { ...req.body, _id: id }, error: mensajeError(err) })
    }
}

//DELETE - Borrar una matrícula
exports.deleteEnrollment = async (req, res) => {
    const { id } = req.params
    const enrollmentDeleted = await EnrollmentService.remove(id)
    if (enrollmentDeleted) {
        res.redirect("/matriculas")
    } else {
        res.locals.tituloEJS = "Error"
        res.status(404).render("error.ejs", { msg: "Matrícula no eliminada" })
    }
}
