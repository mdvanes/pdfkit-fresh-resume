#!/usr/bin/env node
/* eslint-env node */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsPromise = require('../util/fsPromise');
const DataURI = require('datauri').promise;
//const createDoc = require('../template/example.js');
const resumeTemplate = require('../template/resume');

const doc = new PDFDocument();
// TODO path of .pdf should be in variable and name should be output.pdf or something or taken from input.json
const outputPath = './output/examplev2.pdf';
const stream = doc.pipe(fs.createWriteStream(outputPath));

// TODO accept JSON path as param

// add your content to the document here, as usual
//doc.save()
//   .moveTo(200, 150)
//   .lineTo(100, 250)
//   .lineTo(200, 250)
//   .fill('#F0F000');
//
//doc.end();

resumeTemplate.addContent(doc);

//createDoc(doc, true);

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


// async/await requires node 7.x and harmony flag
// nvm use 7.4.0
// node --harmony transformer/pdf.js
const pdfToBlob = async function() {
    try {
        const dataUriOfPdf = await DataURI(outputPath);
        //console.log('dataUriOfPdf=', dataUriOfPdf);
        const blobJsContent = `var convertedPfdDataURL = '${dataUriOfPdf}';`;
        await fsPromise.writeFilePromise('./output/generated-pdf-as-blob.js', blobJsContent);
    } catch(err) {
        console.error(err);
    }
}

stream.on('finish', pdfToBlob);