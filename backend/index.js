const express = require("express");
const config = require("config");
const app = express();

app.use(express.static('public'));
require("./utilities/fileUpload")(app);
require("./utilities/database");
require("./utilities/cors")(app);
require("./utilities/routes")(app);

const port = config.get("PORT");
const server = app.listen(port, () => console.log(`Server running on port ${__dirname + "::" + server.address().port}...`));
