//SEED principal: crea la BBDD MongoDB (academia_cursos) con todas sus colecciones
//Uso: npm run seed  (equivale a: node seeds/index.js)
require("dotenv").config() //Carga las variables de entorno desde el archivo .env
const mongoose = require("mongoose")
const { conectarMongoDB } = require("../utils/mongodb.config")
const { seedCourses } = require("./course.seed")
const { seedUsers } = require("./user.seed")

const ejecutarSeed = async () => {
    try {
        // 1. Conectarnos a MongoDB (MONGODB_URI del .env)
        console.log(`Conectando a MongoDB (${process.env.MONGODB_URI})...`)
        await conectarMongoDB()
        console.log("¡Conexión exitosa!")

        // 2. Colecciones independientes: cursos y usuarios
        console.log("\n--- CURSOS ---")
        await seedCourses()

        console.log("\n--- USUARIOS ---")
        await seedUsers()

        console.log("\nSeed completado. Arranca el servidor con: npm run dev")
    } catch (error) {
        console.error("Error durante el proceso de seeding:", error.message)
        process.exitCode = 1
    } finally {
        // 3. Cerramos la conexión al terminar
        await mongoose.connection.close()
        console.log("Conexión cerrada.")
    }
}

ejecutarSeed()
