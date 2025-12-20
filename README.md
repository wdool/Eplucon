# Eplucon Heat Pump for Homey

Monitor your Eplucon Ecoforest Heat Pump directly from your Homey smart home hub.

## Features

- Real-time temperature monitoring (indoor, outdoor, hot water, brine, heating)
- CV pressure monitoring
- Monthly energy statistics (consumed, heat delivered, cooling delivered)
- Automatic polling every 60 seconds
- Flow card support for automations

## Supported Devices

- Eplucon Ecoforest Heat Pumps (via Eplucon Portal)

## Requirements

- Homey Pro (2023) or Homey Pro (Early 2023) with firmware 10.0.0 or higher
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

## Capabilities

| Capability | Description | Unit |
|------------|-------------|------|
| Indoor Temperature | Room temperature | °C |
| Outdoor Temperature | Outside temperature | °C |
| Hot Water Temperature | Domestic hot water | °C |
| Brine In/Out | Ground loop temperatures | °C |
| Heating In/Out | Heating circuit temperatures | °C |
| CV Pressure | Central heating pressure | bar |
| Monthly Consumed | Previous month energy used | kWh |
| Monthly Heat | Previous month heat delivered | kWh |
| Monthly Cooling | Previous month cooling delivered | kWh |

## Flow Cards

### Conditions
- Temperature thresholds for all sensors
- Pressure level checks

### Triggers
- Temperature changes
- Pressure changes

## Support

- Community: [Homey Community Forum](https://community.homey.app/t/app-pro-eplucon-ecoforest-warmtepomp/147455)
- Issues: [GitHub Issues](https://github.com/woutdool/homey-eplucon/issues)
- Email: woutdool@gmail.com

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Wout van den Dool
