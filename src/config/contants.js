import config from './config.json'
// const env = {
//   dev: {
//     landingServerUrl: "https://api.scrooge.casino/v1",
//     serverUrl: "http://localhost:3001",
//     landingClient: "http://localhost:3000",
//   },
//   production: {
//     landingServerUrl: "https://api.scrooge.casino/v1",
//     serverUrl: "https://blackjack-api.scrooge.casino",
//     landingClient: "https://scrooge.casino",
//   },
//   design: {
//     landingServerUrl: "https://api.scrooge.casino/v1",
//     serverUrl: "https://blackjack-api.scrooge.casino",
//     landingClient: "http://localhost:3000",
//   },
// };

// export default env.production;
const contants = config[process.env.REACT_APP_ENV];
export default contants
