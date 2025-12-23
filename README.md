# Eplucon Heat Pump for Homey

Monitor your Eplucon Ecoforest Heat Pump directly from your Homey smart home hub.

## Features

- **48 sensors** - Full parity with the Home Assistant Eplucon integration
- Real-time temperature monitoring (indoor, outdoor, hot water, brine, heating, refrigerant)
- Status & mode monitoring (operation mode, heating mode, alarm status)
- Hot water monitoring (WW request, temperature, heatloading)
- Energy statistics (delivered, usage, import/export, power, SPF)
- Pressure monitoring (CV, brine, refrigerant)
- Pump & compressor status
- Smart Grid signals (SG2, SG3, SG4, DG1)
- Monthly energy statistics
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

## Capabilities (48 Total)

### Temperature Sensors (12)
| Capability | Description | Unit |
|------------|-------------|------|
| Indoor Temperature | Room temperature | °C |
| Target Temperature | Configured indoor temperature | °C |
| Outdoor Temperature | Outside temperature | °C |
| Hot Water Temperature | Domestic hot water | °C |
| WW Configured | Target hot water temperature | °C |
| Brine In/Out | Ground loop temperatures | °C |
| Heating In/Out | Heating circuit temperatures | °C |
| Condensation Temperature | Refrigerant condensation | °C |
| Evaporation Temperature | Refrigerant evaporation | °C |
| Inverter Temperature | Inverter unit temperature | °C |
| Press Gas Temperature | Pressurized gas temperature | °C |
| Suction Gas Temperature | Suction gas temperature | °C |

### Status & Mode Sensors (5)
| Capability | Description |
|------------|-------------|
| Operation Mode | Current operation mode |
| Heating Mode | Current heating mode |
| Heating State | Current heating state |
| Heating Pump State | Heat pump status |
| Alarm Active | Alarm indicator (on/off) |

### Hot Water Sensors (5)
| Capability | Description |
|------------|-------------|
| Active WW Request | Hot water request active (on/off) |
| Warm Water Active | Warm water production active |
| Domestic Hot Water | Domestic hot water active |
| Heatloading Active | Heat loading active |
| Heatloading for Heating | Heat loading for heating active |

### Operational Sensors (6)
| Capability | Description | Unit |
|------------|-------------|------|
| Compressor Speed | Compressor RPM | RPM |
| Vent RPM | Ventilation fan speed | RPM |
| Brine Circulation Pump | Brine pump percentage | % |
| Production Circulation Pump | Production pump percentage | % |
| Operating Hours | Total runtime | h |
| Number of Starts | Total compressor starts | - |
| Overheating | Superheat value | K |
| Expansion Valve Position | Valve opening | % |

### Pressure Sensors (4)
| Capability | Description | Unit |
|------------|-------------|------|
| CV Pressure | Central heating pressure | bar |
| Brine Pressure | Ground loop pressure | bar |
| Press Gas Pressure | High-side refrigerant pressure | bar |
| Suction Gas Pressure | Low-side refrigerant pressure | bar |

### Energy Sensors (6)
| Capability | Description | Unit |
|------------|-------------|------|
| Energy Delivered | Total energy delivered | kWh |
| Energy Usage | Total energy usage | kWh |
| Import Energy | Grid energy imported | kWh |
| Export Energy | Grid energy exported | kWh |
| Total Active Power | Current power consumption | W |
| SPF | Seasonal Performance Factor | - |

### Smart Grid Sensors (4)
| Capability | Description |
|------------|-------------|
| DG1 Active | Direct outlet DG1 status |
| SG2 | Smart Grid signal 2 |
| SG3 | Smart Grid signal 3 |
| SG4 | Smart Grid signal 4 |

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
- Status checks (WW request active, alarm active, etc.)

### Triggers
- Temperature changes
- Pressure changes
- Status changes

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
