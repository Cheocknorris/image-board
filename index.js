const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");

app.use(express.static("./public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

//// boiler plate for image upload. do not touch
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

///////////////////////////////////////

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

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("file: ", req.file);
    console.log("inputs: ", req.body);
    const title = req.body.title;
    const description = req.body.description;
    const username = req.body.username;
    const url = s3Url + req.file.filename;
    console.log("title: ", title);
    console.log("description: ", description);
    console.log("username: ", username);
    console.log("url", url);

    // insert a new row into databse for the image
    db.addImages(url, username, title, description)
        .then(results => {
            console.log("upload results", results);
            res.json(results);
        })
        .catch(err => {
            console.log("error in upload", err);
        });
    //title, description and username are in req.Body
    // url of yhe image is https://s3.amazonaws.com/nameofbucket/name
    //
    //after query is succesfull, send json response

    // use unshift to put the new image first in the array
});

app.listen(8080, () => console.log("Listening"));

// app.get("/candy", (req, res) => {
//     res.json([{ name: "reesers" }, { name: "sneakers" }]);
// });
