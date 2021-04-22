ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'chapis77'

CREATE DATABASE db_contratos;

USE db_contratos;

CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(60) NOT NULL,
    nvl INT(11)
); 

ALTER TABLE users 
    ADD PRIMARY KEY (id);

CREATE TABLE trabajadort (
    id int(11),
    paterno VARCHAR(100),
    materno VARCHAR(100),
    nombre VARCHAR(100),
    direccion VARCHAR(100),
    colonia VARCHAR(100),
    nss VARCHAR(11),
    rfc VARCHAR(13),
    curp VARCHAR(18),
    tipoc VARCHAR(100),
    ingreso DATE,
    baja DATE,
    salario int(11),
    tipot INT(11),
    tipou INT(11),
    encargado INT(11)
);

ALTER TABLE trabajadort 
    ADD PRIMARY KEY (id);

CREATE TABLE puestost (
    idd INT(11),
    deptod VARCHAR(100),
    puestod VARCHAR(100),
    salariod INT(11)
);

ALTER TABLE puestost 
    ADD PRIMARY KEY (idd);

CREATE TABLE contratot (
    id INT(11),
    fingreso DATE,
    numcon INT(11),
    dias INT(11),
    inicio DATE,
    termino Date,
    nl INT(11),
    dc0 INT(11),
    dc1 INT(11),
    dc2 INT(11),
    dc3 INT(11),
    dc4 INT(11),
    dc5 INT(11),
    dc6 INT(11),
    dc7 INT(11),
    dc8 INT(11),
    dc9 INT(11),
    comentario VARCHAR
);

ALTER TABLE contratot  
    ADD PRIMARY KEY (id);

CREATE TABLE cursost (
    id INT(11),
    nombre VARCHAR(50),
    url VARCHAR(120)
);

ALTER TABLE cursost  
    ADD PRIMARY KEY (id);

create table histot (
id INT(11),
puesto INT(11),
falta DATE,
fbaja DATE,
tb VARCHAR(2),
finiquito DOUBLE,
rc VARCHAR(100),
comentario VARCHAR(150)
);