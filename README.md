[![npm version](https://badge.fury.io/js/pdfkit-fresh-resume.svg)](https://badge.fury.io/js/pdfkit-fresh-resume)

> Toolkit for rendering a resume PDF with PDFKit.

Convert a resume (CV) in [FRESH format](https://github.com/fresh-standard/FRESCA) to PDF 
with [PDFKit](http://pdfkit.org/). This includes an example resume JSON and an example theme. Inspired 
by [HackMyResume](https://github.com/hacksalot/HackMyResume), but I wanted more low-level control over the PDF output.

The previous PDF version of my resume was generated with a FRESH resume JSON to XML to PDF with with XSL:FO and after 
every change I manually transform to PDF and have to close and open Adobe Reader (there is no refresh button and the PDF is 
locked when open in Reader so it will not overwrite when transforming). As a front-end developer I want to leverage 
browser sync to make the develop/review cycle more efficient.

The FRESH resume JSON, photo and the generated PDF for my own resume are not public, but I did include an example 
json (./example-resume.json), photo (./example-photo.jpg) and PDF (./output/example-output.png).

Details about how the preview is generated:

1. A Node script runs when the sources change and generates the PDF, but also a JS with a data-uri version of the PDF as a variable.
2. A static html preview.html is served that includes the data-uri JS.
3. Webpack dev middleware is used to watch changes to the data-uri JS and will refresh the preview in the browser.


# Run

Because async/await is used, NPM 9 is required.

* `npm use 9`
* `npm i`
* `node index.js run examples/example-resume.json output.pdf`

or globally:

* `npm use 9`
* `npm i -g pdfkit-fresh-resume`
* `pdfkit-fresh-resume run ~/.npm/pdfkit-fresh-resume/example-resume.json output.pdf`

options:

* With alternative template: `pdfkit-fresh-resume run ~/.npm/pdfkit-fresh-resume/example-resume.json output.pdf -t ~/.npm/pdfkit-fresh-resume/app/template/otherTemplate.js`

## Running with -w/--watch

* `pdfkit-fresh-resume run ~/.npm/pdfkit-fresh-resume/example-resume.json output.pdf -w`
* Open http://localhost:3456 in the browser to see the preview for the PDF.
* After updating the template or the input JSON, the console will log "🔥Hot update". After that the browser will reload and show the changes.  


# TODO

* Implement a full template that can render an entire resume.json
* Linting: eslint app/\*\*/*.js fails because pdf.js contains async and that is an experimental feature which [can't be parsed by eslint directly](https://github.com/babel/eslint-plugin-babel/issues/6), this might be fixed by using eslint-babel parser.
* See also https://github.com/MrRio/jsPDF (.docx support: https://github.com/MrRio/DOCX.js)
