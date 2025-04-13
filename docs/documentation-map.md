---
title: "Documentation Map"
date: "2025-04-20"
last_updated: "2025-04-20"
status: "approved"
tags: ["documentation", "structure", "organization", "reference"]
---

# Documentation Map

This document defines the structure, organization, and purpose of all documentation in the Lambda Dev project. It serves as a reference guide for both human developers and AI assistants to understand where specific types of information should be located and how they should be used.

## Documentation Structure Overview

```
docs/
├── README.md                        # Documentation overview
├── documentation-map.md             # This file - defines documentation structure
├── documentation-rules.md           # Rules for creating documentation
├── project-plan.md                  # High-level project plan and task list
├── project-overview.md              # Project overview and architecture
├── architecture/                    # Architecture documentation
├── setup/                           # Setup and installation guides
├── guides/                          # Development and usage guides
├── reference/                       # Reference documentation
└── journal/                         # Development journal
    ├── tasks/                       # Task-specific documentation
    ├── issues/                      # Issue documentation
    ├── learnings/                   # Learning documentation
    └── progress/                    # Progress reports
```

## Root Level Documents

### README.md

**Purpose**: Provides an overview of the documentation available in the project and how to navigate it.

**Intended Audience**: All developers and AI assistants new to the project.

**Usage**: Read first to understand what documentation is available and how to find specific information.

### documentation-map.md

**Purpose**: Defines the structure, organization, and purpose of all documentation in the project.

**Intended Audience**: All developers and AI assistants working with project documentation.

**Usage**: Reference when creating new documentation or looking for specific types of information.

### documentation-rules.md

**Purpose**: Establishes rules and guidelines for creating documentation that is optimized for both human readers and AI assistants.

**Intended Audience**: Anyone creating or updating documentation.

**Usage**: Follow these rules when creating or updating documentation to ensure consistency and quality.

### project-plan.md

**Purpose**: Outlines the high-level plan for the project, including tasks, subtasks, and their status.

**Intended Audience**: Project managers, developers, and AI assistants working on the project.

**Usage**: Reference to understand the overall project structure, what tasks are planned, and their current status.

### project-overview.md

**Purpose**: Provides a high-level overview of the project, its goals, architecture, and components.

**Intended Audience**: New team members, stakeholders, and AI assistants.

**Usage**: Read to understand the project's purpose, architecture, and how different components interact.

## Directories and Their Purpose

### architecture/

**Purpose**: Contains detailed documentation about the system architecture, including diagrams, component descriptions, and design decisions.

**Key Files**:
- `overview.md`: High-level architecture overview
- `lambda-architecture.md`: Lambda function architecture
- `api-architecture.md`: API architecture
- `data-flow.md`: Data flow diagrams and descriptions

**Intended Audience**: Developers, architects, and AI assistants working on the system design.

**Usage**: Reference when designing new components, understanding existing components, or making architectural decisions.

### setup/

**Purpose**: Contains guides for setting up the development environment, installing dependencies, and configuring tools.

**Key Files**:
- `prerequisites.md`: Required software and tools
- `local-environment.md`: Local development environment setup
- `aws-configuration.md`: AWS configuration guide
- `troubleshooting.md`: Common setup issues and solutions

**Intended Audience**: Developers setting up the project for the first time.

**Usage**: Follow these guides to set up the development environment and troubleshoot common issues.

### guides/

**Purpose**: Contains detailed guides for specific development tasks, workflows, and processes.

**Key Files**:
- `git-workflow-guide.md`: Git workflow and merge strategies
- `lambda-development.md`: Lambda function development guide
- `api-development.md`: API development guide
- `testing-guide.md`: Testing guide

**Intended Audience**: Developers working on specific aspects of the project.

**Usage**: Follow these guides when performing specific development tasks to ensure consistency and quality.

### reference/

**Purpose**: Contains reference documentation for APIs, configuration options, scripts, and other technical details.

**Key Files**:
- `api-reference.md`: API endpoint reference
- `configuration-reference.md`: Configuration options reference
- `script-reference.md`: Script reference
- `aws-resources.md`: AWS resources reference

**Intended Audience**: Developers working with specific components or APIs.

**Usage**: Reference when you need detailed technical information about specific components.

### journal/

**Purpose**: Contains documentation of the development process, including tasks, issues, learnings, and progress reports.

**Subdirectories**:

#### tasks/

**Purpose**: Contains detailed documentation for each task in the project.

**Key Files**:
- `task-X-name.md`: Documentation for Task X

**Intended Audience**: Developers working on or reviewing specific tasks.

**Usage**: Reference to understand what was done for a specific task, what issues were encountered, and what was learned.

#### issues/

**Purpose**: Contains detailed documentation of issues encountered during development, their root causes, and solutions.

**Key Files**:
- `issue-X-name.md`: Documentation for Issue X

**Intended Audience**: Developers encountering similar issues or reviewing past issues.

**Usage**: Reference when troubleshooting similar issues or understanding past challenges.

#### learnings/

**Purpose**: Contains documentation of key insights, discoveries, and learnings from the development process.

**Key Files**:
- `learning-X-name.md`: Documentation for Learning X

**Intended Audience**: All team members interested in knowledge sharing.

**Usage**: Reference to understand key insights and best practices discovered during development.

#### progress/

**Purpose**: Contains progress reports documenting the development progress over time.

**Key Files**:
- `progress-journal-XX.md`: Progress report for a specific period

**Intended Audience**: Project managers, stakeholders, and team members tracking progress.

**Usage**: Reference to understand what progress was made during specific periods and what challenges were encountered.

## Document Types and Templates

Each type of document follows a specific template defined in the documentation-rules.md file. These templates ensure consistency and make it easier for both humans and AI to find and use information.

### Task Documentation

Documents what was done for a specific task, what issues were encountered, and what was learned.

### Issue Documentation

Documents issues encountered during development, their root causes, and solutions.

### Learning Documentation

Documents key insights, discoveries, and best practices from the development process.

### Progress Reports

Documents the development progress over time, including what was accomplished, what challenges were encountered, and what's planned next.

### Guides

Provide detailed instructions for specific development tasks, workflows, and processes.

### Reference Documentation

Provides detailed technical information about specific components, APIs, or configuration options.

## Usage Guidelines

### For Human Developers

1. **Creating Documentation**: Follow the templates and rules in documentation-rules.md.
2. **Finding Information**: Use this map to locate the appropriate document type.
3. **Updating Documentation**: Keep documentation up to date as the project evolves.
4. **Reviewing Documentation**: Ensure documentation follows the established rules and templates.

### For AI Assistants

1. **Understanding Context**: Use this map to understand the project's documentation structure.
2. **Locating Information**: Reference the appropriate document type based on the information needed.
3. **Creating Documentation**: Follow the templates and rules in documentation-rules.md.
4. **Suggesting Improvements**: Identify gaps or inconsistencies in documentation and suggest improvements.

## Metadata
- **Author**: Lambda Dev Team
- **Last Updated**: 2025-04-20
- **Status**: Approved
