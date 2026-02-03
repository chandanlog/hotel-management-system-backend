import knex from 'knex';
import knexFile from '../../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexFile[environment]);

export default db;
