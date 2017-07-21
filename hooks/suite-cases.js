// This requires node 0.11 and harmony

"use strict";

/* jshint esnext: true */

require("./helpers/setup");
var CUSTOM_KEYS = require("./helpers/util.js");

var fs = require('fs');
var actions = require("./helpers/actions");

var wd = require("yiewd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');

describe("ios yiewd", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;
  var indexOfCase = -1;
  var serverConfig = process.env.npm_package_config_sauce ?
      serverConfigs.sauce : serverConfigs.local;
  driver = wd.remote(serverConfig.host,serverConfig.port,
      serverConfig.username, serverConfig.password);
  require("./helpers/logging").configure(driver);
  //read cases url
  try {
    var casesAdress = JSON.parse(fs.readFileSync("caseAddress.json"));
    var cases = casesAdress.cases;
    console.log(cases);
  } catch (e) {
    console.log(e);
  }


  before(function (done) {
    driver.run(function* () {
      if(casesAdress.platform === 'ios'){
        var desired = _.clone(require("./helpers/caps").ios107);
      }else {
        var desired = _.clone(require("./helpers/caps").androidP9);
      }


      if (process.env.npm_package_config_sauce) {
        desired.name = 'ios - testing';
        desired.tags = ['auto testing'];
      }
      yield driver.init(desired);

      done();
    });
  });

  after(function () {
    driver.run(function* () {
      try {
        yield driver.quit();
      } catch (ign) {
        if (process.env.npm_package_config_sauce) {
          yield driver.sauceJobStatus(allPassed);
        }
      }
    });
  });

  beforeEach((done)=>{
    indexOfCase = indexOfCase + 1;
    driver.run(function* (){
      console.log("indexOfCase",indexOfCase);
      //输入案例地址
      var pageEntry = yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeTextField[1]');
      yield pageEntry.sendKeys(cases[indexOfCase].project);
      yield pageEntry.sendKeys(wd.SPECIAL_KEYS.Return);
      //等待案例加载完毕,并设定超时
      // var caseTitle = yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeStaticText[1]');
      // for (var i = 0; i < CUSTOM_KEYS.PageLoadWaitCount && !(yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeStaticText[1]')); i++) {
      //   console.log('333333');
      //   yield driver.sleep(CUSTOM_KEYS.PageLoadWaitPeriod);
      //   console.log('2222222');
      // }
      var i = 0;
      while(!(yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeStaticText[1]'))){
        if(i < 20){
          yield driver.sleep(2000);
          i = i + 1;
        }else {
          i = 20;
        }
      }
      done();
    })

  });

  afterEach(function (done) {
    // console.log("indexOfCase name",cases[indexOfCase].name);
    allPassed = allPassed && this.currentTest.state === 'passed';

    driver.run(function* (){
      // return home
      yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeButton[4]').tap();
      // close last case
      yield driver.sleep(600);
      yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]').tap();
      yield driver.sleep(600);
      yield driver.elementByName('关闭所有窗口').tap();
      yield driver.sleep(600);
      yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeAlert[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]').tap();
      yield driver.sleep(1000);
      done();
    })
  });
