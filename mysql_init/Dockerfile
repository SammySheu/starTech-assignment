FROM mysql

COPY ./database_user.sql /docker-entrypoint-initdb.d

ENV MYSQL_ROOT_PASSWORD=my-secret-pw \
    MYSQL_DATABASE=starTech_userdb \
    MYSQL_USER=localUser \
    MYSQL_PASSWORD=password