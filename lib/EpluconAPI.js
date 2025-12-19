const fetch = require('node-fetch');

class EpluconAPI {

  constructor(app) {
    this.app = app;
    this.baseUrl = 'https://portaal.eplucon.nl/api/v2';
    this.token = null;
    this.moduleId = null;
  }

  async login(username, password) {
    this.app.log('=== Eplucon Login Attempt ===');
    this.app.log(`Username: ${username}`);
    this.app.log(`Password length: ${password ? password.length : 0}`);
    
    try {
      const url = `${this.baseUrl}/auth/login`;
      this.app.log(`POST ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      this.app.log(`Response status: ${response.status} ${response.statusText}`);
      
      const bodyText = await response.text();
      this.app.log(`Response body: ${bodyText}`);
      
      if (!response.ok) {
        throw new Error(`Auth failed: ${response.status} ${response.statusText} - ${bodyText}`);
      }

      const body = JSON.parse(bodyText);
      this.token = body.access_token;
      
      if (!this.token) {
        this.app.log('WARNING: No access_token in response');
        this.app.log(`Response keys: ${Object.keys(body).join(', ')}`);
        throw new Error('No access_token in API response');
      }
      
      this.app.log('Authentication successful, token received');
      
      if (!this.moduleId) {
        await this.getModules();
      }
      
      return true;
    } catch (error) {
      this.app.error('=== Login Error ===');
      this.app.error(`Error name: ${error.name}`);
      this.app.error(`Error message: ${error.message}`);
      this.app.error(`Error stack: ${error.stack}`);
      throw error;
    }
  }

  async getModules() {
    this.app.log('=== Fetching Modules ===');
    if (!this.token) throw new Error('Not authenticated');

    const url = `${this.baseUrl}/econtrol/modules`;
    this.app.log(`GET ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    });

    this.app.log(`Modules response status: ${response.status}`);
    const bodyText = await response.text();
    this.app.log(`Modules response body: ${bodyText}`);
    
    if (!response.ok) throw new Error(`Failed to fetch modules: ${response.status} - ${bodyText}`);
    
    const response_data = JSON.parse(bodyText);
    this.app.log(`Response has data property: ${!!response_data.data}`);
    
    const modules = response_data.data || [];
    this.app.log(`Modules count: ${modules.length}`);
    
    if (modules && modules.length > 0) {
      this.moduleId = modules[0].id; 
      this.app.log(`Found Module ID: ${this.moduleId}`);
      this.app.log(`Module name: ${modules[0].name || 'unnamed'}`);
      return modules;
    }
    
    this.app.log('WARNING: No modules found in response');
    return [];
  }

  async getStatistics() {
    if (!this.token || !this.moduleId) throw new Error('Not authenticated or no module ID');

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // 0-indexed in JS
    const year = date.getFullYear();

    const url = `${this.baseUrl}/econtrol/modules/${this.moduleId}/statistics?range=day&day=${day}&month=${month}&year=${year}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch statistics');

    const data = await response.json();
    
    if (data && data.data && data.data.data && Array.isArray(data.data.data) && data.data.data.length > 0) {
      const statsArray = data.data.data;
      return statsArray[statsArray.length - 1];
    }
    
    return null;
  }

  async getPreviousMonthEnergyStatistics() {
    if (!this.token || !this.moduleId) throw new Error('Not authenticated or no module ID');

    const date = new Date();
    // Calculate previous month
    let month = date.getMonth(); 
    let year = date.getFullYear();
    
    if (month === 0) {
      month = 12;
      year = year - 1;
    } 
    
    const url = `${this.baseUrl}/econtrol/modules/${this.moduleId}/heatpump_energy_statistics?year=${year}&month=${month}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
       this.app.log('Failed to fetch energy statistics (non-critical)');
       return null;
    }

    const body = await response.json();
    
    if (body && body.data && Array.isArray(body.data)) {
      // Sum all daily values for the month to get the monthly total
      let totalConsumed = 0;
      let totalHeat = 0;
      let totalCooling = 0;
      
      body.data.forEach(day => {
        totalConsumed += (day.consumed_energy || 0);
        totalHeat += (day.delivered_heat || 0);
        totalCooling += (day.delivered_cooling || 0);
      });
      
      return {
        consumed_energy: totalConsumed,
        delivered_heat: totalHeat,
        delivered_cooling: totalCooling
      };
    }
    
    return null;
  }
}

module.exports = EpluconAPI;
