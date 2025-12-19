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
    let month = date.getMonth(); // 0-11, so current month index is exactly "previous month number" (1-12) if we consider 0 as Dec of prev year... wait.
    // date.getMonth() returns 0 for Jan. Previous month would be Dec (12).
    // If current is Jan (0), prev is Dec (12), year = year - 1.
    // If current is Feb (1), prev is Jan (1), year = year.
    
    let year = date.getFullYear();
    
    if (month === 0) {
      month = 12;
      year = year - 1;
    } 
    // If month is > 0, e.g. 1 (Feb), then prev month is 1 (Jan). getMonth() returns 0-11. 
    // So if getMonth() is 1 (Feb), we want query month=1. Correct.
    // If getMonth() is 5 (June), we want query month=5 (May). Correct.
    
    // Logic check:
    // Today: Feb 2025. getMonth() = 1. We want Jan 2025. URL month=1.
    // Today: Jan 2025. getMonth() = 0. We want Dec 2024. URL month=12, year=2024.
    
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
    
    // Since we are querying a PAST month, the data should be complete.
    // We want the total for that month.
    // The API likely returns daily breakdowns. We need to sum them up?
    // Or does it return the cumulative?
    // User snippet: "consumed_energy: 39". If this is "datefield: 2025-02-01", it's daily.
    // User instruction: "previous month values ... not daily".
    // If the API returns a list of days for the month, we should probably SUM them to get the "Monthly" value.
    // Alternatively, maybe there is a summary?
    // User snippet just showed one object in the array.
    // Assuming for "Monthly Statistics", we want the SUM of the days in that month.
    
    if (body && body.data && Array.isArray(body.data)) {
      let totalConsumed = 0;
      let totalHeat = 0;
      
      body.data.forEach(day => {
        totalConsumed += (day.consumed_energy || 0);
        totalHeat += (day.delivered_heat || 0);
      });
      
      return {
        consumed_energy: totalConsumed,
        delivered_heat: totalHeat
      };
    }
    
    return null;
  }
}

module.exports = EpluconAPI;
