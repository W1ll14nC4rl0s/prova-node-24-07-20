CREATE TABLE tb_user(
    id SERIAL PRIMARY KEY,
    name varchar(255), 
    username varchar(255),
    email varchar(255)
);

CREATE TABLE  tb_login(
    id SERIAL PRIMARY KEY,
    name varchar(255),
    username varchar(255),
    email varchar(255),
    token varchar(255)
);