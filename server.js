const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');

const server = http.createServer(app);

dotenv.config();

server.listen(4000, () => {
  console.log('Server running on port 4000');
});

let MONGO_URI =
  'mongodb+srv://ifzalkola:<password>@cluster0.cazuo.mongodb.net/BOPS?retryWrites=true&w=majority';
MONGO_URI = MONGO_URI.replace('<password>', process.env.DB_PASS);

mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('connected to DB'))
  .catch((err) => console.log(`Cant connect to DB : ${err}`));
