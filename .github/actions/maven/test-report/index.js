const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

// Functions Definition
function findFiles(pattern) {
    let foundFiles = [];
    fs.readdir('.', (err, files) => {
        if (err) {
            core.setFailed(`Error reading directory: ${err.message}`);
        }
        files.filter(file => pattern.test(pattern))
            .forEach(file => foundFiles.add(file));
    })
    return foundFiles
}

function processJacocoFiles(jacocoFiles) {
    jacocoFiles.forEach(file => {
        const filePath = path.resolve(file);
        if (fs.existsSync(filePath)) {
            core.info(`Processing Jacoco file: ${filePath}`);
            // Add logic to process Jacoco file
            // For example, parse the XML and upload results
        } else {
            core.warning(`Jacoco file not found: ${filePath}`);
        }
    })
}

function processSurefireFiles(surefireFiles) {
    surefireFiles.forEach(file => {
        const filePath = path.resolve(file);
        if (fs.existsSync(filePath)) {
            core.info(`Processing Surefire file: ${filePath}`);
            // Add logic to process Surefire file
            // For example, parse the XML and upload results
        } else {
            core.warning(`Surefire file not found: ${filePath}`);
        }
    })
}

// Argument Check

// Main Logic

const jacocoFilesRegex = "*/jacoco.xml";
const surefireFilesRegex = "*/surefire-reports/TEST-*.xml";
// Look For Jacoco


const jacocoFiles = findFiles(jacocoFilesRegex);

if (jacocoFiles.length !== 0) {
    processJacocoFiles(jacocoFiles);
    return;
}
// Looking For Surefire

const surefireFiles = findFiles(surefireFilesRegex);

if (surefireFiles.length === 0) {
    processSurefireFiles(surefireFiles);
    return;
}
