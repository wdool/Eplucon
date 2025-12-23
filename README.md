# Eplucon Heat Pump for Homey

Monitor your Eplucon Ecoforest Heat Pump directly from your Homey smart home hub.

## Features

- **47 real-time sensors** matching the Home Assistant integration
- Temperature monitoring (indoor, outdoor, hot water, brine, heating, refrigerant)
- DG1 and Smart Grid signals (SG2, SG3, SG4)
- Hot water production status and settings
- Energy statistics (current power, import/export totals, monthly stats)
- Pressure monitoring (CV, brine, refrigerant)
- Operating hours and compressor starts
- Alarm status monitoring
- Automatic polling every 60 seconds
- Flow card support for automations

## Supported Devices

- Eplucon Ecoforest Heat Pumps (via Eplucon Portal)

## Requirements

- Homey Pro with firmware 12.0.0 or higher
- Active Eplucon Portal account

## Installation

### From Homey App Store (Recommended)
1. Open the Homey app
2. Go to Apps > Search for "Eplucon"
3. Install the app
4. Add your heat pump device using your Eplucon Portal credentials

### Development Installation
```bash
# Install Homey CLI
npm install -g homey

# Login to your Homey
homey login

# Clone and install
cd homey-app
npm install

# Run for testing
homey app run

# Install permanently
homey app install
```

## Capabilities (47 Total)

### Temperature Sensors (12)
| Capability | API Field | Unit |
|------------|-----------|------|
| Indoor Temperature | indoor_temperature | C |
| Target Temperature | configured_indoor_temperature | C |
| Outdoor Temperature | outdoor_temperature | C |
| Hot Water Temperature | ww_temperature | C |
| WW Configured | ww_temperature_configured | C |
| Brine In | brine_in_temperature | C |
| Brine Out | brine_out_temperature | C |
| Heating In | heating_in_temperature | C |
| Heating Out | heating_out_temperature | C |
| Condensation Temperature | condensation_temperature | C |
| Evaporation Temperature | evaporation_temperature | C |
| Inverter Temperature | inverter_temperature | C |

### Pressure Sensors (4)
| Capability | API Field | Unit |
|------------|-----------|------|
| CV Pressure | cv_pressure | bar |
| Brine Pressure | brine_pressure | bar |
| Press Gas Pressure | press_gas_pressure | bar |
| Suction Gas Pressure | suction_gas_pressure | bar |

### Refrigerant Sensors (4)
| Capability | API Field | Unit |
|------------|-----------|------|
| Press Gas Temperature | press_gas_temperature | C |
| Suction Gas Temperature | suction_gas_temperature | C |
| Overheating | overheating | K |
| Expansion Valve Position | position_expansion_ventil | % |

### Smart Grid & DG1 Signals (4)
| Capability | API Field |
|------------|-----------|
| DG1 Active | dg1 |
| SG2 | sg2 |
| SG3 | sg3 |
| SG4 | sg4 |

### Operational Sensors (6)
| Capability | API Field | Unit |
|------------|-----------|------|
| Compressor Speed | compressor_speed | RPM |
| Operating Hours | operating_hours | hours |
| Number of Starts | number_of_starts | count |
| Vent RPM | act_vent_rpm | RPM |
| Brine Pump | brine_circulation_pump | % |
| Production Pump | production_circulation_pump | % |

### Mode & Status (6)
| Capability | API Field |
|------------|-----------|
| Operation Mode | operation_mode |
| Heating Mode | heating_mode |
| Heating State | current_heating_state |
| Heating Pump State | current_heating_pump_state |
| Alarm Active | alarm_active |
| Active WW Request | active_requests_ww |

### Hot Water Status (2)
| Capability | API Field |
|------------|-----------|
| Warm Water | warmwater |
| Domestic Hot Water | warmwater |

### Energy Sensors (6)
| Capability | API Field | Unit |
|------------|-----------|------|
| Total Active Power | total_active_power | W |
| Energy Delivered | energy_delivered | kWh |
| Energy Usage | energy_usage | kWh |
| Import Energy | import_energy | kWh |
| Export Energy | export_energy | kWh |
| SPF | spf | ratio |

### Monthly Energy Statistics (3)
| Capability | Description | Unit |
|------------|-------------|------|
| Monthly Consumed | Previous month energy used | kWh |
| Monthly Heat | Previous month heat delivered | kWh |
| Monthly Cooling | Previous month cooling delivered | kWh |

## API Endpoints Used

The app uses the same API endpoints as the Home Assistant integration:

- `/api/v2/auth/login` - Authentication
- `/api/v2/econtrol/modules` - Device discovery
- `/api/v2/econtrol/modules/{id}/get_realtime_info` - Real-time sensor data
- `/api/v2/econtrol/modules/{id}/heatloading_status` - Heat loading status
- `/api/v2/econtrol/modules/{id}/heatpump_energy_statistics` - Monthly energy

## Flow Cards

### Conditions
- Temperature thresholds for all sensors
- Pressure level checks
- Hot water request status
- DG1/Smart Grid signal status

### Triggers
- Temperature changes
- Pressure changes
- Hot water status changes
- Alarm status changes

## Support

- Community: [Homey Community Forum](https://community.homey.app/t/app-pro-eplucon-ecoforest-warmtepomp/147455)
- Issues: [GitHub Issues](https://github.com/wdool/Eplucon/issues)
- Email: woutdool@gmail.com

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Credits

Based on the [Home Assistant Eplucon Integration](https://github.com/koenhendriks/ha-eplucon) by Koen Hendriks.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Wout van den Dool
