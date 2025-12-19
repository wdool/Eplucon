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
    
    // Example: Trigger when temperature changes
    // These should ideally be defined in .homeycompose/flow/triggers/
  }

}

module.exports = EpluconApp;
