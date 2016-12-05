/**
 * Created by xiezj on 2016/12/5.
 */

import path = require('path');
import {getDebugger} from "../util/debug";
const debug = getDebugger("config");
let configSqlite =
    {
        database: 'database',
        username: 'username',
        password: 'password',
        option: {
            host: 'localhost',
            dialect: 'sqlite',

            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },

            // SQLite only
            storage: path.resolve(__dirname, '../../sqlite.db'),
        }
    };

export const dbConfig = configSqlite;
debug(dbConfig);
