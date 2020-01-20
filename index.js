const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

app.use(express.json());

app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            console.log("db results: ", results);
            res.json(results);
        })
        .catch(err => {
            console.log("err: ", err);
        });
});

app.listen(8080, () => console.log("Listening"));

// app.get("/candy", (req, res) => {
//     res.json([{ name: "reesers" }, { name: "sneakers" }]);
// });
