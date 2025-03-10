interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
};

export default config;
