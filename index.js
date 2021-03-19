const express = require('express');

const router = require('./routes/routes');

const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: '*'}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
})
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(router);

app.listen(process.env.PORT || 7000, () => {
	console.log('Listening on port 7000');
});

module.exports = app;