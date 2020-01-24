const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db
        .query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`)
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
        .query(
            `SELECT *,
            (SELECT max(id) FROM images WHERE id<$1) AS "nextId",
            (SELECT min(id) FROM images WHERE id>$1) AS "previousId"
            FROM images WHERE id=$1`,
            [id]
        )
        .then(({ rows }) => rows);
};

exports.addComments = function(username, comment, imageId) {
    return db
        .query(
            `INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) returning *`,
            [username, comment, imageId]
        )
        .then(({ rows }) => rows);
};

exports.getComments = function(imageId) {
    return db
        .query(`SELECT * FROM comments WHERE image_id=$1 ORDER BY id DESC`, [
            imageId
        ])
        .then(({ rows }) => rows);
};

exports.getMoreImages = function(lastId) {
    return db
        .query(
            `SELECT *, (
                    SELECT id FROM images
                    ORDER BY id ASC
                    LIMIT 1
                    ) AS "lowestId" FROM images
                    WHERE id < $1
                    ORDER BY id DESC
                    LIMIT 6`,
            [lastId]
        )
        .then(({ rows }) => rows);
};
