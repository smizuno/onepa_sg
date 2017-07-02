#!/usr/bin/env node
process.env.UV_THREADPOOL_SIZE = 128;
var express = require("express");
var client = require('cheerio-httpcli');
var bodyParser = require('body-parser');
var app = express();

client.timeout = 100000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
//  bodyParser.json();
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// To avoid Error:sockethangup
    req.socket.on("error", function() {

    });
    res.socket.on("error", function() {

    });
  next();
});
app.get('/', function(req, res) {
    res.sendfile('index.html');
});
app.post("/api/onepa", function (req, res) {
console.info('Access to facility');
client.fetch('https://one.pa.gov.sg/CRMSPortal/CRMSPortal.portal?_nfpb=true&_st=&_windowLabel=CRMSPortal_1&_urlType=render&_mode=view&wlpCRMSPortal_1_action=RBMFacilityPublicBooking&_pageLabel=CRMSPortal_page_1')
.then(function (result) {
  console.info('Submit book');
  console.info(req.body.court);
return  result.$('form[name=frmFacilityPublicBooking]').submitSync({
  task:"",
  idProduct:req.body.court,
  idProfile:req.body.profile,
  unitNum:2,
  eesourceDesc:"BADMINTON COURT",
  entityName:"KAMPONG GLAM CC",
  indBookingBasis:1,
  pageNo:1,
  indPublishPublic:"Y",
  txVenue:"KAMPONG GLAM CC",
  indPayCounter:"N",
  idInternalBu:req.body.location,
  cdResourceType:1,
  indIndemnityReq:"N",
  CWT:"",
  CWT:"",
  searchResource:9,
  indSearchBy:1,
  searchLocation:req.body.location,
  searchPostalCode:"",
  CWT:"",
  searchDate:req.body.date,
  viewMode:2,
  "btnCheckVacancy.x":11,
  "btnCheckVacancy.y":12,
  searchResultPerPage:5
  })
})
.then(function (result) {
  console.info('Show table');
  var tables = [];
  result.$('.main_table').each(function(i, elem) {
    tables[i] = result.$(this);
  });
  var schedule = [{table:tables[1].html()}]
  res.json(schedule);
})
.catch(function (err) {
  console.error('Error:', err);
})
.finally(function () {
  console.info('End task');
});
});

var server = app.listen(80, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

