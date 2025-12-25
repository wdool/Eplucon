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
      if (!username || !password) {
        throw new Error('Please enter your Eplucon Portal email and password');
      }
      
      this.app.log(`Eplucon: Attempting login for ${username}`);
      
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const bodyText = await response.text();
      this.app.log(`Eplucon: Login response status ${response.status}`);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid email or password. Please check your Eplucon Portal credentials.');
        }
        throw new Error(`Login failed (${response.status}). Please try again later.`);
      }

      let body;
      try {
        body = JSON.parse(bodyText);
      } catch (e) {
        this.app.error(`Eplucon: Failed to parse response: ${bodyText}`);
        throw new Error('Unexpected response from Eplucon Portal. Please try again.');
      }
      
      this.app.log(`Eplucon: Response keys: ${Object.keys(body).join(', ')}`);
      
      this.token = body.access_token || body.token;
      
      if (!this.token) {
        this.app.error(`Eplucon: No token in response: ${JSON.stringify(body)}`);
        throw new Error('Login succeeded but no access token received. Please contact support.');
      }
      
      this.app.log('Eplucon: Authenticated successfully');
      
      if (!this.moduleId) {
        await this.getModules();
      }
      
      return true;
    } catch (error) {
      this.app.error(`Login error: ${error.message}`);
      this.token = null;
      throw error;
    }
  }

  async getModules() {
    if (!this.token) {
      throw new Error('Please login first with your Eplucon Portal credentials');
    }

    this.app.log('Eplucon: Fetching modules...');
    
    const response = await fetch(`${this.baseUrl}/econtrol/modules`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.token = null;
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(`Failed to fetch heat pumps (${response.status})`);
    }
    
    const response_data = await response.json();
    this.app.log(`Eplucon: Modules response: ${JSON.stringify(response_data)}`);
    
    const modules = response_data.data || [];
    
    if (modules.length === 0) {
      throw new Error('No heat pumps found in your Eplucon Portal account');
    }
    
    this.moduleId = modules[0].id; 
    this.app.log(`Eplucon: Found module ${modules[0].name} (${this.moduleId})`);
    return modules;
  }

  async getRealtimeInfo() {
    if (!this.token || !this.moduleId) throw new Error('Not authenticated or no module ID');

    const url = `${this.baseUrl}/econtrol/modules/${this.moduleId}/get_realtime_info`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Failed to fetch realtime info: ${response.status}`);

    const data = await response.json();
    
    if (data && data.data && data.data.common) {
      return data.data.common;
    }
    
    return null;
  }

  async getHeatloadingStatus() {
    if (!this.token || !this.moduleId) throw new Error('Not authenticated or no module ID');

    const url = `${this.baseUrl}/econtrol/modules/${this.moduleId}/heatloading_status`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      this.app.log('Failed to fetch heatloading status (non-critical)');
      return null;
    }

    const data = await response.json();
    
    if (data && data.data) {
      return data.data;
    }
    
    return null;
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
