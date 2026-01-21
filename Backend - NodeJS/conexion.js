let mysql = require("mysql");


let conexion = mysql.createConnection({
    host: "localhost",
    database: "shef_pro"
    user: "root",
    password: "",
});

conexion.connect(function(err)){
    if(err){
        throw err;
    }else{
        console.log("Conectado a la base de datos");
    }
};
