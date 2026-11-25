//Funciones de ayuda reutilizables en controladores y vistas EJS

//Devuelve una fecha en formato dd/mm/aaaa para mostrarla en las vistas
exports.formatearFecha = (fecha) => {
    const d = new Date(fecha)
    //Si no hay fecha o no es válida, devolvemos un guion
    if (!fecha || isNaN(d)) return "-"
    return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC"
    })
}

//Devuelve una fecha en formato aaaa-mm-dd, que es el que necesita
//el atributo value de un <input type="date"> (vistas de edición)
exports.fechaInput = (fecha) => {
    const d = new Date(fecha)
    if (!fecha || isNaN(d)) return ""
    return d.toISOString().substring(0, 10)
}

//Traduce los errores de Mongoose/MongoDB a un mensaje legible para el usuario
exports.mensajeError = (err) => {
    //Error de validación del esquema (campos obligatorios, min, enum, match...)
    if (err.name === "ValidationError") {
        return Object.values(err.errors).map(e => e.message).join(". ")
    }
    //Error de índice único (por ejemplo, DNI repetido)
    if (err.code === 11000) {
        const campo = Object.keys(err.keyValue || {})[0] || "campo"
        return `Ya existe un registro con ese valor de ${campo}`
    }
    //ID con formato incorrecto (no es un ObjectId válido)
    if (err.name === "CastError") {
        return `Valor no válido para ${err.path}`
    }
    //Cualquier otro error (por ejemplo, los lanzados desde los services)
    return err.message
}
