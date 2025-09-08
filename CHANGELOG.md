# Changelog

All notable changes to this project will be documented in this file.

## [v1.2.0] - 2025-09-08

### Added
- Prompts support with extract diary functionality
- Comprehensive tests for prompt functionality
- Dependabot configuration for automated dependency updates
- tsconfig.build.json to exclude test files from production build

### Changed
- Updated dependencies:
  - @biomejs/biome from 2.2.2 to 2.2.3
  - @modelcontextprotocol/sdk from 1.17.4 to 1.17.5
  - @types/node from 24.3.0 to 24.3.1
  - actions/setup-node from 4.4.0 to 5.0.0 in GitHub Actions
- Migrated Biome configuration to latest schema
- Improved GitHub Actions workflows with digest-based action references for security
- Enhanced README documentation

## [v1.1.0] - 2025-08-30

### Added
- Timezone support for date display via TZ environment variable
- Date formatter utility using cdate library
- Comprehensive tests for date formatting functionality
- Documentation for timezone configuration in README

### Changed
- Store dates in ISO 8601 format with UTC in database
- Display dates as ISO 8601 with timezone offset (e.g., 2025-08-29T21:30:00+09:00)
- Support both legacy SQLite datetime and new ISO formats

## [v1.0.3] - 2025-08-29

### Fixed
- updatedAt format issue

## [v1.0.2] - 2025-08-29

### Fixed
- Migration issues

## [v1.0.1] - 2025-08-29

### Fixed
- Migration issues

## [v1.0.0] - 2025-08-29

### Added
- Initial release of ppdiary MCP server
- Basic diary CRUD operations (create, read, update, delete)
- Keyword search functionality
- Pagination support
- SQLite database storage
- Docker support
- MCP tools: get_diary_list, get_diary, create_diary, update_diary, delete_diary
