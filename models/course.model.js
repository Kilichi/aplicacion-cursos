const mongoose = require("mongoose")

//Categorías permitidas para un curso (se usan también en los <select> de las vistas)
const CATEGORIAS = [
    "Desarrollo Web",
    "Programación",
    "Bases de Datos",
    "Sistemas y Redes",
    "Ciberseguridad",
    "Diseño",
    "Marketing"
]

const courseSchema = new mongoose.Schema({
    //_id --> ObjectId generado automáticamente por MongoDB (como la PK)
    title: {
        type: String,
        required: [true, "El título es obligatorio"], //NOT NULL SQL
        trim: true
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "La categoría es obligatoria"],
        enum: { values: CATEGORIAS, message: "La categoría {VALUE} no es válida" }
    },
    startDate: {
        type: Date,
        required: [true, "La fecha de inicio es obligatoria"]
    },
    endDate: {
        type: Date,
        required: [true, "La fecha de fin es obligatoria"],
        validate: {
            //La fecha de fin debe ser posterior a la de inicio
            //(this es el documento al hacer save/insertMany)
            validator: function (valor) {
                return !this.startDate || valor > this.startDate
            },
            message: "La fecha de fin debe ser posterior a la fecha de inicio"
        }
    },
    location: {
        type: String,
        required: [true, "La ubicación es obligatoria"],
        trim: true
    }
}, {
    //timestamps crea y mantiene automáticamente createdAt y updatedAt
    timestamps: true
})

//Creamos el MODELO a partir del ESQUEMA MONGOOSE (colección "courses")
const Course = mongoose.model("course", courseSchema)

//Exportamos para poderlo usar en el SERVICE
module.exports = Course
module.exports.CATEGORIAS = CATEGORIAS
