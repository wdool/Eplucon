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
      
      // Parallel fetch for standard stats and energy stats
      const [stats, energyStats] = await Promise.all([
        api.getStatistics().catch(err => {
          this.error('Stats Error:', err);
          return null;
        }),
        api.getEnergyStatistics().catch(err => {
          this.error('Energy Stats Error:', err);
          return null;
        })
      ]);
      
      if (stats) {
        this.log('Received stats');
        // Map standard stats
        const map = {
          'measure_temperature.indoor': stats['Binnentemperatuur'],
          'measure_temperature.outdoor': stats['Buitentemp.'],
          'measure_temperature.hotwater': stats['WW temperatuur'],
          'measure_temperature.dg1': stats['Actuele temp. DG1'],
          'measure_temperature.brine_in': stats['Brine in temperatuur'],
          'measure_temperature.brine_out': stats['Brine out temperatuur'],
          'measure_temperature.heating_in': stats['Heating in temperatuur'],
          'measure_temperature.heating_out': stats['Heating out temperatuur'],
          'measure_pressure': stats['Cv druk'],
          'measure_power': stats['Actueel verbruik'],
          'meter_power': stats['Totaal import energie'],
          'meter_power.produced': stats['Totaal geproduceerde energie']
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
        this.log('Received energy stats');
        // Map energy stats (Daily values)
        const energyMap = {
          'meter_power.daily_consumed': energyStats['consumed_energy'],
          'meter_power.daily_heat': energyStats['delivered_heat'],
          'meter_power.daily_cooling': energyStats['delivered_cooling']
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
