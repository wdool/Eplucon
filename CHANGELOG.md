# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-12-23

### Added - Extended Sensor Coverage (30 Capabilities)
This release adds 19 new sensors based on available Eplucon Portal API data.

**Hot Water Sensors:**
- WW Temperature Configured (target hot water temp)
- Active WW Request (on/off indicator)
- Warm Water Active (production status)

**Compressor & Pump Sensors:**
- Compressor Speed (RPM)
- Vent RPM (ventilator speed)

**Refrigerant Sensors:**
- Condensation Temperature
- Evaporation Temperature
- Inverter Temperature
- Suction Gas Pressure & Temperature
- Press Gas Pressure & Temperature
- Expansion Valve Position

**Energy Sensors:**
- Total Active Power (current consumption in W)
- Import Energy (total kWh imported)
- Export Energy (total kWh produced)

### Changed
- Fixed API field name mappings based on actual Eplucon Portal response
- Improved capability value handling with type-aware parsing
- Corrected WW configured temperature (API returns value × 10)
- Converted power from kW to W for Homey compatibility

### Removed
- Sensors not available via statistics API endpoint (DG1, SG signals, operating hours, etc. - may be added in future if API endpoint discovered)

## [1.1.0] - 2025-12-23

### Added
- Compressor Speed (RPM) sensor
- Target Temperature sensor (configured indoor temperature)
- Operating Hours sensor (total runtime)
- Brine Circulation Pump (%) sensor
- Brine Pressure (bar) sensor
- Vent RPM sensor
- Condensation Temperature sensor
- Evaporation Temperature sensor
- Inverter Temperature sensor
- Overheating (K) sensor
- Press Gas Pressure (bar) sensor
- Press Gas Temperature sensor

### Changed
- Reorganized capability order for better UX
- Added hasCapability checks for graceful handling of unavailable sensors

## [1.0.1] - 2025-12-20

### Removed
- Removed custom `heatpump_status` capability (unnecessary for heat pump monitoring)

### Fixed
- Cleaned up device initialization code

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
