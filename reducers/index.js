var {combineReducers} = require('redux');
var {routerReducer} = require('react-router-redux');

var i18n = require('./i18n');
var session = require('./session');
var dashboard = require('./dashboard');
var map = require('./map');
var forecasting = require('./forecasting');
var group = require('./group');
var groupCatalog=  require('./group-catalog');
var user = require('./user');
var password = require('./password');
var userCatalog=  require('./user-catalog');
var favourites = require('./favourites');
var mode_management = require('./mode_management');
var admin = require('./admin');
var logging = require('./logging');
var alerts = require('./alerts');
var messages = require('./messages');
var announcements = require('./announcements');
var query = require('./query');
var scheduler = require('./scheduler');
var debug = require('./debug');
var reports = require('./reports');
var config = require('./config');
var charting = require('./charting');
var overview = require('./overview');
var trials = require('./trials');
var dataExport =require('./data-export');
var savings = require('./savings');

var budget = require('./budget');
var viewport = require('./viewport');

var rootReducer = combineReducers({
  i18n,
  viewport,
  config,
  session,
  dashboard,
  forecasting,
  map,
  group,
  groupCatalog,
  user,
  password,
  userCatalog,
  favourites,
  mode_management,
  admin,
  alerts,
  messages,
  announcements,
  query,
  scheduler,
  debug,
  logging,
  routing: routerReducer,
  reports,
  charting,
  overview,
  trials,
  dataExport,
  savings,
  budget,
});

module.exports = rootReducer;
