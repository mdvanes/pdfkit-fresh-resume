Toolkit for rendering a resume PDF with pdfkit.

Convert a resume (CV) in [FRESH format](https://github.com/fresh-standard/FRESCA) to PDF with PDFKit. This includes an example resume JSON and an example theme. Inspired by [HackMyResume](https://github.com/hacksalot/HackMyResume), but I wanted more low-level control over the PDF output.

The previous PDF version of my resume was generated with a FRESH resume JSON to XML to PDF with with XSL:FO and after every change I manually transform to PDF and have to close and open Adobe (there is no refresh 
button and the PDF is locked when open in Reader so it will not overwrite when transforming). As a front-end developer I want to leverage browser sync to make 
the develop/review cycle more efficient. Done with pdfkit and browsersync.

The FRESH resume JSON, photo and the generated PDF for my own resume are not public, but I did include an example json (./example-resume.json), photo (./example-photo.jpg) and PDF (./output/example-output.png).

maybe even with XSL:FO or server side pdfkit and PDF watch -> to blob -> to BlobURL -> iframe (conform iframe.src = stream.toBlobURL('application/pdf');)
Explain the difference from the live preview because the server and client side lib of pdfkit would differ and I don't need real-time updates anyway, at least
not while typing in the browser.
1. execute a node script that generates a PDF and a JS with the bloburl of the generated PDF as a variable
2. serve an HTML (preview-v2.html) with bloburl JS
3. use browsersync to watch changes to the bloburl JS to refresh the preview-v2.html
4. use npm-watch to watch changes to the sources of the node script
5. remove babel and webpack?
6. linting


# Run

Because async/await is used, NPM 7+ is required and node needs to be started with the --harmony flag

* `nvm use 7.4.0`
* npm i
* npm run watch
* npm run dev
* open http://localhost:3000/preview.html for preview
* generated PDF is also in /output

Basic usage: `node --harmony app/transformer/pdf.js example-resume.json example-output`, where example-resume.json is the path to the input JSON relative to the project root and example-output is the name of the PDF (without extension) that will be created in in /output (in this case it would create /output/example-output.pdf)

To use automatic watching, modify these arguments in the _transform_ task in package.json.


# TODO

* implement a full template that can render an entire resume.json
* linting: eslint app/**/*.js fails because pdf.js contains async and that is an experimental feature which [can't be parsed by eslint directly](https://github.com/babel/eslint-plugin-babel/issues/6), this might be fixed by using eslint-babel parser.
* See also https://github.com/MrRio/jsPDF (.docx support: https://github.com/MrRio/DOCX.js)