const Enrollment = require("../models/enrollment.model") //Modelo de matrículas

//Vacía la colección "enrollments" (se llama ANTES de borrar cursos y usuarios,
//para no dejar matrículas apuntando a documentos que ya no existen)
exports.clearEnrollments = async () => {
    const resultadoDelete = await Enrollment.deleteMany({}) //DELETE FROM Enrollments
    console.log(`Se eliminaron ${resultadoDelete.deletedCount} matrículas anteriores.`)
}

//Inserta matrículas de ejemplo usando los _id reales de los cursos y usuarios recién creados
//cursos y usuarios --> arrays devueltos por seedCourses() y seedUsers()
exports.seedEnrollments = async (cursos, usuarios) => {
    //Buscamos los documentos por título / DNI para no depender del orden del array
    const curso = (titulo) => cursos.find(c => c.title === titulo)._id
    const usuario = (dni) => usuarios.find(u => u.dni === dni)._id

    const matriculasIniciales = [
        { courseId: curso("Desarrollo Web con Node.js y Express"), userId: usuario("44444444A"), enrollmentDate: "2025-12-15", status: "confirmada", notes: "Matrícula pagada" },
        { courseId: curso("Desarrollo Web con Node.js y Express"), userId: usuario("55555555K"), enrollmentDate: "2025-12-18", status: "confirmada", notes: "" },
        { courseId: curso("Desarrollo Web con Node.js y Express"), userId: usuario("66666666Q"), enrollmentDate: "2026-01-05", status: "pendiente", notes: "Falta entregar documentación" },
        { courseId: curso("Bases de Datos MongoDB"), userId: usuario("77777777B"), enrollmentDate: "2026-01-10", status: "confirmada", notes: "" },
        { courseId: curso("Bases de Datos MongoDB"), userId: usuario("88888888Y"), enrollmentDate: "2026-01-12", status: "pendiente", notes: "Pago fraccionado" },
        //Hugo canceló una matrícula anterior: como está cancelada, no cuenta para la restricción 1:N
        { courseId: curso("Marketing Digital"), userId: usuario("77777777B"), enrollmentDate: "2025-11-20", status: "cancelada", notes: "Cambio de curso" },
        { courseId: curso("Administración de Sistemas Linux"), userId: usuario("99999999R"), enrollmentDate: "2026-02-01", status: "confirmada", notes: "" },
        { courseId: curso("Introducción a la Ciberseguridad"), userId: usuario("33333333P"), enrollmentDate: "2026-03-20", status: "confirmada", notes: "Profesora asistente" }
    ]

    //Creamos el índice único parcial (un usuario = una matrícula activa) antes de insertar
    await Enrollment.syncIndexes()

    const matriculasInsertadas = await Enrollment.insertMany(matriculasIniciales)
    console.log(`¡Se insertaron ${matriculasInsertadas.length} matrículas correctamente!`)
    return matriculasInsertadas
}
