-- create the schema
CREATE SCHEMA `kopiboy`;
-- create the user
CREATE USER 'kopiboy'@'localhost' IDENTIFIED BY 'kopiboy';
-- grant all privileges to the user
GRANT ALL ON `kopiboy` . * TO 'kopiboy'@'localhost';
