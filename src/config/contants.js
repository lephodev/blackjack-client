const env = {
  dev: {
    landingServerUrl: 'https://api.scrooge.casino/v1',
    serverUrl: 'http://localhost:3001',
    landingClient: 'http://localhost:3000',
  },
  production: {
    landingServerUrl: 'https://api.scrooge.casino/v1',
    serverUrl: 'https://blackjack-api.scrooge.casino',
    landingClient: 'https://scrooge.casino',
  },
};

export default env.dev;
