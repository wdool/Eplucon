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

  async setNumberCapability(capability, value) {
    if (!this.hasCapability(capability)) return;
    if (value === undefined || value === null) return;
    
    let numValue = value;
    if (typeof value === 'string') {
      numValue = parseFloat(value);
    }
    if (typeof numValue !== 'number' || isNaN(numValue)) return;
    
    try {
      const currentValue = this.getCapabilityValue(capability);
      if (currentValue !== numValue) {
        await this.setCapabilityValue(capability, numValue);
      }
    } catch (err) {
      this.error(`Failed to set ${capability}:`, err.message);
    }
  }

  async setStringCapability(capability, value) {
    if (!this.hasCapability(capability)) return;
    if (value === undefined || value === null) return;
    
    const strValue = String(value);
    
    try {
      const currentValue = this.getCapabilityValue(capability);
      if (currentValue !== strValue) {
        await this.setCapabilityValue(capability, strValue);
      }
    } catch (err) {
      this.error(`Failed to set ${capability}:`, err.message);
    }
  }

  async setBooleanCapability(capability, value) {
    if (!this.hasCapability(capability)) return;
    if (value === undefined || value === null) return;
    
    let boolValue = value;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      boolValue = lowerValue === 'true' || lowerValue === '1' || lowerValue === 'on' || lowerValue === 'yes';
    } else if (typeof value === 'number') {
      boolValue = value === 1 || value > 0;
    } else if (typeof value !== 'boolean') {
      boolValue = Boolean(value);
    }
    
    try {
      const currentValue = this.getCapabilityValue(capability);
      if (currentValue !== boolValue) {
        await this.setCapabilityValue(capability, boolValue);
      }
    } catch (err) {
      this.error(`Failed to set ${capability}:`, err.message);
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
        const numberCapabilities = {
          'measure_temperature.indoor': stats['Binnentemperatuur'],
          'target_temperature': stats['Ingestelde binnentemperatuur'],
          'measure_temperature.outdoor': stats['Buitentemp.'],
          'measure_temperature.hotwater': stats['WW temperatuur'],
          'ww_configured': stats['Ingestelde ww temperatuur'],
          'measure_pressure': stats['Cv druk'],
          'compressor_speed': stats['Compressorsnelheid'],
          'operating_hours': stats['Bedrijfsuren'],
          'number_of_starts': stats['Aantal starts'],
          'measure_temperature.brine_in': stats['Brine in temperatuur'],
          'measure_temperature.brine_out': stats['Brine out temperatuur'],
          'brine_pump': stats['Brine circulatiepomp'],
          'brine_pressure': stats['Brine druk'],
          'measure_temperature.heating_in': stats['Heating in temperatuur'],
          'measure_temperature.heating_out': stats['Heating out temperatuur'],
          'production_pump': stats['Productie circulatiepomp'],
          'vent_rpm': stats['Ventilator RPM'],
          'condensation_temperature': stats['Condensatietemperatuur'],
          'evaporation_temperature': stats['Verdampingstemperatuur'],
          'inverter_temperature': stats['Omvormertemperatuur'],
          'overheating': stats['Oververhitting'],
          'pressgas_pressure': stats['Persgas druk'],
          'pressgas_temperature': stats['Persgas temperatuur'],
          'suction_gas_pressure': stats['Zuiggas druk'],
          'suction_gas_temperature': stats['Zuiggas temperatuur'],
          'expansion_valve': stats['Positie expansieventiel'],
          'energy_delivered': stats['Geleverde energie'],
          'energy_usage': stats['Energieverbruik'],
          'import_energy': stats['Import energie'],
          'export_energy': stats['Export energie'],
          'total_active_power': stats['Totaal actief vermogen'],
          'spf': stats['SPF']
        };

        const stringCapabilities = {
          'operation_mode': stats['Bedrijfsmodus'] || stats['Bedrijfsmodus tekst'],
          'heating_mode': stats['Verwarmingsmodus'] || stats['Verwarmingsmodus tekst'],
          'heating_state': stats['Huidige verwarmingsstatus'],
          'heating_pump_state': stats['Huidige warmtepomp status']
        };

        const booleanCapabilities = {
          'alarm_active': stats['Alarm actief'],
          'active_ww_request': stats['Actieve ww aanvraag'],
          'warmwater': stats['Warm water'],
          'domestic_hot_water': stats['Sanitair warm water'],
          'dg1_active': stats['DG1'],
          'heatloading_active': stats['Warmtelading actief'],
          'heatloading_heating': stats['Warmtelading voor verwarming'],
          'sg2': stats['SG2'],
          'sg3': stats['SG3'],
          'sg4': stats['SG4']
        };

        for (const [capability, value] of Object.entries(numberCapabilities)) {
          await this.setNumberCapability(capability, value);
        }

        for (const [capability, value] of Object.entries(stringCapabilities)) {
          await this.setStringCapability(capability, value);
        }

        for (const [capability, value] of Object.entries(booleanCapabilities)) {
          await this.setBooleanCapability(capability, value);
        }
      }

      if (energyStats) {
        await this.setNumberCapability('month_consumed', energyStats['consumed_energy']);
        await this.setNumberCapability('month_heat', energyStats['delivered_heat']);
        await this.setNumberCapability('month_cooling', energyStats['delivered_cooling']);
      }

    } catch (error) {
      this.error('Error polling data:', error);
      await this.setUnavailable(error.message).catch(this.error);
    }
  }

}

module.exports = HeatPumpDevice;
