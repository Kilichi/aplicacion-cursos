//ODM (Object Data Mapper) para trabajar con MongoDB desde Node
const mongoose = require("mongoose") //npm i mongoose

//Conecta con MongoDB usando la cadena de conexión MONGODB_URI del .env
//(en local: mongodb://127.0.0.1:27017/academia_cursos)
exports.conectarMongoDB = async () => {
    //Mongoose, conéctate con la cadena de conexión de MONGODB del .env
    return mongoose.connect(process.env.MONGODB_URI)
}
