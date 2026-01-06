const Homey = require('homey');
const EpluconAPI = require('./lib/EpluconAPI');

class EpluconApp extends Homey.App {

  async onInit() {
    this.log('EpluconApp has been initialized');
    
    // Initialize API client
    this.api = new EpluconAPI(this);
    
    // Register Flow Cards
    this._registerFlowCards();
  }
  
  _registerFlowCards() {
    this.log('Registering Flow Cards...');
    
    // DG1 (Heating) changed trigger
    this.homey.flow.getDeviceTriggerCard('dg1_changed')
      .registerRunListener(async (args, state) => {
        if (args.state === 'on') {
          return state.dg1_active === true;
        } else if (args.state === 'off') {
          return state.dg1_active === false;
        }
        return false;
      });
    
    // Hot water changed trigger
    this.homey.flow.getDeviceTriggerCard('hotwater_changed')
      .registerRunListener(async (args, state) => {
        if (args.state === 'on') {
          return state.warmwater_active === true;
        } else if (args.state === 'off') {
          return state.warmwater_active === false;
        }
        return false;
      });
    
    this.log('Flow Cards registered');
  }

}

module.exports = EpluconApp;
