require("dotenv").config();

const express = require("express"); //LLamada a express

const app = express(); //Creando app express

const port = process.env.PORT || 80; //Configurando puerto

const bodyParser = require("body-parser"); //Para parcear a JSON
app.use(bodyParser.json()); //Parcear a JSON

const { databaseService } = require('./services/databaseService')

require("./routes")(app, databaseService()); //Mando la aplicacion por argumento a routes

// iniciamos nuestro servidor
app.listen(port, () => {
  console.log("API escuchando en el puerto " + port); //Respuesta del servidor
}); //Configurando app para que escuche en el puerto 80
