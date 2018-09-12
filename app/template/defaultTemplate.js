#!/usr/bin/env node
/* eslint-env node */
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.';

const addEmploymentHistory = (doc, inputJson) => {
    doc
        .moveDown(1.5)
        .fontSize(25)
        .font('Helvetica-Bold')
        .text('Employment');

    inputJson.employment.history.forEach(employmentItem => {
        const dates = employmentItem.end
            ? `From ${employmentItem.start} to ${employmentItem.end}`
            : `From ${employmentItem.start}`;
        doc
            .moveDown(0.5)
            .fontSize(16)
            .font('Helvetica-Bold')
            .text(`${employmentItem.position} at ${employmentItem.employer}`)
            .fontSize(12)
            .font('Helvetica')
            .text(`${employmentItem.url}`)
            .text(dates)
            .text(`${employmentItem.summary}`)
            .text(`Keywords: ${employmentItem.keywords.join(' | ')}`)
            .text(`Highlights: ${employmentItem.highlights.join('; ')}`);
    });
};

const addExampleColumns = (doc) => {
    // Multiple columns
    doc
        .text(lorem, {
            columns: 3,
            columnGap: 15,
            height: 150,
            width: 465,
            align: 'justify'
        })
        .moveDown(0.5);
};

function addContent(doc, inputJson, inputDir) {
    // Set font defaults
    doc
        .fontSize(12)
        .font('Helvetica');

    // Add primary personal information
    doc.text(`Name: ${inputJson.name}`, 50, 120);
    doc.text(`Role: ${inputJson.info.characterClass}`);

    addEmploymentHistory(doc, inputJson);

    // Add a random shape
    doc.save()
       .moveTo(500, 650)
       .lineTo(400, 750)
       .lineTo(500, 750)
       .fill('#F0F000');

    // Loading as last element on the page, because the clipping masks everything that is added after
    if(inputJson.info && inputJson.info.image) {
        doc.circle(300, 70, 40)
            .clip()
            .image(`${inputDir}${inputJson.info.image}`, 260, 30, { width: 80 });
    }

    doc.addPage();

    addExampleColumns(doc);

    doc.end();
}

module.exports = { addContent };
