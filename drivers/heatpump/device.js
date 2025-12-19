const Homey = require('homey');

class HeatPumpDevice extends Homey.Device {

  async onInit() {
    this.log('HeatPumpDevice initialized');
    // Poll every 1 minute
    this.pollingInterval = this.homey.setInterval(this.pollData.bind(this), 60000);
    await this.pollData();
  }

  onDeleted() {
    if (this.pollingInterval) {
      this.homey.clearInterval(this.pollingInterval);
    }
  }

  async pollData() {
    try {
      const api = this.homey.app.api;
      
      // Parallel fetch for standard stats and monthly energy stats
      const [stats, energyStats] = await Promise.all([
        api.getStatistics().catch(err => {
          this.error('Stats Error:', err);
          return null;
        }),
        api.getPreviousMonthEnergyStatistics().catch(err => {
          this.error('Energy Stats Error:', err);
          return null;
        })
      ]);
      
      if (stats) {
        // Map standard stats
        const map = {
          'measure_temperature.indoor': stats['Binnentemperatuur'],
          'measure_temperature.hotwater': stats['WW temperatuur'],
          'measure_temperature.brine_in': stats['Brine in temperatuur'],
          'measure_temperature.brine_out': stats['Brine out temperatuur'],
          'measure_temperature.heating_in': stats['Heating in temperatuur'],
          'measure_temperature.heating_out': stats['Heating out temperatuur'],
          'measure_pressure': stats['Cv druk'],
          'measure_temperature.outdoor': stats['Buitentemp.']
        };

        for (const [capability, value] of Object.entries(map)) {
          if (value !== undefined && value !== null) {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
              if (this.getCapabilityValue(capability) !== parsedValue) {
                 await this.setCapabilityValue(capability, parsedValue).catch(this.error);
              }
            }
          }
        }
      }

      if (energyStats) {
        // Map energy stats (Monthly values)
        // Using custom capabilities defined in app.json
        const energyMap = {
          'month_consumed': energyStats['consumed_energy'],
          'month_heat': energyStats['delivered_heat'],
          'month_cooling': energyStats['delivered_cooling']
        };

        for (const [capability, value] of Object.entries(energyMap)) {
          if (value !== undefined && value !== null) {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
              if (this.getCapabilityValue(capability) !== parsedValue) {
                 await this.setCapabilityValue(capability, parsedValue).catch(this.error);
              }
            }
          }
        }
      }

    } catch (error) {
      this.error('Error polling data:', error);
      await this.setUnavailable(error.message).catch(this.error);
    }
  }

}

module.exports = HeatPumpDevice;
