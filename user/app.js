require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const authorization = require('./authorization/authorization');
const signupUserRouter = require('./routes/signupUserRoutes');
const loginPanelRouter = require('./routes/loginPanelRoutes');
const signupRouter = require('./routes/signupRoutes');
const studyRouter = require('./routes/studyRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const quickLinkRouter = require('./routes/quickLinksRoutes');
const usersRouter = require('./routes/usersRouter');
const regionsRouter = require('./routes/regionsRouter');
const studiesRouter = require('./routes/studiesRouter');
const participantBreakdownRouter = require('./routes/participantBreakdown');
const peerGroupRouter = require('./routes/peerGroupRoutes');
const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', signupUserRouter);
app.use('/', loginPanelRouter);
app.use('/', signupRouter);
app.use('/', studyRouter);
app.use('/', paymentRouter);
app.use('/', categoryRouter);
app.use('/', authorization, quickLinkRouter);
app.use('/', authorization, usersRouter);
app.use('/', authorization, regionsRouter);
app.use('/', authorization, studiesRouter);
app.use('/', authorization, participantBreakdownRouter) // sahr
app.use('/', authorization, peerGroupRouter) // sahr
module.exports = app;
