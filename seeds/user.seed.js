const User = require("../models/user.model") //Modelo de usuarios

//Usuarios iniciales: 1 administrador, 2 profesores y varios alumnos
//(datos inventados; los DNI tienen formato válido de 8 números y una letra)
const usuariosIniciales = [
    { dni: "11111111H", firstName: "Laura", lastName: "Martínez Gil", email: "laura.martinez@academia.es", phone: "600111111", birthDate: "1985-04-12", profile: "ADMINISTRADOR" },
    { dni: "22222222J", firstName: "Carlos", lastName: "Ferrer Soler", email: "carlos.ferrer@academia.es", phone: "600222222", birthDate: "1979-09-30", profile: "PROFESOR" },
    { dni: "33333333P", firstName: "Marta", lastName: "Navarro Ruiz", email: "marta.navarro@academia.es", phone: "600333333", birthDate: "1988-01-21", profile: "PROFESOR" },
    { dni: "44444444A", firstName: "Lucía", lastName: "García López", email: "lucia.garcia@correo.com", phone: "611444444", birthDate: "2003-06-15", profile: "ALUMNO" },
    { dni: "55555555K", firstName: "Pablo", lastName: "Sánchez Mora", email: "pablo.sanchez@correo.com", phone: "611555555", birthDate: "2002-11-03", profile: "ALUMNO" },
    { dni: "66666666Q", firstName: "Andrea", lastName: "Romero Vidal", email: "andrea.romero@correo.com", phone: "611666666", birthDate: "2004-02-28", profile: "ALUMNO" },
    { dni: "77777777B", firstName: "Hugo", lastName: "Torres Blasco", email: "hugo.torres@correo.com", phone: "611777777", birthDate: "2001-08-19", profile: "ALUMNO" },
    { dni: "88888888Y", firstName: "Sara", lastName: "Molina Pastor", email: "sara.molina@correo.com", phone: "611888888", birthDate: "2003-12-07", profile: "ALUMNO" },
    { dni: "99999999R", firstName: "Daniel", lastName: "Ortega Cano", email: "daniel.ortega@correo.com", phone: "611999999", birthDate: "2000-05-25", profile: "ALUMNO" },
    { dni: "12345678Z", firstName: "Nerea", lastName: "Castillo Peris", email: "nerea.castillo@correo.com", phone: "612345678", birthDate: "2004-10-10", profile: "ALUMNO" }
]

//Vacía la colección "users" e inserta los usuarios iniciales
//Devuelve los usuarios insertados (con su _id) para poder usarlos en el seed de matrículas
exports.seedUsers = async () => {
    //Borrado masivo para vaciar la colección antes de insertar
    const resultadoDelete = await User.deleteMany({}) //DELETE FROM Users
    console.log(`Se eliminaron ${resultadoDelete.deletedCount} usuarios anteriores.`)

    //Creamos el índice único del DNI antes de insertar
    await User.syncIndexes()

    //Inserción masiva de los nuevos datos
    const usuariosInsertados = await User.insertMany(usuariosIniciales)
    console.log(`¡Se insertaron ${usuariosInsertados.length} usuarios correctamente!`)
    return usuariosInsertados
}
