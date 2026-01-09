# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.3] - 2026-01-09

### Added
- New `operation_mode_text` capability showing human-readable mode (Off/Heating/Cooling/Hot Water)
- Flow card trigger "When operation mode changes" with filter for specific modes
- SVG icons for all custom capabilities (signals, pumps, temperatures, pressures, energy, etc.)

### Fixed
- `total_active_power` now correctly displays in kW instead of W

## [1.3.2] - 2026-01-06

### Fixed
- Critical fix: Reverted capability identifier rename that broke existing devices
- Capability `vent_rpm` now correctly displays as "Vent Speed" with % unit (internal ID unchanged for compatibility)

## [1.3.1] - 2026-01-06

### Added
- Flow card trigger for DG1 heating on/off status changes
- Flow card trigger for hot water heating on/off status changes

### Changed
- Improved app image with lifestyle photo (heat pump with solar panels)
- Simplified README for App Store (removed development instructions)

### Fixed
- vent_rpm capability now shows % unit and "Vent Speed" title (community feedback - it's a percentage, not RPM)
- Overheating now correctly shows °C instead of K (community feedback)

## [1.3.0] - 2025-12-25

### Changed
- Changed App ID from `nl.eplucon.homey` to `nl.eplucon.heatpump` (App Store requirement)
- Removed unused `homey:manager:api` permission
- New app image showing heat pump installation (not just logo)
- New driver image showing device on white background
- Unique driver icon different from app icon

### Fixed
- Improved error messages during pairing (clearer feedback for login issues)
- Better handling of authentication errors (401/403 status codes)
- Added detailed logging for troubleshooting pairing problems
- Handle missing/empty credentials gracefully

## [1.2.1] - 2025-12-23

### Fixed
- Improved boolean capability handling for DG1, SG2-4, alarm status, and hot water signals
- Correctly parses JSON arrays, numeric strings, and various API response formats

## [1.2.0] - 2025-12-23

### Added - Extended Sensor Coverage (47 Capabilities)
This release matches the Home Assistant integration with 47 real-time sensors using the `/get_realtime_info` API endpoint.

**Smart Grid & DG1 Signals:**
- DG1 Active (grid signal indicator)
- SG2, SG3, SG4 (smart grid signals)
- Alarm Active (system alarm status)

**Hot Water Sensors:**
- WW Temperature Configured (target hot water temp)
- Active WW Request (on/off indicator)
- Warm Water Active (production status)
- Domestic Hot Water (alias for warmwater)

**Operational Sensors:**
- Operating Hours (total runtime)
- Number of Starts (compressor starts)
- Operation Mode
- Heating Mode
- Heating State
- Heating Pump State

**Compressor & Pump Sensors:**
- Compressor Speed (RPM)
- Brine Circulation Pump (%)
- Production Circulation Pump (%)
- Vent RPM (ventilator speed)

**Refrigerant Sensors:**
- Condensation Temperature
- Evaporation Temperature
- Inverter Temperature
- Suction Gas Pressure & Temperature
- Press Gas Pressure & Temperature
- Expansion Valve Position
- Overheating (K)

**Energy Sensors:**
- Energy Delivered (kWh)
- Energy Usage (kWh)
- Total Active Power (current consumption)
- Import Energy (total kWh imported)
- Export Energy (total kWh produced)
- SPF (Seasonal Performance Factor)

### Changed
- Switched from `/statistics` to `/get_realtime_info` API endpoint (same as HA integration)
- Added `getRealtimeInfo()` and `getHeatloadingStatus()` API methods
- Type-safe capability setters (setNumberCapability, setStringCapability, setBooleanCapability)
- Debug logging for first 2 polls to verify API response structure

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
