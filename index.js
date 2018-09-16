#!/usr/bin/env node
/* eslint-env node */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const watch = require('watch');
const fsPromise = require('./app/util/fsPromise');
const dataURI = require('datauri').promise;

const pdfToBlob = async (outputPath) => {
    try {
        const dataUriOfPdf = await dataURI(outputPath);
        const blobJsContent = `var convertedPfdDataURL = '${dataUriOfPdf}';`;
        await fsPromise.writeFilePromise('./generated-pdf-as-blob.js', blobJsContent);
    } catch(err) {
        console.error(err);
    }
};

const runTransformation = (inputJson, { inputDir, outputPath, resumeTemplatePath, isWatching }) => {
    delete require.cache[require.resolve(resumeTemplatePath)];
    const newResumeTemplate = require(resumeTemplatePath);
    const doc = new PDFDocument();
    const stream = doc.pipe(fs.createWriteStream(outputPath));
    newResumeTemplate.addContent(doc, inputJson, inputDir);
    if(isWatching) {
        stream.on('finish', () => pdfToBlob(outputPath));
        console.log('🔥Hot update');
    }
};

const runOnChange = (watchDir, filter, config) => {
    const { inputJsonPath, outputPath } = config;
    watch.createMonitor(watchDir, {
        filter
    }, monitor => {
        monitor.on('changed', (f, curr, prev) => {
            const inputJson = JSON.parse(fs.readFileSync(inputJsonPath)); // require(`./${pa.inputPath}`);
            console.log(`🕒Changed "${f}", writing output to "${outputPath}"`);
            runTransformation(inputJson, config);
        });
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
        console.log(`🎉Trying to run with input "${argv.input}" and output "${argv.output}"`);
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
            console.log(`💾Writing initial output to "${outputPath}"`);
            const isWatching = true;
            const inputJsonPath = argv.input;
            const config = { inputJsonPath, inputDir, outputPath, resumeTemplatePath, isWatching };
            runTransformation(inputJson, config);

            // Watch changes to the input JSON
            runOnChange(inputDir, file => {
                return file === path.resolve(argv.input);
            }, config);

            // Watch changes to the template dir (can have dependencies)
            runOnChange(resumeTemplateDir, file => {
                return path.parse(file).ext === '.js';
            }, config);

            // TODO extract functions from this file to separate files
            // TODO add lint task
            // TODO start dev server from node
            const webpack = require('webpack');
            const webpackDevMiddleware = require('webpack-dev-middleware');
            const webpackHotMiddleware = require('webpack-hot-middleware');

            const HtmlWebpackPlugin = require('html-webpack-plugin');
            const compiler = webpack({
                entry: [
                    'webpack-hot-middleware/client?reload=true',
                    './preview/index.js'
                ],
                mode: 'development',
                devServer: {
                    contentBase: './preview-output'
                },
                plugins: [
                    new HtmlWebpackPlugin({
                        title: 'Preview page'
                    }),
                    new webpack.HotModuleReplacementPlugin(),
                ],
                output: {
                    path: path.resolve(__dirname, 'preview-output'),
                    filename: 'bundle.js',
                    publicPath: '/'
                }
            });
            const express = require('express');
            const app = express();

            app.use(webpackDevMiddleware(compiler, {
                // webpack-dev-middleware options
                publicPath: '/'
            }));

            app.use(webpackHotMiddleware(compiler));

            // TODO add chalk for output logging
            app.listen(3456, () => console.log('Preview server listening on port 3456!'))
        } else {
            // TODO E.g. use this example https://github.com/fluentdesk/jane-q-fullstacker/blob/master/resume/jane-resume.json
            // TODO use runTransformation here too
            const doc = new PDFDocument();
            // const stream =
            doc.pipe(fs.createWriteStream(outputPath));
            resumeTemplate.addContent(doc, inputJson, inputDir);
        }
    })
    .help()
    .argv;
