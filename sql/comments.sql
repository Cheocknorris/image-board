DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    comment TEXT,
    image_id INT REFERENCES images(id) NOT NULL 
);
