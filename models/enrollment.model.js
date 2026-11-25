const mongoose = require("mongoose")

//Estados posibles de una matrícula
const ESTADOS = ["pendiente", "confirmada", "cancelada"]
//Estados que cuentan como matrícula "activa" (la cancelada no ocupa plaza)
const ESTADOS_ACTIVOS = ["pendiente", "confirmada"]

const enrollmentSchema = new mongoose.Schema({
    //_id --> ObjectId generado automáticamente por MongoDB
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course", //FK --> necesario para POPULATE con el modelo "course"
        required: [true, "El curso es obligatorio"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", //FK --> necesario para POPULATE con el modelo "user"
        required: [true, "El usuario es obligatorio"]
    },
    enrollmentDate: {
        type: Date,
        required: [true, "La fecha de matrícula es obligatoria"],
        default: Date.now
    },
    status: {
        type: String,
        required: [true, "El estado es obligatorio"],
        enum: { values: ESTADOS, message: "El estado {VALUE} no es válido" },
        default: "pendiente"
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    }
}, {
    //timestamps crea y mantiene automáticamente createdAt y updatedAt
    timestamps: true
})

//RESTRICCIÓN 1:N --> un curso puede tener muchos usuarios matriculados,
//pero un usuario sólo puede tener UNA matrícula activa (pendiente o confirmada) a la vez.
//Índice único PARCIAL: sólo se aplica a los documentos con estado activo,
//así un usuario puede tener varias matrículas canceladas en su historial.
enrollmentSchema.index(
    { userId: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $in: ESTADOS_ACTIVOS } },
        name: "una_matricula_activa_por_usuario"
    }
)

//Creamos el MODELO a partir del ESQUEMA MONGOOSE (colección "enrollments")
const Enrollment = mongoose.model("enrollment", enrollmentSchema)

//Exportamos para poderlo usar en el SERVICE
module.exports = Enrollment
module.exports.ESTADOS = ESTADOS
module.exports.ESTADOS_ACTIVOS = ESTADOS_ACTIVOS
