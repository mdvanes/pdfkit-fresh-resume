#!/usr/bin/env node
/* eslint-env node */

function addContent(doc, inputJson) {

    doc.text(`Name: ${inputJson.name}`, 50, 120);
    doc.text(`Role: ${inputJson.info.characterClass}`);
    doc.text(`Employment: ${inputJson.employment.history}`);
    inputJson.employment.history.forEach(employmentItem => {
        doc.text(`Employer: ${employmentItem.employer}`);
    });

    doc.save()
       .moveTo(500, 650)
       .lineTo(400, 750)
       .lineTo(500, 750)
       .fill('#F0F000');

    // Loading as last element on the page, because the clipping masks everything that is added after
    if(inputJson.info && inputJson.info.image) {
        doc.circle(300, 70, 40)
            .clip()
            .image(inputJson.info.image, 260, 30, { width: 80 });
    }

    doc.end();
}

module.exports = { addContent };
