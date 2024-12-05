const DEV_MODE = true;  // Set to false for production
const LOCAL_IP = '192.168.1.X'; // Replace with your actual IP address found above

export const API_BASE_URL = DEV_MODE 
  ? `http://${LOCAL_IP}:5000/api`  // Development
  : 'https://your-production-api.com/api';  // Production 