const Course = require("../models/course.model")

//Comprueba que la fecha de fin sea posterior a la de inicio.
//En el modelo ya hay un validador, pero en findByIdAndUpdate "this" no es el documento,
//así que lo comprobamos también aquí antes de crear o actualizar
const validarFechas = (datos) => {
    if (datos.startDate && datos.endDate && new Date(datos.endDate) <= new Date(datos.startDate)) {
        throw new Error("La fecha de fin debe ser posterior a la fecha de inicio")
    }
}

//Devolver todos los cursos ordenados por fecha de inicio
//SELECT * FROM Courses ORDER BY startDate
exports.getAll = async () => await Course.find().sort({ startDate: 1 })

//Devolver un curso por ID
//SELECT * FROM Courses WHERE _id = ObjectId(id)
exports.getById = async (id) => await Course.findById(id)

//Crear un nuevo curso
exports.create = async (datos) => {
    validarFechas(datos)
    const newCourse = new Course(datos)
    return await newCourse.save() //InsertOne (MongoDB) - INSERT (SQL)
}

//Editar un curso existente
//UPDATE Courses SET ... WHERE _id = ObjectId(id)
exports.update = async (id, datos) => {
    validarFechas(datos)
    //new:true --> devuelve el documento ya actualizado
    //runValidators:true --> aplica las validaciones del esquema también al actualizar
    return await Course.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
}

//Eliminar un curso
//DELETE FROM Courses WHERE _id = ObjectId(id)
exports.remove = async (id) => {
    return await Course.findByIdAndDelete(id)
}
