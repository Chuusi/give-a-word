const express = require('express')
const definir = require('../../RAE-API/examples/GetDefinition')
const app = express();
const port = 8181;

const cors = require("cors");
app.use(cors());

const Router = require("express").Router();

Router.get('/definir/:palabra', async(req,res) => {
    const palabra = req?.params.palabra;
    try {
        const result = await definir(palabra);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

app.use("/rae", Router);

app.use("*", (req,res,next) => {
    const error = new Error("RUTA NO ENCONTRADAA")
    error.status = 404;
    return next(error)
})

app.listen(port, () => {
    console.log(`Server runnint at http://localhost:${port}`);
})