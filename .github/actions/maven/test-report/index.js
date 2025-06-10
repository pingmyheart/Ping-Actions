const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

// Functions Definition
function findFiles(regex) {
    let fileList = []
    core.info("Searching for files matching: " + regex);
    const files = fs.readdirSync('.');

    files.forEach(file => {
        const filePath = path.join('.', file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findFiles(filePath, regex, fileList);
        } else if (regex.test(file)) {
            fileList.push(filePath);
        }
    });

    return fileList;
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

const jacocoRegex = /[/\\]jacoco\.xml$/;
const surefireRegex = /[/\\]surefire-reports[/\\]TEST-.*\.xml$/;
// Look For Jacoco


const jacocoFiles = findFiles(jacocoRegex);

if (jacocoFiles.length !== 0) {
    processJacocoFiles(jacocoFiles);
    return;
}
// Looking For Surefire

const surefireFiles = findFiles(surefireRegex);

if (surefireFiles.length === 0) {
    processSurefireFiles(surefireFiles);
    return;
}
