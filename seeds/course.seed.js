const Course = require("../models/course.model") //Modelo de cursos

//Cursos iniciales de la academia (todas las fechas en formato aaaa-mm-dd)
const cursosIniciales = [
    {
        title: "Desarrollo Web con Node.js y Express",
        description: "API REST con el patrón MVC, Express, EJS y MongoDB con Mongoose.",
        category: "Desarrollo Web",
        startDate: "2026-01-12",
        endDate: "2026-03-27",
        location: "Aula 2.1 - Valencia"
    },
    {
        title: "Bases de Datos MongoDB",
        description: "Modelado NoSQL, consultas, índices, agregaciones y populate.",
        category: "Bases de Datos",
        startDate: "2026-02-02",
        endDate: "2026-04-17",
        location: "Online"
    },
    {
        title: "Programación en JavaScript",
        description: "Fundamentos de JavaScript moderno: ES6+, promesas y async/await.",
        category: "Programación",
        startDate: "2026-01-19",
        endDate: "2026-02-27",
        location: "Aula 1.3 - Valencia"
    },
    {
        title: "Administración de Sistemas Linux",
        description: "Usuarios, permisos, servicios, redes y scripts en Bash.",
        category: "Sistemas y Redes",
        startDate: "2026-03-02",
        endDate: "2026-05-29",
        location: "Laboratorio 3 - Alicante"
    },
    {
        title: "Introducción a la Ciberseguridad",
        description: "Buenas prácticas, OWASP Top 10 y seguridad en aplicaciones web.",
        category: "Ciberseguridad",
        startDate: "2026-04-13",
        endDate: "2026-06-19",
        location: "Online"
    },
    {
        title: "Diseño de Interfaces Web",
        description: "HTML semántico, CSS moderno, accesibilidad y diseño responsive.",
        category: "Diseño",
        startDate: "2026-02-16",
        endDate: "2026-04-03",
        location: "Aula 2.4 - Castellón"
    },
    {
        title: "Marketing Digital",
        description: "SEO, SEM, redes sociales y analítica web.",
        category: "Marketing",
        startDate: "2026-05-04",
        endDate: "2026-06-26",
        location: "Online"
    }
]

//Vacía la colección "courses" e inserta los cursos iniciales
//Devuelve los cursos insertados (con su _id) para poder usarlos en el seed de matrículas
exports.seedCourses = async () => {
    //Borrado masivo para vaciar la colección antes de insertar
    const resultadoDelete = await Course.deleteMany({}) //DELETE FROM Courses
    console.log(`Se eliminaron ${resultadoDelete.deletedCount} cursos anteriores.`)

    //Inserción masiva (insertMany también aplica las validaciones del esquema)
    const cursosInsertados = await Course.insertMany(cursosIniciales)
    console.log(`¡Se insertaron ${cursosInsertados.length} cursos correctamente!`)
    return cursosInsertados
}
