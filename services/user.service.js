const User = require("../models/user.model")
const Enrollment = require("../models/enrollment.model")

//Devolver todos los usuarios ordenados por apellidos
//SELECT * FROM Users ORDER BY lastName, firstName
exports.getAll = async () => await User.find().sort({ lastName: 1, firstName: 1 })

//Devolver un usuario por ID
//SELECT * FROM Users WHERE _id = ObjectId(id)
exports.getById = async (id) => await User.findById(id)

//Devolver un usuario por DNI (findOne devuelve el primer objeto, no un array)
//SELECT * FROM Users WHERE dni = dni
exports.getByDni = async (dni) => await User.findOne({ dni: dni.toUpperCase() })

//Crear un nuevo usuario
exports.create = async (datos) => {
    const newUser = new User(datos)
    return await newUser.save() //InsertOne (MongoDB) - INSERT (SQL)
}

//Editar un usuario existente
//UPDATE Users SET ... WHERE _id = ObjectId(id)
exports.update = async (id, datos) => {
    //new:true --> devuelve el documento actualizado
    //runValidators:true --> vuelve a validar DNI, email, perfil... al actualizar
    return await User.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
}

//Eliminar un usuario
//DELETE FROM Users WHERE _id = ObjectId(id)
exports.remove = async (id) => {
    //Integridad referencial: no se puede borrar un usuario que tiene matrículas
    const matriculas = await Enrollment.countDocuments({ userId: id })
    if (matriculas > 0) {
        throw new Error(`No se puede eliminar el usuario: tiene ${matriculas} matrícula(s). Elimínalas primero.`)
    }
    return await User.findByIdAndDelete(id)
}
