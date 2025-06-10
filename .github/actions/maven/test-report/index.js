const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

// Functions Definition
function getAllFilesSync() {
    let results = [];
    const list = fs.readdirSync('.', {withFileTypes: true});

    list.forEach((dirent) => {
        const filePath = path.resolve('.', dirent.name);

        if (dirent.isDirectory()) {
            results = results.concat(getAllFilesSync(filePath));
        } else {
            results.push(filePath);
        }
    });

    return results;
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


const jacocoFiles = getAllFilesSync();
core.info(jacocoFiles)

