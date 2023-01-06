FROM mysql

COPY ./database_init.sql /docker-entrypoint-initdb.d

ENV MYSQL_ROOT_PASSWORD=my-secret-pw \
    MYSQL_DATABASE=starTech_db \
    MYSQL_USER=localUser \
    MYSQL_PASSWORD=password