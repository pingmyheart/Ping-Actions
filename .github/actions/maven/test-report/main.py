import os
import re
import sys
import xml.etree.ElementTree as ElementTree


def retrieve_jacoco_files(source_directory: str = '.') -> list[str]:
    jacoco_files: list[str] = []
    pattern = re.compile(r'.*jacoco\.xml$')
    for root, dirs, files in os.walk(source_directory):
        for name in files:
            path = os.path.join(root, name)
            if pattern.match(path):
                jacoco_files.append(path)
    return jacoco_files


def extract_covered_and_missed(object) -> tuple[int, int]:
    if object is None:
        return 0, 0
    covered = int(object.attrib.get('covered', '0'))
    missed = int(object.attrib.get('missed', '0'))
    return covered, missed


def write_report(report: str) -> None:
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_file:
        with open(summary_file, 'a') as f:
            f.write(report)
    else:
        print(report)


if __name__ == '__main__':
    # obtain summary file
    report = '# 🛡️ JaCoCo Coverage Report\n\n'

    # check if positional argument is provided
    files: list[str] = []
    if len(os.sys.argv) > 1:
        source_directory = os.sys.argv[1]
        files = retrieve_jacoco_files(source_directory)
    else:
        files = retrieve_jacoco_files()

    if not files:
        report += 'No JaCoCo XML files found.'
        print(report)
        sys.exit(0)

    for file in files:
        root = ElementTree.parse(file).getroot()

        # Retrieve report name from XML file
        report_name = root.attrib.get('name', 'Unknown Report')

        # Retrieve global missed and covered lines
        global_instruction = root.find("counter[@type='INSTRUCTION']")
        global_covered, global_missed = extract_covered_and_missed(global_instruction)
        global_total = global_covered + global_missed
        coverage_percentage = (global_covered / global_total * 100) if global_total > 0 else 0

        report += f'## Module: {report_name}\n\n'
        report += "| Covered Instructions | Missed Instructions | Total Instructions | Coverage Percentage |\n"
        report += "|----------------------|---------------------|--------------------|---------------------|\n"
        report += f'| {global_covered} | {global_missed} | {global_total} | {coverage_percentage:.0f}% |\n\n'

        # Retrieve all packages
        for package in root.findall('package'):
            package_name = package.attrib.get('name', 'Unknown Package')
            report += '<details open>\n'
            report += f'<summary>Package {package_name}</summary>\n\n'

            # Retrieve missed and covered lines for the package
            package_instruction = package.find("counter[@type='INSTRUCTION']")
            package_covered, package_missed = extract_covered_and_missed(package_instruction)
            package_total = package_covered + package_missed
            package_coverage_percentage = (package_covered / package_total * 100) if package_total > 0 else 0
            report += "| Covered Instructions | Missed Instructions | Total Instructions | Coverage Percentage |\n"
            report += "|----------------------|---------------------|--------------------|---------------------|\n"
            report += f'| {package_covered} | {package_missed} | {package_total} | {package_coverage_percentage:.0f}% |\n\n'
            report += '</details>\n\n'

    write_report(report)
