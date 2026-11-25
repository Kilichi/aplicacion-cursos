const Enrollment = require("../models/enrollment.model")
const { ESTADOS_ACTIVOS } = require("../models/enrollment.model")

//Campos que traemos con POPULATE para mostrar nombres en lugar de IDs
const CAMPOS_CURSO = "title category startDate endDate location"
const CAMPOS_USUARIO = "dni firstName lastName email profile"

//Comprueba la RESTRICCIÓN 1:N antes de guardar:
//un usuario sólo puede estar matriculado en UN curso a la vez (matrícula activa).
//idExcluir --> al editar, no contamos la propia matrícula que estamos modificando
const comprobarMatriculaActiva = async (datos, idExcluir = null) => {
    //Si la matrícula se guarda como cancelada, no ocupa plaza y no hay que comprobar nada
    if (!ESTADOS_ACTIVOS.includes(datos.status || "pendiente")) return

    const filtro = { userId: datos.userId, status: { $in: ESTADOS_ACTIVOS } }
    if (idExcluir) filtro._id = { $ne: idExcluir }

    const existente = await Enrollment.findOne(filtro).populate("courseId", "title")
    if (existente) {
        const curso = existente.courseId ? existente.courseId.title : "otro curso"
        throw new Error(`El usuario ya tiene una matrícula activa en "${curso}". Cancélala antes de matricularlo en otro curso.`)
    }
}

//Devolver todas las matrículas con los datos del curso y del usuario (POPULATE)
//SELECT ... FROM Enrollments JOIN Courses JOIN Users ORDER BY enrollmentDate DESC
exports.getAll = async () => await Enrollment.find()
    .populate("courseId", CAMPOS_CURSO)
    .populate("userId", CAMPOS_USUARIO)
    .sort({ enrollmentDate: -1 })

//Devolver una matrícula por ID (también con POPULATE)
//SELECT ... FROM Enrollments WHERE _id = ObjectId(id)
exports.getById = async (id) => await Enrollment.findById(id)
    .populate("courseId", CAMPOS_CURSO)
    .populate("userId", CAMPOS_USUARIO)

//Crear una nueva matrícula
exports.create = async (datos) => {
    await comprobarMatriculaActiva(datos)
    const newEnrollment = new Enrollment(datos)
    return await newEnrollment.save() //InsertOne (MongoDB) - INSERT (SQL)
}

//Editar una matrícula existente
//UPDATE Enrollments SET ... WHERE _id = ObjectId(id)
exports.update = async (id, datos) => {
    await comprobarMatriculaActiva(datos, id)
    return await Enrollment.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
}

//Eliminar una matrícula
//DELETE FROM Enrollments WHERE _id = ObjectId(id)
exports.remove = async (id) => await Enrollment.findByIdAndDelete(id)
