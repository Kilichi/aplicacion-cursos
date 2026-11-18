//npm init -y
//crear index.js
//Al modificar una variable de entorno, debemos reiniciar el servidor
require("dotenv").config() //npm i dotenv
const axios = require("axios") //npm i express
const express = require("express") //npm i express
const app = express()
//process.env.PORT --> Desplegar en entorno de PRODUCCION en un puerto libre
//process.env.PUERTO --> Utilizar la variable de entorno del archivo .env
//Si no existe ninguna --> 3020
const port = process.env.PORT || process.env.PUERTO || 3020
const path = require("path") //npm i path
const {v4:uuid} = require("uuid") //npm i uuid
const methodOverride = require("method-override") //npm i method-override
const commentRoutes = require("./routes/comment.routes")
const tvRoutes = require("./routes/tv.routes")
const mongodbConfig = require("./utils/mongodb.config")

app.set("views",path.join(__dirname,"views"))
app.set("view engine", "ejs") //npm i ejs (SSR)
app.use(express.static(path.join(__dirname,"public")))

//Para poder leer datos (request body) en métodos POST
app.use(express.urlencoded({extended:true}))
//Leer datos JSON en request body POST
app.use(express.json())

app.use(methodOverride("_method"))

// MIDDLEWARE PARA CONFIGURAR VARIABLES GLOBALES EN VISTAS EJS
app.use((req, res, next) => {
    res.locals.tituloEJS = "API REST"
    next()
})

//DEFINIR RUTAS MVC
//Raíz
app.get("/",(req,res)=>res.redirect("/comentarios"))
//Propias del REST (MVC)
// app.use("/comentarios",commentRoutes)
// app.use("/tv",tvRoutes)
//Rutas por defecto
app.use((req,res)=>{
    //Para cualquier ruta que no exista, lo que haremos será redirigir a la ruta raíz (GET)
    //res.redirect("/") //Redirige a rutas GET
    res.locals.tituloEJS = "ERROR!"
    res.render("error.ejs", { msg:"404 - NOT FOUND"})
})

//Levantar el server
app.listen(port, async () =>{
    try {
        await mongodbConfig.connectarMongoDB()
            .then(() => {
                console.log("Conectado con MongoDB!")
            })
            .catch((e) => {
                console.log("ERROR: "+e)
                process.exit(1)
            })
    } catch (e) {
        console.log("ERROR: "+e)
        process.exit(1)
    }
    console.log(`${process.env.API_MENSAJE}${port}`)
})