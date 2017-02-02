-- select the `kopiboy` schema
USE `kopiboy`;
-- drop all rows in `places`
DELETE FROM `places` WHERE id;
-- remove migration
DELETE FROM `SequelizeData` WHERE name = '20170201130222-places.js';