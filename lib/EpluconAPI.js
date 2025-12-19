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
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.statusText}`);
      }

      const body = await response.json();
      this.token = body.access_token;
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
    if (data && data.length > 0) {
      this.moduleId = data[0].id; 
      this.app.log(`Found Module ID: ${this.moduleId}`);
      return data;
    }
    return [];
  }

  async getStatistics() {
    if (!this.token || !this.moduleId) throw new Error('Not authenticated or no module ID');

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // 0-indexed in JS
    const year = date.getFullYear();

    // Fetching "Day" range to get granular data, then taking the last entry
    const url = `${this.baseUrl}/econtrol/modules/${this.moduleId}/statistics?range=day&day=${day}&month=${month}&year=${year}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch statistics');

    const data = await response.json();
    
    // The structure is data.data.data[] based on user's script: "dataStats.data.data[0]" 
    // Wait, user's script said "dataStats.data.data[dataStats.data.data.length - 1]" in the first file, 
    // but "dataStats.data.data[0]" in the second snippet.
    // Usually APIs return time-series. If we want "current", we want the latest.
    // If the array is chronological, we want the LAST one. 
    // If it's reverse chronological, we want the FIRST one.
    // Standard Eplucon practice (from "Lessons Learned" text): "latestDataStats = dataStats.data.data[dataStats.data.data.length - 1]"
    
    if (data && data.data && data.data.data && Array.isArray(data.data.data) && data.data.data.length > 0) {
      const statsArray = data.data.data;
      return statsArray[statsArray.length - 1];
    }
    
    return null;
  }
}

module.exports = EpluconAPI;
