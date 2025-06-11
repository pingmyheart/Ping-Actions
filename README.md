# PING-ACTIONS

*Repository to manage personal actions and workflows*

![Last Commit](https://img.shields.io/github/last-commit/pingmyheart/Ping-Actions)
![Repo Size](https://img.shields.io/github/repo-size/pingmyheart/Ping-Actions)
![Issues](https://img.shields.io/github/issues/pingmyheart/Ping-Actions)
![Pull Requests](https://img.shields.io/github/issues-pr/pingmyheart/Ping-Actions)
![License](https://img.shields.io/github/license/pingmyheart/Ping-Actions)
![Top Language](https://img.shields.io/github/languages/top/pingmyheart/Ping-Actions)
![Language Count](https://img.shields.io/github/languages/count/pingmyheart/Ping-Actions)

## 🚀 Overview

*Ping-Actions* is a curated collection of personal GitHub Actions and workflow templates aimed at streamlining CI/CD
processes across various programming languages. This repository serves as a centralized hub for reusable workflows,
facilitating consistent and efficient automation in your projects.

## 📁 Repository Structure

- **.github/workflows**: Contains reusable workflow templates for different programming languages.
- **.github/actions**: Custom GitHub Actions for specific tasks.

## Usage

Action uses a dispatcher to manage workflows. The dispatcher is a simple script that takes the action name as an input
and runs the corresponding workflow.

### Docker Maven Dispatcher

```yaml
name: CI
# Triggers
on:
  workflow_dispatch: # Manual trigger from the Actions tab
  push:
    branches:
      - '**'
    tags:
      - 'v*'

permissions:
  contents: write
  packages: write
  pages: write
  actions: write

jobs:
  ci:
    secrets: inherit
    uses: pingmyheart/Ping-Actions/.github/workflows/dispatcher.yml@main
    with:
      project-type: docker-maven
      java-version: 17
```

### Docker Python Dispatcher

```yaml
name: CI
# Triggers
on:
  workflow_dispatch: # Manual trigger from the Actions tab
  push:
    branches:
      - '**'
    tags:
      - 'v*'

permissions:
  contents: write
  packages: write
  pages: write
  actions: write

jobs:
  ci:
    secrets: inherit
    uses: pingmyheart/Ping-Actions/.github/workflows/dispatcher.yml@main
    with:
      project-type: docker-python
      python-version: 3.10
```

### Maven Dispatcher

```yaml
name: CI
# Triggers
on:
  workflow_dispatch: # Manual trigger from the Actions tab
  push:
    branches:
      - '**'
    tags:
      - 'v*'

permissions:
  contents: write
  packages: write
  pages: write
  actions: write

jobs:
  ci:
    secrets: inherit
    uses: pingmyheart/Ping-Actions/.github/workflows/dispatcher.yml@main
    with:
      project-type: maven
      java-version: 17
```

### Python Dispatcher

```yaml
name: CI
# Triggers
on:
  workflow_dispatch: # Manual trigger from the Actions tab
  push:
    branches:
      - '**'
    tags:
      - 'v*'

permissions:
  contents: write
  packages: write
  pages: write
  actions: write

jobs:
  ci:
    secrets: inherit
    uses: pingmyheart/Ping-Actions/.github/workflows/dispatcher.yml@main
    with:
      project-type: python
      python-version: "3.10"
```

### Python Executable Dispatcher

```yaml
name: CI
# Triggers
on:
  workflow_dispatch: # Manual trigger from the Actions tab
  push:
    branches:
      - '**'
    tags:
      - 'v*'

permissions:
  contents: write
  packages: write
  pages: write
  actions: write

jobs:
  ci:
    secrets: inherit
    uses: pingmyheart/Ping-Actions/.github/workflows/dispatcher.yml@main
    with:
      project-type: python-executable
      python-version: 3.10
```