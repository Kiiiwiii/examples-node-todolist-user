
export async function startConfigProcess() {
  // heroku will config(set) process.env.NODE_ENV to production
  const env = process.env.NODE_ENV || 'development';

  // all config of production env will be added in heroku
  // all config of development env and test env will be added here
  if (env === 'development' || env === 'test') {
    const config = await import('./config.json');
    process.env.NODE_ENV = env;
    Object.keys((config as any)[env]).forEach(key => {
      process.env[key] = (config as any)[env][key];
    });
    return true;
  }
  return true;
}
