import { Sequelize } from "sequelize";

export const db = new Sequelize('database','root','root',{
    dialect: 'sqlite',
    storage: './database/db.sqlite',
    logQueryParameters: true
});