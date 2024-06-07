CREATE DATABASE todo_database;

--\c todo_database

CREATE TABLE todo(
todo_id SERIAL PRIMARY KEY,
task VARCHAR(255),
due_date DATE NOT NULL DEFAULT CURRENT_DATE,
description VARCHAR(255),
status VARCHAR(255)
);