# Documentation Rules for Dual-Optimized Content

## Overview

This document establishes the formal rules for creating documentation that is optimized for both human readers and Large Language Models (LLMs). Following these rules ensures our documentation is accessible, maintainable, and can be effectively processed by both humans and AI systems.

## Core Principles

1. **Dual Optimization**: All documentation must be designed for both human readability and LLM processing.
2. **Structured Hierarchy**: Information must follow a clear hierarchical structure.
3. **Consistent Formatting**: All documents must use consistent formatting and structure.
4. **Explicit Metadata**: Include structured metadata to provide context and improve searchability.
5. **Versioned Content**: All documentation must be versioned and dated.

## Document Structure Rules

### Rule 1: Directory Organization

1.1. All documentation must be organized in a logical directory structure.
1.2. Each directory must contain a README.md file explaining its purpose.
1.3. Directory names must be lowercase, hyphenated, and descriptive.
1.4. Specialized content must be grouped in dedicated directories.

### Rule 2: File Naming

2.1. All documentation files must use the .md extension (Markdown).
2.2. Filenames must be lowercase, hyphenated, and descriptive.
2.3. Filenames must not contain spaces or special characters.
2.4. Filenames should indicate the content type (e.g., guide-aws-setup.md, reference-scripts.md).

### Rule 3: Document Metadata

3.1. All documents must include YAML frontmatter with metadata.
3.2. Required metadata fields include:
   - title: The document title
   - date: Creation date (YYYY-MM-DD)
   - last_updated: Last update date (YYYY-MM-DD)
   - status: Document status (draft, review, approved)
   - tags: Relevant keywords for categorization
3.3. Optional metadata fields include:
   - author: Document author(s)
   - reviewers: Document reviewer(s)
   - version: Document version
   - dependencies: Related documents or prerequisites

### Rule 4: Document Headers

4.1. All documents must have a level 1 heading (# Title) that matches the title in the metadata.
4.2. Section headers must use appropriate heading levels (##, ###, ####).
4.3. Headers must be descriptive and follow a consistent naming pattern.
4.4. Headers must not skip levels (e.g., h1 to h3 without h2).

## Content Formatting Rules

### Rule 5: Text Formatting

5.1. Use plain language and avoid jargon unless necessary.
5.2. Define acronyms and technical terms on first use.
5.3. Use consistent terminology throughout all documentation.
5.4. Maintain a glossary of terms in a central location.
5.5. Use emphasis (italic, bold) consistently and sparingly.

### Rule 6: Lists and Tables

6.1. Use numbered lists for sequential steps or prioritized items.
6.2. Use bullet lists for unordered collections of items.
6.3. Tables must include headers and consistent formatting.
6.4. Complex information should be structured in tables when appropriate.

### Rule 7: Code Blocks

7.1. All code must be enclosed in proper Markdown code blocks with language specified.
7.2. Code blocks must include descriptive comments.
7.3. Code examples must be complete and functional.
7.4. Include expected output when relevant.

### Rule 8: Links and References

8.1. Use relative links for internal documentation references.
8.2. Use absolute links for external references.
8.3. All links must have descriptive text, not "click here" or URLs as text.
8.4. Include a References section at the end of documents with additional resources.

## Content Type Rules

### Rule 9: Task Documentation

9.1. Task documentation must follow the established template.
9.2. Tasks must be broken down into clear subtasks.
9.3. Each subtask must include verification criteria.
9.4. Include issues encountered and their solutions.

### Rule 10: Issue Documentation

10.1. Issue documentation must follow the established template.
10.2. Include clear problem statements and symptoms.
10.3. Document root cause analysis and resolution steps.
10.4. Include prevention strategies for future reference.

### Rule 11: Learning Documentation

11.1. Learning documentation must follow the established template.
11.2. Clearly state the context in which the learning occurred.
11.3. Highlight key insights and practical applications.
11.4. Include code examples when relevant.

### Rule 12: Reference Documentation

12.1. Reference documentation must be comprehensive and detailed.
12.2. Include examples for all referenced items.
12.3. Structure content for easy lookup (alphabetical, categorical).
12.4. Keep reference documentation updated with the latest information.

## LLM Optimization Rules

### Rule 13: Semantic Structure

13.1. Use semantic HTML elements in Markdown when possible.
13.2. Structure content with clear sections and subsections.
13.3. Use descriptive headers that convey the content's purpose.
13.4. Maintain a logical flow of information.

### Rule 14: Information Chunking

14.1. Break down complex information into digestible chunks.
14.2. Use consistent paragraph lengths (3-5 sentences recommended).
14.3. Group related information under appropriate headers.
14.4. Use transitional phrases between sections for context.

### Rule 15: Explicit Relationships

15.1. Clearly state relationships between concepts.
15.2. Use cross-references to connect related information.
15.3. Include prerequisite information or links to prerequisites.
15.4. Use consistent terminology when referring to related concepts.

### Rule 16: Structured Data

16.1. Use structured formats for data (tables, lists, code blocks).
16.2. Include structured examples for complex concepts.
16.3. Use consistent data formats throughout documentation.
16.4. Provide context for data examples.

## Maintenance Rules

### Rule 17: Version Control

17.1. All documentation must be stored in version control.
17.2. Significant changes must be documented in a changelog.
17.3. Include the last updated date in the document metadata.
17.4. Maintain historical versions of critical documentation.

### Rule 18: Review Process

18.1. All documentation must be reviewed before being considered final.
18.2. Reviews must check for adherence to these documentation rules.
18.3. Technical accuracy must be verified by subject matter experts.
18.4. Update the reviewers field in the metadata after review.

### Rule 19: Documentation Testing

19.1. Test all code examples to ensure they work as documented.
19.2. Verify all links are functional.
19.3. Check that all referenced files and paths exist.
19.4. Validate that procedures can be followed as written.

### Rule 20: Continuous Improvement

20.1. Regularly review and update documentation.
20.2. Incorporate feedback from users and LLM interactions.
20.3. Refine documentation based on common questions or issues.
20.4. Update documentation when related code or processes change.

## Implementation Guidelines

To implement these rules:

1. **Create Templates**: Develop templates for each document type that follow these rules.
2. **Documentation Linting**: Use Markdown linters to enforce formatting rules.
3. **Review Checklists**: Create checklists based on these rules for documentation reviews.
4. **Automation**: Implement automated checks for basic rule compliance.
5. **Training**: Provide training on these rules for all contributors.

## Conclusion

Following these documentation rules will ensure our content is optimized for both human readers and LLMs, making it more valuable, accessible, and maintainable. These rules should be considered living guidelines that can evolve as our understanding of documentation needs and LLM capabilities changes.
