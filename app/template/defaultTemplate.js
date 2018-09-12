#!/usr/bin/env node
/* eslint-env node */

const DEFAULT_FONT_NORMAL = 'Helvetica';
const DEFAULT_FONT_BOLD = 'Helvetica-Bold';

const addEmploymentHistory = (doc, inputJson) => {
    doc
        .moveDown(1.5)
        .fontSize(25)
        .font(DEFAULT_FONT_BOLD)
        .text('Employment');

    inputJson.employment.history.forEach(employmentItem => {
        const dates = employmentItem.end
            ? `From ${employmentItem.start} to ${employmentItem.end}`
            : `From ${employmentItem.start}`;
        doc
            .moveDown(0.5)
            .fontSize(16)
            .font(DEFAULT_FONT_BOLD)
            .text(`${employmentItem.position} at ${employmentItem.employer}`)
            .fontSize(12)
            .font(DEFAULT_FONT_NORMAL)
            .text(`${employmentItem.url}`)
            .text(dates)
            .text(`${employmentItem.summary}`)
            .text(`Keywords: ${employmentItem.keywords.join(' | ')}`)
            .text(`Highlights: ${employmentItem.highlights.join('; ')}`);
    });
};

const addMyStory = (doc, inputJson) => {
    // Multiple columns
    if(inputJson.info.brief) {
        doc
            .moveDown(1.5)
            .fontSize(25)
            .font(DEFAULT_FONT_BOLD)
            .text('My story')
            .fontSize(12)
            .font(DEFAULT_FONT_NORMAL)
            .text(inputJson.info.brief, {
                columns: 3,
                columnGap: 15,
                height: 150,
                width: 465,
                align: 'justify'
            })
            .moveDown(5);
    }
};

const addEducation = (doc, inputJson) => {
    doc
        .moveDown(1.5)
        .fontSize(25)
        .font(DEFAULT_FONT_BOLD)
        .text('Education');
    inputJson.education.history.forEach(education => {
        const dates = education.end
            ? `From ${education.start} to ${education.end}`
            : `From ${education.start}`;
        doc
            .moveDown(0.5)
            .fontSize(16)
            .font(DEFAULT_FONT_BOLD)
            .text(education.institution)
            .fontSize(12)
            .font(DEFAULT_FONT_NORMAL)
            .text(dates);
    });
    doc.moveDown(0.5);

};

const addSkills = (doc, inputJson) => {
    doc
        .moveDown(1.5)
        .fontSize(25)
        .font(DEFAULT_FONT_BOLD)
        .text('Skills')
        .fontSize(12)
        .font(DEFAULT_FONT_NORMAL);
    inputJson.skills.sets.forEach(set => {
        doc
            .fontSize(16)
            .font(DEFAULT_FONT_NORMAL)
            .text(set.name)
            .fontSize(12)
            .text(set.skills.join(' | '));
    })
};

function addContent(doc, inputJson, inputDir) {
    // Set font defaults
    doc
        .fontSize(12)
        .font(DEFAULT_FONT_NORMAL);

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

    addMyStory(doc, inputJson);
    addEducation(doc, inputJson);
    addSkills(doc, inputJson);

    doc.end();
}

module.exports = { addContent };
