---
title: "Branch Structure"
date: "2025-04-20"
last_updated: "2025-04-20"
status: "approved"
tags: ["git", "branches", "workflow"]
---

# Branch Structure

This document outlines the current branch structure of the Lambda Dev project.

## Current Branches

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/task-1-environment`: Feature branch for Task 1: Local Development Environment
- `tasks/local-dev-environment`: Legacy task branch (to be deprecated)
- `tasks/project-structure-setup`: Legacy task branch (to be deprecated)

## Branch Strategy

We follow the branching strategy outlined in the [Git Workflow and Merge Strategies Guide](./guides/git-workflow-guide.md).

### Branch Types

1. **`main` Branch**
   - The production-ready code
   - Always stable and deployable
   - Protected from direct commits
   - Only merged from `release` or `hotfix` branches

2. **`develop` Branch**
   - The integration branch for features
   - Contains the latest development code
   - Relatively stable but not production-ready
   - Base branch for feature branches

3. **`feature/*` Branches**
   - Created from `develop`
   - One branch per feature or task
   - Isolated environment for development
   - Merged back to `develop` when complete

4. **`hotfix/*` Branches**
   - Created from `main`
   - For urgent fixes to production
   - Merged to both `main` and `develop`

5. **`release/*` Branches**
   - Created from `develop` when preparing a release
   - For final testing and bug fixes
   - Merged to `main` when ready for production
   - Also merged back to `develop`

## Transition Plan

We are transitioning from the legacy task-based branches to the new feature-based branching strategy. The steps are:

1. Keep the `develop` branch as the integration branch
2. Create feature branches from `develop` for new work
3. Merge feature branches back to `develop` when complete
4. Deprecate the legacy task branches

## Metadata
- **Author**: Lambda Dev Team
- **Last Updated**: 2025-04-20
- **Status**: Approved
