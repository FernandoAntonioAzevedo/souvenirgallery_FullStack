const mongoose = require("mongoose");

require("dotenv").config();

mongoose.set("strictQuery", true);

main().catch((error) => console.log(error));

async function main() {
    await mongoose.connect(
        `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.hi9j8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`        
    );

    console.log("conectado com sucesso!");
}

module.exports = main;