const express = require('express');
const bodyParser = require('body-parser');
const vergeRoute = require("./controllerRoute");


let app = express();
let port = process.env.PORT || 6996;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(" Application Listening on Port 6996")
});

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "welcome to my VergeApi"
    });
});

app.use("/api/v1", vergeRoute);