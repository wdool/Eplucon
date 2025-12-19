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
      const stats = await api.getStatistics();
      
      if (!stats) return;

      this.log('Received stats:', JSON.stringify(stats));

      // Map Data Points including new Energy fields
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
            // Only update if changed to save resources/bandwidth
            if (this.getCapabilityValue(capability) !== parsedValue) {
               await this.setCapabilityValue(capability, parsedValue).catch(this.error);
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
