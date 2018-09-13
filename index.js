#!/usr/bin/env node
/* eslint-env node */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const watch = require('watch');
// const fsPromise = require('../util/fsPromise');
// const DataURI = require('datauri').promise;

const runTransformation = (inputJson, inputDir, outputPath, resumeTemplatePath) => {
    const newResumeTemplate = require(resumeTemplatePath);
    const doc = new PDFDocument();
    // const stream =
    doc.pipe(fs.createWriteStream(outputPath));
    newResumeTemplate.addContent(doc, inputJson, inputDir);
};

const runOnChange = (watchDir, filter, inputJsonPath, inputDir, outputPath, resumeTemplatePath) => {
    watch.createMonitor(watchDir, {
        filter
        // filter: file => {
        //     // if( file === path.resolve(argv.input) ) {
        //     //     console.log(file);
        //     // }
        //     return file === path.resolve(argv.input);
        // }
    }, monitor => {
        // monitor.files[argv.input];
        // monitor.on('created', function (f, stat) {
        //     // Handle new files
        // })
        monitor.on('changed', (f, curr, prev) => {
            const inputJson = JSON.parse(fs.readFileSync(inputJsonPath)); // require(`./${pa.inputPath}`);
            console.log(`Writing output to ${outputPath} (changes to ${f})`, f);
            runTransformation(inputJson, inputDir, outputPath, resumeTemplatePath);
            // const inputDir = path.parse(path.resolve(argv.input)).dir + path.sep;
            // Handle file changes
            // console.log('changed', f)
            // console.log(`Writing output to ${outputPath} (changes to ${f})`, f);
            // const newResumeTemplate = require(resumeTemplatePath);
            // const doc = new PDFDocument();
            // // const stream =
            // doc.pipe(fs.createWriteStream(outputPath));
            // newResumeTemplate.addContent(doc, newInputJson, inputDir);
        });
        // monitor.on('removed', function (f, stat) {
        //     // Handle removed files
        // })
        // monitor.stop(); // Stop watching
    });
};

// https://github.com/yargs/yargs/blob/master/docs/examples.md
// eslint-disable-next-line no-unused-vars
const argv = require('yargs')
    .usage('$0 <cmd> [args]')
    .option('template', {
        alias: 't',
        describe: 'Description for template option',
        type: 'string'
    })
    .option('watch', {
        alias: 'w',
        describe: 'Description for watch option',
        type: 'boolean'
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
        console.log(`Trying to run with input "${argv.input}" and output "${argv.output}"`);
        // const pa = require('./app/util/parseArguments');
        // Example: node index.js run example-resume.json example-output.pdf -t -w
        // TODO check if input file exists (warn: if relative path, must start with ./)
        const inputJson = JSON.parse(fs.readFileSync(argv.input)); // require(`./${pa.inputPath}`);
        const inputDir = path.parse(path.resolve(argv.input)).dir + path.sep;
        // console.log('test ' + inputDir);
        // TODO check if argv.output ends in PDF
        const outputPath = argv.output; // `./output/${pa.outputName}.pdf`;
        const resumeTemplatePath = argv.template ? argv.template : __dirname + '/app/template/defaultTemplate';
        const resumeTemplate = require(resumeTemplatePath);
        const resumeTemplateDir = path.parse(path.resolve(resumeTemplatePath)).dir + path.sep;

        if(argv.watch) {
            // TODO implement watch. Should watch the input.json and the template
            console.log('Flag "watch" is not yet implemented');

            // Watch changes to the input JSON
            runOnChange(inputDir, file => {
                return file === path.resolve(argv.input);
            }, argv.input, inputDir, outputPath, resumeTemplatePath);

            // watch.createMonitor(inputDir, {
            //     filter: file => {
            //         // if( file === path.resolve(argv.input) ) {
            //         //     console.log(file);
            //         // }
            //         return file === path.resolve(argv.input);
            //     }
            // }, monitor => {
            //     // monitor.files[argv.input];
            //     // monitor.on('created', function (f, stat) {
            //     //     // Handle new files
            //     // })
            //     monitor.on('changed', (f, curr, prev) => {
            //         const newInputJson = JSON.parse(fs.readFileSync(argv.input)); // require(`./${pa.inputPath}`);
            //         // const inputDir = path.parse(path.resolve(argv.input)).dir + path.sep;
            //         // Handle file changes
            //         // console.log('changed', f)
            //         console.log(`Writing output to ${outputPath} (changes to ${f})`, f);
            //         const doc = new PDFDocument();
            //         // const stream =
            //         doc.pipe(fs.createWriteStream(outputPath));
            //         const newResumeTemplate = require(resumeTemplatePath);
            //         newResumeTemplate.addContent(doc, newInputJson, inputDir);
            //     });
            //     // monitor.on('removed', function (f, stat) {
            //     //     // Handle removed files
            //     // })
            //     // monitor.stop(); // Stop watching
            // });
            // TODO Watch changes to the template dir (can have dependencies)
            watch.createMonitor(resumeTemplateDir, {
                filter: file => {
                    return path.parse(file).ext === '.js';
                }
            }, monitor => {
                // monitor.files[argv.input];
                // monitor.on('created', function (f, stat) {
                //     // Handle new files
                // })
                monitor.on('changed', (f, curr, prev) => {
                    const newInputJson = JSON.parse(fs.readFileSync(argv.input)); // require(`./${pa.inputPath}`);
                    // const inputDir = path.parse(path.resolve(argv.input)).dir + path.sep;
                    // Handle file changes
                    // console.log('changed', f)
                    console.log(`Writing output to ${outputPath} (changes to ${f})`, f);
                    const doc = new PDFDocument();
                    // const stream =
                    doc.pipe(fs.createWriteStream(outputPath));
                    const newResumeTemplate = require(resumeTemplatePath); // TODO not taking the updated template.js
                    newResumeTemplate.addContent(doc, newInputJson, inputDir);
                });
                // monitor.on('removed', function (f, stat) {
                //     // Handle removed files
                // })
                // monitor.stop(); // Stop watching
            });

            // TODO write blob stream
            // TODO dev server
        } else {
            // TODO E.g. use this example https://github.com/fluentdesk/jane-q-fullstacker/blob/master/resume/jane-resume.json
            const doc = new PDFDocument();
            // const stream =
            doc.pipe(fs.createWriteStream(outputPath));
            resumeTemplate.addContent(doc, inputJson, inputDir);
        }
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
