---
title: "Git Workflow and Merge Strategies Guide"
date: "2025-04-20"
last_updated: "2025-04-20"
status: "approved"
tags: ["git", "workflow", "branching", "merging", "development"]
---

# Git Workflow and Merge Strategies Guide

This guide outlines our project's Git workflow, branching strategy, and merge approaches to maintain a clean, organized repository while preserving important development history.

## Branching Strategy

### Branch Structure

```
main
├── develop
│   ├── feature/task-1-environment
│   ├── feature/task-2-lambda
│   ├── feature/task-3-api
│   └── ...
├── hotfix/critical-bug
└── release/v1.0.0
```

### Branch Types and Purposes

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
   - Example: `feature/task-1-environment`

4. **`hotfix/*` Branches**
   - Created from `main`
   - For urgent fixes to production
   - Merged to both `main` and `develop`
   - Example: `hotfix/critical-bug`

5. **`release/*` Branches**
   - Created from `develop` when preparing a release
   - For final testing and bug fixes
   - Merged to `main` when ready for production
   - Also merged back to `develop`
   - Example: `release/v1.0.0`

## Development Workflow

### Starting a New Feature

1. Ensure you're on the latest `develop` branch:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. Create a new feature branch:
   ```bash
   git checkout -b feature/task-name
   ```

3. Develop the feature in isolation:
   - Make commits
   - Push to remote
   - Track progress in documentation

4. When the feature is complete:
   ```bash
   git checkout develop
   git pull origin develop  # Get latest changes
   git checkout feature/task-name
   git rebase develop       # Incorporate latest develop changes
   git checkout develop
   git merge feature/task-name  # Use appropriate merge strategy (see below)
   git push origin develop
   ```

5. Delete the feature branch when no longer needed:
   ```bash
   git branch -d feature/task-name
   git push origin --delete feature/task-name
   ```

### Handling Hotfixes

1. Create a hotfix branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/issue-name
   ```

2. Fix the issue and commit:
   ```bash
   git commit -m "Fix critical issue"
   ```

3. Merge to `main` and `develop`:
   ```bash
   git checkout main
   git merge hotfix/issue-name
   git push origin main
   
   git checkout develop
   git merge hotfix/issue-name
   git push origin develop
   ```

4. Delete the hotfix branch:
   ```bash
   git branch -d hotfix/issue-name
   git push origin --delete hotfix/issue-name
   ```

### Preparing a Release

1. Create a release branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. Make final adjustments and fixes:
   ```bash
   git commit -m "Prepare for v1.0.0 release"
   ```

3. Merge to `main` and tag the release:
   ```bash
   git checkout main
   git merge release/v1.0.0
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin main --tags
   ```

4. Merge back to `develop`:
   ```bash
   git checkout develop
   git merge release/v1.0.0
   git push origin develop
   ```

5. Delete the release branch:
   ```bash
   git branch -d release/v1.0.0
   git push origin --delete release/v1.0.0
   ```

## Merge Strategies

When merging feature branches into develop, we have different strategies available depending on the nature of the feature and its development history.

### 1. Preserving All Commits (Standard Merge)

When using a standard merge, all individual commits from the feature branch are preserved in the develop branch:

```bash
git checkout develop
git merge feature/task-name
```

**Pros:**
- Complete history is preserved
- Each step in the development process is visible
- Easier to track specific changes and their authors
- Makes it easier to revert individual changes if needed
- Maintains detailed context for each change

**Cons:**
- Can lead to a cluttered commit history
- Makes the main branch history harder to read
- Small "fix" commits can add noise
- Experimental or "work in progress" commits become part of the permanent history

### 2. Squashing Commits (Condensed History)

When squashing, all commits from the feature branch are combined into a single commit on the develop branch:

```bash
git checkout develop
git merge --squash feature/task-name
git commit -m "Feature: Implement task name (#123)"
```

**Pros:**
- Creates a clean, readable history on the main branches
- Each feature is represented by a single, well-described commit
- Easier to understand the high-level changes
- Removes experimental or "work in progress" commits
- Makes reverting entire features simpler

**Cons:**
- Loses the detailed development history
- Individual contributions may be less visible
- More difficult to track specific changes
- Can make it harder to understand the reasoning behind certain decisions

### 3. Non-Fast-Forward Merge (Create Merge Commit)

This approach creates a merge commit even when a fast-forward merge would be possible:

```bash
git checkout develop
git merge --no-ff feature/task-name
```

**Pros:**
- Preserves all commits from the feature branch
- Creates a clear merge commit that shows where the feature was integrated
- Maintains the branch structure in the history
- Easier to revert the entire feature if needed

**Cons:**
- Adds an extra merge commit
- Can make the history more complex

## Recommended Approach: Hybrid Strategy

We recommend a hybrid approach that balances clean history with detailed information:

1. **For simple features or small tasks:**
   - Squash commits to keep the history clean
   - Write comprehensive commit messages that explain the changes

2. **For complex features or large tasks:**
   - Use a non-fast-forward merge (--no-ff) to preserve the detailed history
   - Ensure feature branch commits are well-organized before merging
   - Consider using a pull request description to summarize the changes

3. **Always include issue/task references:**
   - Whether squashing or not, always reference the issue/task number
   - Example: "Feature: Implement local environment setup (#42)"

## Implementation in Workflow

### For Simple Features (Squash)

```bash
git checkout develop
git pull origin develop
git merge --squash feature/task-name
git commit -m "Feature: Implement task name (#123)"
git push origin develop
```

### For Complex Features (Preserve with Merge Commit)

```bash
git checkout develop
git pull origin develop
git merge --no-ff feature/task-name
git push origin develop
```

## Commit Message Guidelines

Regardless of the merge strategy, commit messages should follow these guidelines:

1. **Use a structured format**:
   ```
   <type>: <subject>

   <body>

   <footer>
   ```

2. **Types**:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code changes that neither fix bugs nor add features
   - `test`: Adding or modifying tests
   - `chore`: Changes to the build process or auxiliary tools

3. **Subject**:
   - Use imperative, present tense: "Add" not "Added" or "Adds"
   - Don't capitalize the first letter
   - No period at the end
   - Keep it under 50 characters

4. **Body**:
   - Explain what and why, not how
   - Include motivation for the change
   - Contrast with previous behavior

5. **Footer**:
   - Reference issues and pull requests
   - Note breaking changes

Example:
```
feat: add local environment setup script

This script automates the setup of the local development environment,
including Docker Compose configuration and AWS resource creation.

Closes #42
```

## Pull Request Process

1. **Create a pull request** from your feature branch to develop
2. **Fill out the pull request template**:
   - Title: Clear, concise description of the feature
   - Description: Summary of changes, implementation details, testing performed
   - Screenshots or examples if applicable
   - References to related issues or tasks
3. **Request reviews** from team members
4. **Address feedback** and make necessary changes
5. **Merge using the appropriate strategy** based on the guidelines above
6. **Delete the feature branch** after successful merge

## Branch Protection Rules

To enforce our workflow, we use the following branch protection rules:

1. **`main` branch**:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Restrict who can push to the branch
   - Do not allow force pushes

2. **`develop` branch**:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Do not allow force pushes

## Metadata
- **Author**: Lambda Dev Team
- **Last Updated**: 2025-04-20
- **Status**: Approved
