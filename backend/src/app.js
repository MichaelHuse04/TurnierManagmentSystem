import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const server = express();
const port = process.env.PORT || 5713;


server.get("/",(req, res) => {
    res.send("hello world!");
});
server.listen(port, () => {
    console.log("Listening on port: " + port);
});