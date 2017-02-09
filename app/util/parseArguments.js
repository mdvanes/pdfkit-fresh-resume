#!/usr/bin/env node
/* eslint-env node */

let inputPath = null;
let outputName = null;
let photoPath = null;

if(process.argv.length > 2 && process.argv[2]) {
    console.log(`Input path for FRESH JSON: ${process.argv[2]}`); // eslint-disable-line no-console
    inputPath = process.argv[2];
} else {
    const msg = 'Input path for FRESH JSON expected as first argument';
    console.log(`ERROR: ${msg}`); // eslint-disable-line no-console
    throw new Error(msg);
}

if(process.argv.length > 3 && process.argv[3]) {
    console.log(`Output filename for PDF: ${process.argv[3]}`); // eslint-disable-line no-console
    outputName = process.argv[3];
} else {
    const msg = 'Output filename for PDF expected as second argument';
    console.log(`ERROR: ${msg}`); // eslint-disable-line no-console
    throw new Error(msg);
}

if(process.argv.length > 4 && process.argv[4]) {
    console.log(`Input path for photo: ${process.argv[4]}`); // eslint-disable-line no-console
    photoPath = process.argv[4];
} else {
    const msg = 'Input path for photo optional third argument';
    console.log(`WARN: ${msg}`); // eslint-disable-line no-console
}

module.exports = { inputPath, outputName, photoPath };