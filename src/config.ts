interface Config {
  apiUrl: string;
}

const dev: Config = {
  apiUrl: '/api'  // Vite proxy will handle this in development
};

const prod: Config = {
  apiUrl: 'https://your-api-domain.com/api'  // Your production API URL
};

const config = import.meta.env.DEV ? dev : prod;

export default config; 