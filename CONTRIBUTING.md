# Contributing to ste100

Thank you for your help. This document tells you how to report problems and how to send changes.

By contributing, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Report a bug

1. Search the [existing issues](https://github.com/Fanaperana/ste100/issues) first.
2. If no issue matches, [open a bug report](https://github.com/Fanaperana/ste100/issues/new?template=bug_report.yml).
3. Include your Claude Code version (`claude --version`), your operating system, and the steps to reproduce the problem.

## Suggest a change to the rules

The rules are the core of this plugin. When you suggest a change, give:

- The rule to add, change or remove.
- An example answer before and after the change.
- The part of ASD-STE100 that supports the change, if there is one.

## Send a pull request

1. Fork the repository and create a branch from `main`.
2. Make your change. Keep each pull request to one topic.
3. Validate the plugin and the marketplace:
   ```bash
   claude plugin validate plugin
   claude plugin validate .
   claude plugin test plugin
   ```
4. Test the plugin in a real session:
   ```bash
   claude --plugin-dir plugin
   ```
   Ask Claude a question and make sure that the answer follows the rules. Make sure that `/ste on` and `/ste off` work.
5. Add a line to [CHANGELOG.md](CHANGELOG.md) under **Unreleased**.
6. Open the pull request and fill in the template.

## Style for this repository

- Write documentation in Simplified Technical English, like the plugin output.
- Use TypeScript with strict types in `plugin/hooks/`.
- Do not add runtime dependencies. A hooks module has no Node and no DOM.
- Do not commit keys, tokens or personal data.

## Versioning

This project uses [Semantic Versioning](https://semver.org/). The version is in [`plugin/.claude-plugin/plugin.json`](plugin/.claude-plugin/plugin.json).
