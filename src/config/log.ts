/**
 * Created by xiezongjun on 2016-12-08.
 */

import winston = require('winston');
import path = require('path');

winston.loggers.add('default', {
    console: {
        level    : 'silly',
        colorize : true,
        timestamp: true,
    },
    file   : {
        filename: path.resolve(__dirname, '../../app.log')
    }
});

export function getLogger(name: string = "default") {
    if (!winston.loggers.has(name)) {
        console.log('no logger name %s found, use default one', name);
        name = "default";
    }
    return winston.loggers.get(name);
}
