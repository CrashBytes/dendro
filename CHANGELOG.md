# Changelog

All notable changes to dendro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-14

### Changed
- 🔄 **BREAKING**: Converted project from CommonJS to ESM (ES Modules)
- ⬆️ Updated chalk from v4.1.2 to v5.6.2 (major version upgrade)
- 📦 Updated commander to v14.0.2 (already latest)
- 🔧 Added `"type": "module"` to package.json
- 📝 Updated all imports to use ESM syntax (`import`/`export` instead of `require`/`module.exports`)
- 🔗 Updated relative imports to include `.js` extensions for ESM compatibility

### Migration Notes
- Node.js 20+ required (already specified in engines)
- If you were importing this package, update your code to use ESM imports
- All functionality remains the same, only the module system changed

## [1.0.1] - 2025-10-13

### Fixed
- Updated all GitHub repository links from dendron to dendro
- Added repository, bugs, and homepage fields to package.json
- Corrected GitHub URLs in README.md and CHANGELOG.md

## [1.0.0] - 2025-10-13

### Added
- Initial release of dendro 🌳
- Beautiful directory tree visualization with Unicode box-drawing characters
- Smart file type icons for 30+ file types
- CLI with flexible options (depth control, filtering, etc.)
- Programmatic API for Node.js integration
- Statistics display (file and directory counts)
- Smart default exclusions (node_modules, .git, etc.)
- Regex-based pattern exclusion
- Hidden file support with `-a` flag
- Full path display option
- Plain text mode (no icons)
- Comprehensive documentation and examples

### Features
- 📁 Directory visualization
- 🎨 File type icons
- ⚡ Fast directory traversal
- 🎯 Pattern-based filtering
- 📊 Built-in statistics
- 🔧 Both CLI and API

[1.1.0]: https://github.com/CrashBytes/dendro/releases/tag/v1.1.0
[1.0.1]: https://github.com/CrashBytes/dendro/releases/tag/v1.0.1
[1.0.0]: https://github.com/CrashBytes/dendro/releases/tag/v1.0.0
