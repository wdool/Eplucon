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
    
    // Handle login step
    session.setHandler('login', async (data) => {
      this.log('Pairing: Login attempt');
      const api = this.homey.app.api;
      try {
        await api.login(data.username, data.password);
        
        // IMPORTANT: Check isAuthenticated, not password existence
        if (api.token) {
          return true; 
        } else {
          throw new Error('Authentication failed (No token)');
        }
      } catch (err) {
        this.error(err);
        throw new Error('Invalid credentials');
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
