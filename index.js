//Punto de entrada de la aplicación (API REST MVC de la academia)
//Al modificar una variable de entorno, debemos reiniciar el servidor
require("dotenv").config() //npm i dotenv --> carga las variables del archivo .env
const express = require("express") //npm i express
const app = express()
//process.env.PORT --> Desplegar en entorno de PRODUCCION en un puerto libre
//process.env.PUERTO --> Utilizar la variable de entorno del archivo .env
//Si no existe ninguna --> 3020
const port = process.env.PORT || process.env.PUERTO || 3020
const path = require("path") //npm i path
const methodOverride = require("method-override") //npm i method-override (PATCH y DELETE desde formularios)
const mongodbConfig = require("./utils/mongodb.config")
const formatos = require("./utils/formatos")

//Configuración del motor de vistas EJS (SSR)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs") //npm i ejs
//Archivos estáticos (CSS, imágenes...) dentro de /public
app.use(express.static(path.join(__dirname, "public")))

//Para poder leer datos (request body) en métodos POST de formularios
app.use(express.urlencoded({ extended: true }))
//Leer datos JSON en request body POST
app.use(express.json())

//Permite usar ?_method=PATCH o ?_method=DELETE en formularios HTML
app.use(methodOverride("_method"))

//MIDDLEWARE para configurar VARIABLES GLOBALES (res.locals) en vistas EJS
app.use((req, res, next) => {
    //Título por defecto de todas las vistas EJS
    res.locals.tituloEJS = "Academia"
    //Ruta actual, para marcar el enlace activo en el menú de navegación
    res.locals.rutaActual = req.path
    //Funciones de formato de fechas disponibles en todas las vistas
    res.locals.formatearFecha = formatos.formatearFecha
    res.locals.fechaInput = formatos.fechaInput
    //Continuar con la ejecución del ENDPOINT al que hayamos invocado
    next()
})

//DEFINIR RUTAS MVC
//Raíz --> página de inicio con accesos a cada módulo
app.get("/", (req, res) => {
    res.locals.tituloEJS = "Inicio"
    res.render("index.ejs")
})

//Rutas por defecto (cualquier ruta que no exista)
app.use((req, res) => {
    res.locals.tituloEJS = "Error"
    res.status(404).render("error.ejs", { msg: "404 - NOT FOUND" })
})

//Manejador de errores no controlados (por ejemplo, un ID con formato incorrecto)
app.use((err, req, res, next) => {
    console.log(`Error en ${req.method} ${req.originalUrl}. Desc: ${err.message}`)
    res.locals.tituloEJS = "Error"
    res.status(500).render("error.ejs", { msg: formatos.mensajeError(err) })
})

//Levantar el server
app.listen(port, async () => {
    console.log(`${process.env.API_MENSAJE || "Servidor escuchando en el puerto "}${port}`)
    //Una vez levantado el server, intentamos conectar con MongoDB
    await mongodbConfig.conectarMongoDB()
        .then(() => {
            console.log("Conectado con MongoDB!!!")
        })
        .catch((err) => {
            console.log(`Error al conectar con MongoDB. Desc: ${err}`)
            process.exit(1)
        })
})
