#!/usr/bin/env node
/* eslint-env node */

const fs = require('fs');

function writeFilePromise(path, payload) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, payload, (error, result) => {
            if(error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = { writeFilePromise };