# Changelog

All notable changes to this project are recorded in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.3] - 2026-11-07

### Fixed

- The plugin did not work in the Claude desktop app. Version 0.1.1 skipped every run with the `print` or `sdk-preset` trait, and the desktop app has these traits. The plugin now skips only sessions that no screen shows (a headless `claude -p` run).

## [0.1.2] - 2026-11-07

### Changed

- The status line entry now reads `● on` after the `ste100` label, not `STE100`.

## [0.1.1] - 2026-11-07

### Changed

- The rules now apply only to chat replies. Code, comments, commit messages, pull request text, documentation, tool inputs and subagent prompts keep the project's own conventions.
- The rules now tell Claude not to drop steps, checks, tests or technical detail to make a reply shorter.
- The rules now keep exact technical terms.

### Fixed

- The plugin no longer changes the prompt in `claude -p` and SDK runs, where scripts can parse the output.

### Added

- Tests for the `prompt.compose` hook (`claude plugin test plugin`).

## [0.1.0] - 2026-11-07

### Added

- ASD-STE100 writing rules added to the system prompt (`prompt.compose` hook).
- `/ste`, `/ste on` and `/ste off` commands. The choice is kept across sessions.
- `STE100` status line entry while the style is on.
- Marketplace file for install with `/plugin install ste100 --marketplace Fanaperana/ste100`.

[Unreleased]: https://github.com/Fanaperana/ste100/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/Fanaperana/ste100/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/Fanaperana/ste100/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Fanaperana/ste100/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Fanaperana/ste100/releases/tag/v0.1.0
