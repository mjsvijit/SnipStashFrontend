const env = process.env.ENV ? process.env.ENV : "development";

const config = {
  development: {
    api: "https://edupair-backend.onrender.com/api",
  },
  staging: {
    api: "https://edupair-backend.onrender.com/api",
  },
  production: {
    api: "https://edupair-backend.onrender.com/api",
  },
}[env];

export default config;
