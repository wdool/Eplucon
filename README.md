# Eplucon Heat Pump for Homey

Monitor your Eplucon Ecoforest Heat Pump directly from your Homey smart home hub.

## Features

- **30 real-time sensors** from the Eplucon Portal API
- Temperature monitoring (indoor, outdoor, hot water, brine, heating, refrigerant)
- Hot water production status and settings
- Energy statistics (current power, import/export totals, monthly stats)
- Pressure monitoring (CV, brine, refrigerant)
- Compressor and ventilator status
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

## Capabilities (30 Total)

### Temperature Sensors (12)
| Capability | API Field | Unit |
|------------|-----------|------|
| Indoor Temperature | Binnentemperatuur | °C |
| Target Temperature | Ingestelde ruimte Temp. | °C |
| Outdoor Temperature | Buitentemp. | °C |
| Hot Water Temperature | WW temperatuur | °C |
| WW Configured | Ingestelde temp. WW | °C |
| Brine In | Brine in temperatuur | °C |
| Brine Out | Brine out temperatuur | °C |
| Heating In | Heating in temperatuur | °C |
| Heating Out | Heating out temperatuur | °C |
| Condensation Temperature | Condensatie temp. | °C |
| Evaporation Temperature | Verdamping temp. | °C |
| Inverter Temperature | Inverter temperatuur | °C |

### Pressure Sensors (4)
| Capability | API Field | Unit |
|------------|-----------|------|
| CV Pressure | Cv druk | bar |
| Brine Pressure | Brine druk | bar |
| Press Gas Pressure | Compressorafvoerdruk | bar |
| Suction Gas Pressure | Compressorzuigdruk | bar |

### Refrigerant Sensors (4)
| Capability | API Field | Unit |
|------------|-----------|------|
| Press Gas Temperature | Pers gas temperatuur | °C |
| Suction Gas Temperature | Zuig gas temperatuur | °C |
| Overheating | Oververhitting | K |
| Expansion Valve Position | Positie expansie ventiel | % |

### Operational Sensors (2)
| Capability | API Field | Unit |
|------------|-----------|------|
| Compressor Speed | Compressor toerental | RPM |
| Vent RPM | Act. vent. toerental | RPM |

### Hot Water Status (2)
| Capability | API Field |
|------------|-----------|
| Active WW Request | WW (1=on) |
| Warm Water Active | WW (1=on) |

### Energy Sensors (3)
| Capability | API Field | Unit |
|------------|-----------|------|
| Total Active Power | Actueel verbruik | W |
| Import Energy | Totaal import energie | kWh |
| Export Energy | Totaal geproduceerde energie | kWh |

### Monthly Energy Statistics (3)
| Capability | Description | Unit |
|------------|-------------|------|
| Monthly Consumed | Previous month energy used | kWh |
| Monthly Heat | Previous month heat delivered | kWh |
| Monthly Cooling | Previous month cooling delivered | kWh |

## Flow Cards

### Conditions
- Temperature thresholds for all sensors
- Pressure level checks
- Hot water request status

### Triggers
- Temperature changes
- Pressure changes
- Hot water status changes

## Support

- Community: [Homey Community Forum](https://community.homey.app/t/app-pro-eplucon-ecoforest-warmtepomp/147455)
- Issues: [GitHub Issues](https://github.com/wdool/Eplucon/issues)
- Email: woutdool@gmail.com

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Credits

Inspired by the [Home Assistant Eplucon Integration](https://github.com/koenhendriks/ha-eplucon) by Koen Hendriks.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Wout van den Dool
