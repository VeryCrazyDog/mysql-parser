# Changelog
All notable changes to this module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this module adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-02-28
### Fixed
- `DELIMITER` command is now handled case insensitively.
### Deprecated
- Minimum supported Node.js version is now v14 to benefit from the nullish coalescing operator.

## [1.2.0] - 2020-05-25
### Added
- Added `.d.ts` declaration files.
- Added new option `retainComments` in `.split()` API.

## [1.1.0] - 2020-04-07
### Fixed
- `DELIMITER` command with no string following is now ignored in `.split()` API.
### Changed
- `.split()` API now combines more compatible statements than before.

## [1.0.1] - 2020-04-05
### Changed
- Updated README.

## [1.0.0] - 2020-04-05
### Added
- First release with `.split()` API.



[Unreleased]: https://github.com/VeryCrazyDog/mysql-parser/compare/2.0.0...HEAD
[2.0.0]: https://github.com/VeryCrazyDog/mysql-parser/compare/1.2.0...2.0.0
[1.2.0]: https://github.com/VeryCrazyDog/mysql-parser/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/VeryCrazyDog/mysql-parser/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/VeryCrazyDog/mysql-parser/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/VeryCrazyDog/mysql-parser/releases/tag/1.0.0
