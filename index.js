#!/usr/bin/env node
/* eslint-env node */

const PDFDocument = require('pdfkit');
const fs = require('fs');
// const fsPromise = require('../util/fsPromise');
// const DataURI = require('datauri').promise;

// https://github.com/yargs/yargs/blob/master/docs/examples.md
// eslint-disable-next-line no-unused-vars
const argv = require('yargs')
    .usage('$0 <cmd> [args]')
    .option('watch', {
        alias: 'w',
        describe: 'Description for watch option'
    })
    .option('template', {
        alias: 't',
        describe: 'Description for template option'
    })
    .version() // taken from package.json
    .command('run [input] [output]', 'Run the transformation from JSON to PDF', (yargs) => {
        yargs.positional('input', {
            type: 'string',
            // default: 'Cambi',
            describe: 'The path to the input JSON, with extension'
        });
        yargs.positional('output', {
            type: 'string',
            // default: 'Cambi',
            describe: 'The filename for the output PDF, with extension'
        });
    }, function (argv) {
        console.log(`Trying to run with input ${argv.input} and output ${argv.output}`);
        // const pa = require('./app/util/parseArguments');
        // Example: node index.js run example-resume.json example-output.pdf -t -w
        // TODO check if input file exists (warn: if relative path, must start with ./)
        const inputJson = JSON.parse(fs.readFileSync(argv.input)); // require(`./${pa.inputPath}`);
        // TODO check if argv.output ends in PDF
        const outputPath = argv.output; // `./output/${pa.outputName}.pdf`;
        const doc = new PDFDocument();
        // const stream =
        doc.pipe(fs.createWriteStream(outputPath));

        if(argv.watch) {
            console.log('Flag "watch" is not yet implemented');
        }

        const resumeTemplate = argv.template ? require(argv.template) : require('./app/template/defaultTemplate');
        resumeTemplate.addContent(doc, inputJson);
    })
    .help()
    .argv;

// // It's probably not wise to convert this to a promise, because then the function on a higher level should be made async
// // Also there are no (error, result) params on the callback
// // See .finish on https://nodejs.org/api/stream.html#stream_class_stream_writable
// //function onStreamFinishPromise(streamIn) {
// //    return new Promise((resolve, reject) => {
// //        streamIn.on('finish', payload, () => {
// //            /*if(error) {
// //                reject(error);
// //            } else {
// //                resolve(result);
// //            }*/
// //            resolve({});
// //        });
// //    });
// //}
//
// // async/await requires node 8+
// // node transformer/pdf.js
// const pdfToBlob = async function() {
//     try {
//         const dataUriOfPdf = await DataURI(outputPath);
//         const blobJsContent = `var convertedPfdDataURL = '${dataUriOfPdf}';`;
//         await fsPromise.writeFilePromise('./output/generated-pdf-as-blob.js', blobJsContent);
//     } catch(err) {
//         console.error(err);
//     }
// }
//
// stream.on('finish', pdfToBlob);
