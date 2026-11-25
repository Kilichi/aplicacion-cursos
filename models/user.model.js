const mongoose = require("mongoose")

//Perfiles (roles) posibles de un usuario de la academia
const PERFILES = ["ADMINISTRADOR", "PROFESOR", "ALUMNO"]

const userSchema = new mongoose.Schema({
    //_id --> ObjectId generado automáticamente por MongoDB
    dni: {
        type: String,
        required: [true, "El DNI es obligatorio"],
        unique: true, //No podemos repetir el DNI (crea un índice único en MongoDB)
        uppercase: true, //Guardamos la letra siempre en mayúscula
        trim: true,
        match: [/^[0-9]{8}[A-Z]$/, "El DNI debe tener 8 números y una letra (ej: 12345678Z)"]
    },
    firstName: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Los apellidos son obligatorios"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "El email no tiene un formato válido"]
    },
    phone: {
        type: String,
        required: [true, "El teléfono es obligatorio"],
        trim: true,
        match: [/^[0-9+\s]{9,15}$/, "El teléfono debe tener entre 9 y 15 dígitos"]
    },
    birthDate: {
        type: Date,
        required: [true, "La fecha de nacimiento es obligatoria"],
        validate: {
            //No se permiten fechas de nacimiento en el futuro
            validator: (valor) => valor <= new Date(),
            message: "La fecha de nacimiento no puede ser futura"
        }
    },
    profile: {
        type: String,
        required: [true, "El perfil es obligatorio"],
        enum: { values: PERFILES, message: "El perfil {VALUE} no es válido" },
        default: "ALUMNO"
    }
}, {
    //timestamps crea y mantiene automáticamente createdAt y updatedAt
    timestamps: true
})

//Campo virtual (no se guarda en la BBDD) con el nombre completo, útil en las vistas
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`
})

//Creamos el MODELO a partir del ESQUEMA MONGOOSE (colección "users")
const User = mongoose.model("user", userSchema)

//Exportamos para poderlo usar en el SERVICE
module.exports = User
module.exports.PERFILES = PERFILES
