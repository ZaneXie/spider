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
    username: 'root',
    password: 'spider',
    option  : {
        host   : 'mysql',
        port   : 3306,
        dialect: 'mysql',
        pool   : {
            max : 5,
            min : 0,
            idle: 10000
        },
        define : {
            charset: 'utf8',
        }
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
        return connection.query(sql, (err, rows, fields) => {
            if (!err) {
                resolve(rows);
            } else {
                reject(err);
            }
        })
    })
}

export const dbConfig = configSqlite;
debug(dbConfig);
