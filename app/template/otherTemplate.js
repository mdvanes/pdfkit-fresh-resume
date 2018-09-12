#!/usr/bin/env node
/* eslint-env node */
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.';

const writeLink = (doc, label, url, x, y) => {
    //const label = 'This is a link to my github!';
    doc
        .fillColor('blue')
        .text(label, x, y);
    const width = doc.widthOfString(label);
    const height = doc.currentLineHeight();
    doc
        .underline(x, y, width, height, {color: 'blue'})
        .link(x, y, width, height, url);
};

const addPage1 = (doc, inputJson) => {
    doc.text(`Name: ${inputJson.name}`, 50, 120);

    doc.circle(380, 275, 40)
        .clip();
    doc.image('example-photo.jpg', 290, 170, { width: 200 });

    doc.addPage();
};

const addPage2 = (doc) => {
    doc.text(lorem);
    doc.text('FOO BAR', 0, 10); // x, y

    doc.addPage();
};

const addPage3 = (doc) => {
    // Link
    writeLink(doc, 'This is a link to my github!', 'http://github.com/', 20, 0);

    // Colored text
    doc.fillColor('green')
        .text(lorem.slice(0, 500))
        .fillColor('red')
        .text(lorem.slice(500));

    // Multiple columns
    doc
        .text(lorem, {
            columns: 3,
            columnGap: 15,
            height: 100,
            width: 465,
            align: 'justify'
        })
        .moveDown(0.5);
};

function addContent(doc, inputJson) {

    doc.info.Author = 'The Author';

    doc.on('pageAdded', () => { // For each page added
        doc.text('Page Title');
    });

    addPage1(doc, inputJson);
    addPage2(doc);
    addPage3(doc);

    doc.end();
}

module.exports = { addContent };
