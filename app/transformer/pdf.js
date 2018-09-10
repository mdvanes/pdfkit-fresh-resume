#!/usr/bin/env node
/* eslint-env node */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsPromise = require('../util/fsPromise');
const DataURI = require('datauri').promise;
const resumeTemplate = require('../template/resume');
const pa = require('../util/parseArguments');

const inputJson = require(`../../${pa.inputPath}`);
const outputPath = `./output/${pa.outputName}.pdf`;
const doc = new PDFDocument();
const stream = doc.pipe(fs.createWriteStream(outputPath));

resumeTemplate.addContent(doc, inputJson);

// It's probably not wise to convert this to a promise, because then the function on a higher level should be made async
// Also there are no (error, result) params on the callback
// See .finish on https://nodejs.org/api/stream.html#stream_class_stream_writable
//function onStreamFinishPromise(streamIn) {
//    return new Promise((resolve, reject) => {
//        streamIn.on('finish', payload, () => {
//            /*if(error) {
//                reject(error);
//            } else {
//                resolve(result);
//            }*/
//            resolve({});
//        });
//    });
//}

// async/await requires node 8+
// node transformer/pdf.js
const pdfToBlob = async function() {
    try {
        const dataUriOfPdf = await DataURI(outputPath);
        const blobJsContent = `var convertedPfdDataURL = '${dataUriOfPdf}';`;
        await fsPromise.writeFilePromise('./output/generated-pdf-as-blob.js', blobJsContent);
    } catch(err) {
        console.error(err);
    }
}

stream.on('finish', pdfToBlob);
