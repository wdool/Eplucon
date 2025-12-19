const Homey = require('homey');

class HeatPumpDevice extends Homey.Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('HeatPumpDevice has been initialized');
    this.log('Device Name:', this.getName());
    this.log('Device Data:', this.getData());

    // Set polling interval (e.g., every minute)
    this.pollingInterval = this.homey.setInterval(this.pollData.bind(this), 60000);
    
    // Initial poll
    await this.pollData();
  }

  /**
   * onDeleted is called when the device is deleted.
   */
  onDeleted() {
    this.log('HeatPumpDevice has been deleted');
    if (this.pollingInterval) {
      this.homey.clearInterval(this.pollingInterval);
    }
  }

  /**
   * Helper to fetch data and update capabilities
   */
  async pollData() {
    try {
      const api = this.homey.app.api;
      // Ensure we have a token (might need re-login logic in real app)
      
      const stats = await api.getStatistics();
      
      if (stats) {
        // Map API fields to Capabilities
        // Binnentemperatuur -> measure_temperature.indoor
        if (stats.Binnentemperatuur) {
           await this.setCapabilityValue('measure_temperature.indoor', parseFloat(stats.Binnentemperatuur)).catch(this.error);
        }
        
        // Buitentemp -> measure_temperature.outdoor
        if (stats['Buitentemp.']) {
           await this.setCapabilityValue('measure_temperature.outdoor', parseFloat(stats['Buitentemp.'])).catch(this.error);
        }
        
        // Cv druk -> measure_pressure
        if (stats['Cv druk']) {
           await this.setCapabilityValue('measure_pressure', parseFloat(stats['Cv druk'])).catch(this.error);
        }
        
        // Actueel verbruik -> measure_power
        if (stats['Actueel verbruik']) {
           await this.setCapabilityValue('measure_power', parseFloat(stats['Actueel verbruik'])).catch(this.error);
        }

        this.log('Data polled successfully');
      }
    } catch (error) {
      this.error('Error polling data:', error);
      // set unavailable if persistent?
    }
  }

}

module.exports = HeatPumpDevice;
