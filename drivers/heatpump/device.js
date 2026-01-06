const Homey = require('homey');

class HeatPumpDevice extends Homey.Device {

  async onInit() {
    this.log('HeatPumpDevice initialized');
    this.pollCount = 0;
    
    // Track previous values for flow triggers
    this._previousDg1 = null;
    this._previousWarmwater = null;
    
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

  parseBooleanValue(value) {
    if (value === undefined || value === null) return null;
    
    let boolValue = false;
    
    if (typeof value === 'boolean') {
      boolValue = value;
    } else if (typeof value === 'number') {
      boolValue = value > 0;
    } else if (typeof value === 'string') {
      const trimmed = value.trim().toLowerCase();
      if (trimmed === '' || trimmed === '0' || trimmed === 'false' || trimmed === 'off' || trimmed === 'no' || trimmed === '[]') {
        boolValue = false;
      } else if (trimmed === '1' || trimmed === 'true' || trimmed === 'on' || trimmed === 'yes') {
        boolValue = true;
      } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const arr = JSON.parse(trimmed);
          boolValue = Array.isArray(arr) && arr.length > 0;
        } catch {
          boolValue = trimmed !== '[]';
        }
      } else {
        boolValue = trimmed.length > 0;
      }
    } else if (Array.isArray(value)) {
      boolValue = value.length > 0;
    } else {
      boolValue = Boolean(value);
    }
    
    return boolValue;
  }

  async setBooleanCapability(capability, value) {
    if (!this.hasCapability(capability)) return;
    if (value === undefined || value === null) return;
    
    const boolValue = this.parseBooleanValue(value);
    if (boolValue === null) return;
    
    try {
      const currentValue = this.getCapabilityValue(capability);
      if (currentValue !== boolValue) {
        await this.setCapabilityValue(capability, boolValue);
      }
    } catch (err) {
      this.error(`Failed to set ${capability}:`, err.message);
    }
  }

  async triggerDg1Changed(newValue) {
    const boolValue = this.parseBooleanValue(newValue);
    if (boolValue === null) return;
    
    if (this._previousDg1 !== null && this._previousDg1 !== boolValue) {
      this.log(`DG1 changed: ${this._previousDg1} -> ${boolValue}`);
      const triggerCard = this.homey.flow.getDeviceTriggerCard('dg1_changed');
      await triggerCard.trigger(this, { dg1_active: boolValue }, { dg1_active: boolValue }).catch(this.error);
    }
    this._previousDg1 = boolValue;
  }

  async triggerHotwaterChanged(newValue) {
    const boolValue = this.parseBooleanValue(newValue);
    if (boolValue === null) return;
    
    if (this._previousWarmwater !== null && this._previousWarmwater !== boolValue) {
      this.log(`Hot water changed: ${this._previousWarmwater} -> ${boolValue}`);
      const triggerCard = this.homey.flow.getDeviceTriggerCard('hotwater_changed');
      await triggerCard.trigger(this, { warmwater_active: boolValue }, { warmwater_active: boolValue }).catch(this.error);
    }
    this._previousWarmwater = boolValue;
  }

  async pollData() {
    try {
      const api = this.homey.app.api;
      this.pollCount++;
      
      const realtimeInfo = await api.getRealtimeInfo().catch(err => {
        this.error('Realtime Info Error:', err.message);
        return null;
      });
      
      let energyStats = null;
      if (this.pollCount % 60 === 1) {
        energyStats = await api.getPreviousMonthEnergyStatistics().catch(err => {
          this.error('Energy Stats Error:', err.message);
          return null;
        });
      }
      
      if (realtimeInfo) {
        if (this.pollCount <= 2) {
          this.log('=== Realtime Info Fields ===');
          this.log(JSON.stringify(Object.keys(realtimeInfo), null, 2));
          this.log('=== Full Realtime Info ===');
          this.log(JSON.stringify(realtimeInfo, null, 2));
        }

        const numberCapabilities = {
          'measure_temperature.indoor': realtimeInfo.indoor_temperature,
          'target_temperature': realtimeInfo.configured_indoor_temperature,
          'measure_temperature.outdoor': realtimeInfo.outdoor_temperature,
          'measure_temperature.hotwater': realtimeInfo.ww_temperature,
          'ww_configured': realtimeInfo.ww_temperature_configured,
          'measure_pressure': realtimeInfo.cv_pressure,
          'compressor_speed': realtimeInfo.compressor_speed,
          'operating_hours': realtimeInfo.operating_hours,
          'number_of_starts': realtimeInfo.number_of_starts,
          'measure_temperature.brine_in': realtimeInfo.brine_in_temperature,
          'measure_temperature.brine_out': realtimeInfo.brine_out_temperature,
          'brine_pump': realtimeInfo.brine_circulation_pump,
          'brine_pressure': realtimeInfo.brine_pressure,
          'measure_temperature.heating_in': realtimeInfo.heating_in_temperature,
          'measure_temperature.heating_out': realtimeInfo.heating_out_temperature,
          'production_pump': realtimeInfo.production_circulation_pump,
          'vent_rpm': realtimeInfo.act_vent_rpm,
          'condensation_temperature': realtimeInfo.condensation_temperature,
          'evaporation_temperature': realtimeInfo.evaporation_temperature,
          'inverter_temperature': realtimeInfo.inverter_temperature,
          'overheating': realtimeInfo.overheating,
          'pressgas_pressure': realtimeInfo.press_gas_pressure,
          'pressgas_temperature': realtimeInfo.press_gas_temperature,
          'suction_gas_pressure': realtimeInfo.suction_gas_pressure,
          'suction_gas_temperature': realtimeInfo.suction_gas_temperature,
          'expansion_valve': realtimeInfo.position_expansion_ventil,
          'energy_delivered': realtimeInfo.energy_delivered,
          'energy_usage': realtimeInfo.energy_usage,
          'import_energy': realtimeInfo.import_energy,
          'export_energy': realtimeInfo.export_energy,
          'total_active_power': realtimeInfo.total_active_power,
          'spf': realtimeInfo.spf
        };

        const stringCapabilities = {
          'operation_mode': realtimeInfo.operation_mode,
          'heating_mode': realtimeInfo.heating_mode,
          'heating_state': realtimeInfo.current_heating_state,
          'heating_pump_state': realtimeInfo.current_heating_pump_state
        };

        const booleanCapabilities = {
          'alarm_active': realtimeInfo.alarm_active,
          'active_ww_request': realtimeInfo.active_requests_ww,
          'warmwater': realtimeInfo.warmwater,
          'domestic_hot_water': realtimeInfo.warmwater,
          'dg1_active': realtimeInfo.dg1,
          'sg2': realtimeInfo.sg2,
          'sg3': realtimeInfo.sg3,
          'sg4': realtimeInfo.sg4
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

        // Trigger flow cards for DG1 and hot water changes
        await this.triggerDg1Changed(realtimeInfo.dg1);
        await this.triggerHotwaterChanged(realtimeInfo.warmwater);
      }

      if (energyStats) {
        await this.setNumberCapability('month_consumed', energyStats.consumed_energy);
        await this.setNumberCapability('month_heat', energyStats.delivered_heat);
        await this.setNumberCapability('month_cooling', energyStats.delivered_cooling);
      }

    } catch (error) {
      this.error('Error polling data:', error);
      await this.setUnavailable(error.message).catch(this.error);
    }
  }

}

module.exports = HeatPumpDevice;
