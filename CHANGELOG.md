# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-20

### Added
- Initial release for Homey App Store
- Real-time temperature monitoring (8 sensors):
  - Indoor temperature (Binnentemperatuur)
  - Outdoor temperature (Buitentemp.)
  - Hot water temperature (WW temperatuur)
  - Brine in/out temperatures
  - Heating in/out temperatures
- CV pressure monitoring with 2 decimal precision
- Monthly energy statistics:
  - Previous month consumed energy (kWh)
  - Previous month heat delivered (kWh)
  - Previous month cooling delivered (kWh)
- Status indicator capability (user-settable)
- Automatic session restoration on app restart
- Multi-language support (English and Dutch)
- Homey Community Forum integration

### Technical
- Device class: `heatpump`
- Compatibility: Homey Pro firmware >=12.0.0
- Platform: local (Homey Pro only)
- SDK: v3
- Polling interval: 60 seconds for real-time stats
- Monthly energy stats: fetched once per hour
- Secure credential storage in device store

### Removed
- Broken app settings page (credentials now stored per-device during pairing)
