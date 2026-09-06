const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`ShopEase API listening on port ${PORT}`);
  });
});
