const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression')
const AppError = require('./Errors/classError')
const errorHandler = require('./Errors/errorHandling')
const dotenv = require('dotenv')
const limitReq = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
const helmet = require('helmet');


dotenv.config({ path: './.env' });
const app = express();
app.use(cookieParser());
app.use(express.json())
// app.set('trust proxy', 1)
app.use(morgan('tiny'))
app.use(compression())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp())

const corsOptions = {
  origin: 'https://lecture-app-50d1c.web.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// app.use(cors(corsOptions));
app.use(cors());

app.use(async (req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

const limiter = limitReq({
  max: 200,
  windowMs: 1000 * 60 * 60,
  message: 'Too many requests, try again after one hour'
})


app.use('/auth', limiter)
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.all('*', (req, res, next) => next(new AppError('not found', 404)))
app.use(errorHandler)
module.exports = app
