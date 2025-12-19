# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-19

### Added
- Initial release
- Real-time temperature monitoring (8 sensors)
- CV pressure monitoring with 2 decimal precision
- Monthly energy statistics (consumed, heat, cooling)
- Automatic session restoration on app restart
- Flow card support for conditions and triggers
- Multi-language support (English and Dutch)

### Technical
- Polling interval: 60 seconds for real-time stats
- Monthly energy stats fetched once per hour
- Secure credential storage in device store
- Homey SDK v3 compatibility
