use starTech_db;

CREATE TABLE user(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email varchar(100) NOT NULL UNIQUE,
    password varchar(150) NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE picture(
    picture_id INT PRIMARY KEY AUTO_INCREMENT,
    pictureName varchar(50) NOT NULL,
    pictureURL varchar(150) NOT NULL,
    belongTo INT,
    isPrivate boolean NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE picture
ADD FOREIGN KEY(belongTo)
REFERENCES user(user_id)
ON DELETE CASCADE;

INSERT INTO user(email, password)
VALUES ('test@email.com', 'test_user_password');

INSERT INTO picture(pictureName, pictureURL, belongTo, isPrivate)
VALUES ('test_piture', 'test_picture_url', 1, true);

-- SELECT *
-- FROM picture
-- JOIN user
-- ON picture.belongTo = user.user_id;
-- WHERE course.in_school = FALSE;