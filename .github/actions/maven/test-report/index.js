const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const {XMLParser} = require('fast-xml-parser');

async function main() {
    const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY;

    if (!GITHUB_STEP_SUMMARY) {
        core.setFailed('GITHUB_STEP_SUMMARY environment variable not found.');
    }

    const jacocoFiles = glob.sync('**/target/site/jacoco*/jacoco.xml', {absolute: true});
    let reportContent = '';

    if (jacocoFiles.length > 0) {
        core.info(`Found ${jacocoFiles.length} JaCoCo report(s).`);
        reportContent += `# 🛡️ JaCoCo Coverage Report(s)\n\n`;

        jacocoFiles.forEach((file) => {
            const xml = fs.readFileSync(file, 'utf-8');
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: '@_'
            });
            const json = parser.parse(xml);

            if (json.report && json.report.counter) {
                const counters = Array.isArray(json.report.counter)
                    ? json.report.counter
                    : [json.report.counter];

                reportContent += `## 📄 ${path.relative(process.cwd(), file)}\n\n`;
                reportContent += `| Metric | Covered | Missed | Coverage (%) |\n`;
                reportContent += `|--------|---------|--------|--------------|\n`;

                counters.forEach((counter) => {
                    const covered = parseInt(counter['@_covered'], 10);
                    const missed = parseInt(counter['@_missed'], 10);
                    const total = covered + missed;
                    const coverage = total > 0 ? ((covered / total) * 100).toFixed(2) : 'N/A';

                    reportContent += `| ${counter['@_type']} | ${covered} | ${missed} | ${coverage} |\n`;
                });

                reportContent += `\n`;
            } else {
                reportContent += `Could not parse ${file}\n\n`;
            }
        });
    }

    // Write to GitHub Actions summary
    fs.writeFileSync(GITHUB_STEP_SUMMARY, reportContent);
    core.info('Summary written to GitHub Actions summary.');
}

main().catch((err) => {
    core.setFailed(err);
});
