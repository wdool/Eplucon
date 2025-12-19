const fetch = require('node-fetch');

class EpluconAPI {

  constructor(app) {
    this.app = app;
    this.baseUrl = 'https://portaal.eplucon.nl/api/v2';
    this.token = null;
    this.moduleId = null;
  }

  async login(username, password) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const bodyText = await response.text();
        throw new Error(`Auth failed: ${response.status} - ${bodyText}`);
      }

      const body = await response.json();
      this.token = body.access_token;
      
      if (!this.token) {
        throw new Error('No access_token in API response');
      }
      
      this.app.log('Eplucon: Authenticated');
      
      if (!this.moduleId) {
        await this.getModules();
      }
      
      return true;
    } catch (error) {
      this.app.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  async getModules() {
    if (!this.token) throw new Error('Not authenticated');

    const response = await fetch(`${this.baseUrl}/econtrol/modules`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Failed to fetch modules: ${response.status}`);
    
    const response_data = await response.json();
    const modules = response_data.data || [];
    
    if (modules.length > 0) {
      this.moduleId = modules[0].id; 
      this.app.log(`Eplucon: Found module ${modules[0].name} (${this.moduleId})`);
      return modules;
    }
    
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
