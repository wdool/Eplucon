const Homey = require('homey');

class HeatPumpDevice extends Homey.Device {

  async onInit() {
    this.log('HeatPumpDevice initialized');
    this.pollCount = 0;
    
    await this.restoreSession();
    
    this.pollingInterval = this.homey.setInterval(this.pollData.bind(this), 60000);
    await this.pollData();
  }

  async restoreSession() {
    try {
      const username = this.getStoreValue('username');
      const password = this.getStoreValue('password');
      const moduleId = this.getStoreValue('moduleId');
      
      if (username && password) {
        this.log('Restoring session with stored credentials...');
        const api = this.homey.app.api;
        await api.login(username, password);
        
        if (moduleId) {
          api.moduleId = moduleId;
          this.log(`Restored module ID: ${moduleId}`);
        }
        
        this.log('Session restored successfully');
      } else {
        this.error('No stored credentials found');
      }
    } catch (error) {
      this.error('Failed to restore session:', error.message);
    }
  }

  onDeleted() {
    if (this.pollingInterval) {
      this.homey.clearInterval(this.pollingInterval);
    }
  }

  async pollData() {
    try {
      const api = this.homey.app.api;
      this.pollCount++;
      
      const stats = await api.getStatistics().catch(err => {
        this.error('Stats Error:', err.message);
        return null;
      });
      
      let energyStats = null;
      if (this.pollCount % 12 === 1) {
        energyStats = await api.getPreviousMonthEnergyStatistics().catch(err => {
          this.error('Energy Stats Error:', err.message);
          return null;
        });
      }
      
      if (stats) {
        const map = {
          'measure_temperature.indoor': stats['Binnentemperatuur'],
          'target_temperature': stats['Ingestelde binnentemperatuur'],
          'measure_temperature.outdoor': stats['Buitentemp.'],
          'measure_temperature.hotwater': stats['WW temperatuur'],
          'measure_pressure': stats['Cv druk'],
          'compressor_speed': stats['Compressorsnelheid'],
          'operating_hours': stats['Bedrijfsuren'],
          'measure_temperature.brine_in': stats['Brine in temperatuur'],
          'measure_temperature.brine_out': stats['Brine out temperatuur'],
          'brine_pump': stats['Brine circulatiepomp'],
          'brine_pressure': stats['Brine druk'],
          'measure_temperature.heating_in': stats['Heating in temperatuur'],
          'measure_temperature.heating_out': stats['Heating out temperatuur'],
          'vent_rpm': stats['Ventilator RPM'],
          'condensation_temperature': stats['Condensatietemperatuur'],
          'evaporation_temperature': stats['Verdampingstemperatuur'],
          'inverter_temperature': stats['Omvormertemperatuur'],
          'overheating': stats['Oververhitting'],
          'pressgas_pressure': stats['Persgas druk'],
          'pressgas_temperature': stats['Persgas temperatuur']
        };

        for (const [capability, value] of Object.entries(map)) {
          if (value !== undefined && value !== null) {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
              if (this.hasCapability(capability)) {
                if (this.getCapabilityValue(capability) !== parsedValue) {
                  await this.setCapabilityValue(capability, parsedValue).catch(this.error);
                }
              }
            }
          }
        }
      }

      if (energyStats) {
        const energyMap = {
          'month_consumed': energyStats['consumed_energy'],
          'month_heat': energyStats['delivered_heat'],
          'month_cooling': energyStats['delivered_cooling']
        };

        for (const [capability, value] of Object.entries(energyMap)) {
          if (value !== undefined && value !== null) {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
              if (this.hasCapability(capability)) {
                if (this.getCapabilityValue(capability) !== parsedValue) {
                  await this.setCapabilityValue(capability, parsedValue).catch(this.error);
                }
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
