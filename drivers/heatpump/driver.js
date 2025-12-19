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
          // Store credentials for use in list_devices
          this.pairingCredentials = {
            username: data.username,
            password: data.password
          };
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

    session.setHandler('list_devices', async () => {
      this.log('=== Pairing: List Devices Handler ===');
      const api = this.homey.app.api;
      
      try {
        const modules = await api.getModules();
        this.log(`Received ${modules.length} modules`);
        
        const devices = modules.map(mod => {
          this.log(`Mapping module: id=${mod.id}, name=${mod.name}`);
          return {
            name: mod.name || `Heat Pump ${mod.id}`,
            data: {
              id: String(mod.id)
            },
            store: {
              username: this.pairingCredentials.username,
              password: this.pairingCredentials.password,
              moduleId: mod.id
            }
          };
        });
        
        this.log(`Returning ${devices.length} devices to Homey`);
        return devices;
      } catch (err) {
        this.error('=== List Devices Error ===');
        this.error(`Error: ${err.message}`);
        throw err;
      }
    });
  }

}

module.exports = HeatPumpDriver;
