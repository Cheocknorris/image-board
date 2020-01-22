const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db
        .query(`SELECT * FROM images ORDER BY id DESC`)
        .then(({ rows }) => rows);
};

exports.addImages = function(url, username, title, description) {
    return db
        .query(
            `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) returning *`,
            [url, username, title, description]
        )
        .then(({ rows }) => rows);
};

exports.getSelectedImage = function(id) {
    return db
        .query(`SELECT * FROM images WHERE id=$1`, [id])
        .then(({ rows }) => rows);
};
