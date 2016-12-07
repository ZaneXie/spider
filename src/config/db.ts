/**
 * Created by xiezj on 2016/12/5.
 */

import path = require('path');
import {getDebugger} from "../util/debug";
const debug = getDebugger("config");
import mysql = require('mysql');
import Bluebird = require('bluebird');

let configSqlite =
    {
        database: 'database',
        username: 'username',
        password: 'password',
        option  : {
            host   : 'localhost',
            dialect: 'sqlite',

            pool: {
                max : 5,
                min : 0,
                idle: 10000
            },

            // SQLite only
            storage: path.resolve(__dirname, '../../sqlite.db'),
        }
    };

let configMysql = {
    database: 'spider',
    username: process.env['MYSQL_USERNAME'] ||'root',
    password: process.env['MYSQL_PASSWORD'] ||'spider',
    option  : {
        host   : process.env['MYSQL_HOST'] || 'mysql',
        port   : parseInt(process.env['MYSQL_PORT']) || 3306,
        dialect: 'mysql',
        pool   : {
            max : 5,
            min : 0,
            idle: 10000
        },
        define : {
            charset: 'utf8',
        },
    }
}

export function initMysql() {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection({
            host    : configMysql.option.host,
            user    : configMysql.username,
            password: configMysql.password,
        });
        connection.connect();
        let sql = 'create database if not exists ' + configMysql.database;
        debug(sql);
        return connection.query(sql, (err, rows, fields) => {
            console.log(err);
            if (!err) {
                resolve(rows);
            } else {
                reject(err);
            }
        })
    })
}

let dbType = process.env['DATABASE_TYPE'] || 'sqlite';
let config: any = configSqlite;
if (dbType === "mysql") {
    config = configMysql;
}
export const dbConfig = config;
debug(dbConfig);
