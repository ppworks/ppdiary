# Changelog

All notable changes to this project will be documented in this file.


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

## v1.0.2 - 2025-08-29

### Fixed
- Migration issues

## v1.0.1 - 2025-08-29

### Fixed
- Migration issues

## v1.0.0 - 2025-08-29

### Added
- Initial release of ppdiary MCP server
- Basic diary CRUD operations (create, read, update, delete)
- Keyword search functionality
- Pagination support
- SQLite database storage
- Docker support
- MCP tools: get_diary_list, get_diary, create_diary, update_diary, delete_diary
