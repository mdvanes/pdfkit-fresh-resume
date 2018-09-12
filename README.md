Toolkit for rendering a resume PDF with PDFKit.

Convert a resume (CV) in [FRESH format](https://github.com/fresh-standard/FRESCA) to PDF with [PDFKit](http://pdfkit.org/). This includes an example resume JSON and an example theme. Inspired by [HackMyResume](https://github.com/hacksalot/HackMyResume), but I wanted more low-level control over the PDF output.

The previous PDF version of my resume was generated with a FRESH resume JSON to XML to PDF with with XSL:FO and after every change I manually transform to PDF and have to close and open Adobe (there is no refresh 
button and the PDF is locked when open in Reader so it will not overwrite when transforming). As a front-end developer I want to leverage browser sync to make 
the develop/review cycle more efficient. Done with pdfkit and browsersync.

The FRESH resume JSON, photo and the generated PDF for my own resume are not public, but I did include an example json (./example-resume.json), photo (./example-photo.jpg) and PDF (./output/example-output.png).

<!--
maybe even with XSL:FO or server side pdfkit and PDF watch -> to blob -> to BlobURL -> iframe (conform iframe.src = stream.toBlobURL('application/pdf');)
Explain the difference from the live preview because the server and client side lib of pdfkit would differ and I don't need real-time updates anyway, at least
not while typing in the browser.
-->

Details about how the preview is generated:

1. A Node script runs when the sources change and generates the PDF, but also a JS with a datauri version of the PDF as a variable.
2. A static html preview.html is served that includes the datauri JS.
3. Browsersync is used to watch changes to the datauri JS and will refresh preview.html in the browser.
4. Npm-watch is used to watch changes to the sources of the Node script and on change executes eslint and generates a new PDF and datauri JS.


# Run

Because async/await is used, NPM 9 is required.

* `nvm use 9`
* `npm i`
* `npm run watch`
* `npm run dev` (in second terminal)
* open http://localhost:3000/preview.html for preview
* generated PDF is stored in /output

Basic usage: `node -app/transformer/pdf.js example-resume.json example-output`, where example-resume.json is the path to the input JSON relative to the project root and example-output is the name of the PDF (without extension) that will be created in in /output (in this case it would create /output/example-output.pdf)

To use automatic watching, modify these arguments in the _transform_ task in package.json.


# Target implementation

* `npm use`
* `npm i`
* `node index.js run examples/example-resume.json output.pdf`

or globally:

* `npm use 9`
* `npm i -g pdfkit-fresh-resume`
* `pdfkit-fresh-resume run ~/.npm/pdfkit-fresh-resume/examples/example-resume.json output.pdf`

options:

* With alternative template: `node index.js run example-resume.json output.pdf -t ./app/template/otherTemplate`

# TODO

* Implement a full template that can render an entire resume.json
* Linting: eslint app/\*\*/*.js fails because pdf.js contains async and that is an experimental feature which [can't be parsed by eslint directly](https://github.com/babel/eslint-plugin-babel/issues/6), this might be fixed by using eslint-babel parser.
* See also https://github.com/MrRio/jsPDF (.docx support: https://github.com/MrRio/DOCX.js)
