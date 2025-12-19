const Homey = require('homey');

class HeatPumpDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('HeatPumpDriver has been initialized');
  }

  /**
   * onPair is called when the user starts pairing.
   */
  async onPair(session) {
    this.log('Pairing session started');
    
    session.setHandler('login', async (data) => {
      this.log('=== Pairing: Login Handler ===');
      this.log(`Received data keys: ${Object.keys(data).join(', ')}`);
      this.log(`Username from form: ${data.username}`);
      this.log(`Password provided: ${data.password ? 'yes' : 'no'}`);
      
      const api = this.homey.app.api;
      
      if (!api) {
        this.error('ERROR: api object is null/undefined');
        throw new Error('API not initialized');
      }
      
      try {
        await api.login(data.username, data.password);
        
        if (api.token) {
          this.log('Login successful, token present');
          return true; 
        } else {
          this.error('Login returned but no token present');
          throw new Error('Authentication failed (No token)');
        }
      } catch (err) {
        this.error('=== Login Handler Error ===');
        this.error(`Error: ${err.message}`);
        throw new Error(`Login failed: ${err.message}`);
      }
    });

    // Handle list_devices step
    session.setHandler('list_devices', async () => {
      this.log('Pairing: List devices');
      const api = this.homey.app.api;
      const modules = await api.getModules(); // Assumes getModules returns array
      
      // Map modules to Homey device objects
      return modules.map(mod => ({
        name: mod.name || `Heat Pump ${mod.id}`,
        data: {
          id: mod.id
        }
      }));
    });
  }

}

module.exports = HeatPumpDriver;
