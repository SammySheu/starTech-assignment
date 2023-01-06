use starTech_userdb;

CREATE TABLE user(
    id serial PRIMARY KEY,
    email varchar(100) NOT NULL UNIQUE,
    password varchar(150) NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO user(email, password)
VALUES ('test@email.com', 'test_password');