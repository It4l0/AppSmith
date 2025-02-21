const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

class LogService {
  static log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };

    // Add different styling for different log levels
    const styles = {
      [LOG_LEVELS.INFO]: 'color: #2196F3',
      [LOG_LEVELS.WARN]: 'color: #FF9800',
      [LOG_LEVELS.ERROR]: 'color: #F44336; font-weight: bold',
      [LOG_LEVELS.DEBUG]: 'color: #4CAF50'
    };

    console.log(`%c[${timestamp}] [${level}] ${message}`, styles[level]);
    if (data) {
      console.log('Additional data:', data);
    }

    // In development, we could also save logs to localStorage for persistence
    if (process.env.NODE_ENV === 'development') {
      this.saveToLocalStorage(logEntry);
    }
  }

  static info(message, data = null) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  static warn(message, data = null) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  static error(message, data = null) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LOG_LEVELS.DEBUG, message, data);
    }
  }

  static saveToLocalStorage(logEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(logEntry);
      // Keep only last 100 logs to prevent storage overflow
      if (logs.length > 100) {
        logs.shift();
      }
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save log to localStorage:', error);
    }
  }

  static getLogs() {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch (error) {
      console.error('Failed to retrieve logs from localStorage:', error);
      return [];
    }
  }

  static clearLogs() {
    localStorage.removeItem('app_logs');
  }
}

export default LogService;
