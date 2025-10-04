const connection = require("./connection/connection");

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT;
const URL=process.env.URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));






 connection.connect((error) => {
    if (error) {
        console.log("failed in connection");
    }else{
        console.log("database connected successfully")
    }
    app.listen(port, () => {
        console.log(`server is running on ${URL}`);

    })
})