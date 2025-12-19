const fetch = require('node-fetch');

class EpluconAPI {

  constructor(app) {
    this.app = app;
    this.baseUrl = 'https://portaal.eplucon.nl/api/v2';
    this.token = null;
    this.moduleId = null;
  }

  async login(username, password) {
    this.app.log('Authenticating with Eplucon...');
    
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.token = data.access_token;
      this.app.log('Authentication successful');
      
      // Auto-fetch module ID if not set
      if (!this.moduleId) {
        await this.getModules();
      }
      
      return true;
    } catch (error) {
      this.app.error(error);
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

    if (!response.ok) throw new Error('Failed to fetch modules');
    
    const data = await response.json();
    // Assuming first module for simplicity, real app might let user choose
    if (data && data.length > 0) {
      this.moduleId = data[0].id; // Adjust based on actual API response structure
      this.app.log(`Found Module ID: ${this.moduleId}`);
      return data;
    }
    return [];
  }

  async getStatistics() {
    if (!this.token || !this.moduleId) throw new Error('Not authenticated or no module ID');

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
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
    
    // Return the last data point
    if (data && data.data && data.data.data && data.data.data.length > 0) {
      return data.data.data[data.data.data.length - 1];
    }
    
    return null;
  }
}

module.exports = EpluconAPI;
