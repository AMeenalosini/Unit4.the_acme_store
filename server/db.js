const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);

const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS Favorite;
        DROP TABLE IF EXISTS Product;
        DROP TABLE IF EXISTS users;
        

        CREATE TABLE Product(
            id UUID PRIMARY KEY, 
            name VARCHAR(255) NOT NULL UNIQUE
        );

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(255) NOT NULL, 
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE Favorite(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES Product(id) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
        );
    `;

  await client.query(SQL);
};

const createUser = async (name, password) => {
  const SQL = `INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;`;
  const hashed_password = await bcrypt.hash(password, 5);

  const response = await client.query(SQL, [uuid.v4(), name, hashed_password]);

  return response.rows[0];
};

const createProduct = async (name) => {
  const SQL = `INSERT INTO Product(id, name) VALUES($1,$2) RETURNING *;`;

  const response = await client.query(SQL, [uuid.v4(), name]);

  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `SELECT * from users;`;

  const response = await client.query(SQL);

  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `SELECT * from Product;`;

  const response = await client.query(SQL);

  return response.rows;
};

const createFavorite = async (product_id, user_id) => {
  const SQL = `INSERT INTO Favorite(id, product_id, user_id) VALUES($1, $2, $3) RETURNING *;`;

  const reponse = await client.query(SQL, [uuid.v4(), user_id, product_id]);

  return reponse.rows[0];
};

const fetchFavorites = async (user_id) => {
  const SQL = `SELECT * from Favorite WHERE user_id = $1;`;

  const response = await client.query(SQL, [user_id]);

  return response.rows;
};

const destroyFavorite = async (id, user_id) => {
  const SQL = `DELETE FROM Favorite WHERE id = $1 AND user_id = $2`;

  await client.query(SQL, [id, user_id]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};