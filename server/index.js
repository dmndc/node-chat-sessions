const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `${__dirname}/controllers/messages_controller` );
const session = require('express-session');
const createInitialSession = require('./middlewares/session');
const filter = require('./middlewares/filter');

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../public/build` ) );
app.use(session({
  secret: 'Idontknoww',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 10000 }
}));

app.use( (req, res, next) => createInitialSession( req, res, next ));
app.use( (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    filter(req, res, next);
  } else {
    next();
  }
});

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.get( `${messagesBaseUrl}/history`, mc.history );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );