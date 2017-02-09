#!/usr/bin/env node

function addContent(doc) {
    doc.save()
       .moveTo(500, 150)
       .lineTo(400, 250)
       .lineTo(500, 250)
       .fill('#F0F000');

    doc.end();
}

module.exports = { addContent };
