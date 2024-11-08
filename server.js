const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv').config();
const app = express();

app.use(express.json()); // body parser
app.use(cors());

app.get("/" , (req,res) => {
    console.log(`sdfghjk`);
    res.send({"msg" : "kjsdjfbvfbvhbf"});
})

require("./app/routes/user.routes.js")(app);
require("./app/routes/people.routes.js")(app); // iska work pending he...

const PORT = 5008;  // --> on this port Backend server run.
app.listen(PORT,() => {
    console.log(`Server is running on PORT : ${PORT}`);
});