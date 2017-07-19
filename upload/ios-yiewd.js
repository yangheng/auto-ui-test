// This requires node 0.11 and harmony

"use strict";

/* jshint esnext: true */

require("./helpers/setup");
var CUSTOM_KEYS = require("./util.js");

var fs = require('fs');
var actions = require("./helpers/actions");

var wd = require("yiewd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');

describe("ios yiewd", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;
  var indexOfCase = 0;
  var serverConfig = process.env.npm_package_config_sauce ?
    serverConfigs.sauce : serverConfigs.local;
  driver = wd.remote(serverConfig.host,serverConfig.port,
    serverConfig.username, serverConfig.password);
  require("./helpers/logging").configure(driver);
  //read cases url
  try {
    var cases = JSON.parse(fs.readFileSync("casesAdress.json")).cases;
    console.log(cases);
  } catch (e) {
    console.log(e);
  }


  before(function (done) {
    driver.run(function* () {
      var desired = _.clone(require("./helpers/caps").ios107);

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
    driver.run(function* (){
      console.log("indexOfCase",indexOfCase);
      //输入案例地址
      var pageEntry = yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeTextField[1]');
      yield pageEntry.sendKeys(cases[indexOfCase].url);
      yield pageEntry.sendKeys(wd.SPECIAL_KEYS.Return);
      console.log('111111');
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
    indexOfCase = indexOfCase + 1;
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


  it("#1 should BK-03 多选按钮基本测试 必测",function(done){
    driver.run(function* (){
      var checkbox2 = yield driver.waitForElementByName('统一的办公通讯门户');
      checkbox2.tap();
      yield driver.sleep(1000);
      var c = yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeStaticText[1]')
      c.should.to.be.true;
      done();
    })
  });

  it("#2 should BO-03 日期组件基本测试 必测" ,function(done){
    driver.run(function* (){
      var date = '',
          tempUrl = '';
      // test case
      for (var i = 1; i < 10; i++) {
        tempUrl = '//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeTextField[' + i +']';
        date = yield driver.waitForElementByXPath(tempUrl);
        if(i === 6){
          var loc = yield date.getLocation();
          yield actions.swipe({driver:driver,startX:loc.x+10,startY:loc.y,offY:-300});
        }
        yield date.tap();
        yield driver.sleep(500);
        var temp = '//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[' + (2 * i + 2) +']/XCUIElementTypeOther[1]/XCUIElementTypeOther[5]/XCUIElementTypeOther[1]';
        yield driver.waitForElementByXPath(temp).tap();
        console.log(yield date.text());

      }
      yield driver.sleep(1000);
      done();
    })
  });

  it("#3 BH-02 图片组件基本测试 必测",function(done){
    driver.run(function* (){

      var size = yield driver.getWindowSize();
      // take a shot
      yield actions.swipe({driver:driver,startX:20,startY:size.height - 80,offY:-400});
      // take a shot


      yield driver.sleep(2000);
      console.error('#3 BH-02 图片组件基本测试 必测');

      done();
    })
  });

  it("#4 BG-02 链接组件基本测试 必测",function(done){
    driver.run(function* (){

      // while(!(yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeStaticText[1]'))){
      //   yield driver.sleep(2000);
      // }
      yield driver.waitForElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeStaticText[1]').tap();
      yield driver.sleep(2000);
      yield driver.waitForElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeStaticText[1]').tap();
      yield driver.sleep(2000);

      var orPage = yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeStaticText[1]');
      orPage.should.to.be.true;
      done();
    })
  });

  it("#5 BQ-01 模态框基本案例 必测",function(done){
    driver.run(function* (){

      while(!(yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeStaticText[1]'))){
        yield driver.sleep(2000);
      }
      yield driver.waitForElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeButton[1]').tap();
      yield driver.sleep(2000);
      yield driver.waitForElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeButton[1]').tap();
      yield driver.sleep(1000);

      done();
    })
  });

  it("#6 BL-03 单选按钮基本测试 必测",function(done){
    driver.run(function* (){

      while(!(yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeStaticText[1]'))){
        yield driver.sleep(2000);
      }

      var select = yield driver.waitForElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]');
      yield select.click();
      yield driver.sleep(1000);
      var loc = yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[2]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]').getLocation();
      yield actions.swipe({driver:driver,startX:loc.x+5,startY:loc.y+70,offY:-30});

      yield driver.elementByName('完成').tap();//{{358, 478}, {41, 41}}

      // select.text().should.equal('统一的办公通讯门户');
      done();
    })
  });
  it("#7 BJ-03 下拉框基本测试 必测",function(done){
    driver.run(function* (){
      var defaultValue = yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]');
      yield defaultValue.tap();
      yield driver.sleep(1000);
      var loc = yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[2]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]').getLocation();
      yield actions.swipe({driver:driver,startX:loc.x+5,startY:loc.y+70,offY:-30});
      yield driver.elementByName('完成').tap();
      // defaultValue.text().should.equal('统一的办公通讯门户');

      var noDefaultValue = yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[5]');
      yield noDefaultValue.tap();
      yield driver.sleep(1000);
      yield actions.swipe({driver:driver,startX:loc.x+5,startY:loc.y+70,offY:-30});
      yield driver.elementByName('完成').tap();
      noDefaultValue.text().should.eventually.include('快捷的移动适配开发');
      done();
    })
  });

  it("#8 BN-01 文件上传基本测试 必测",function(done){
    driver.run(function* (){
      yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeButton[1]').tap();
      yield driver.sleep(2000);


      // for (var i = 0; i < CUSTOM_KEYS.PageLoadWaitCount && !(yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]')); i++) {
      //   yield driver.sleep(CUSTOM_KEYS.PageLoadWaitPeriod);
      // }
      var openPhotos = yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]');
      openPhotos.should.to.be.true;
      yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther[4]/XCUIElementTypeButton[1]').tap();
      driver.sleep(1000);
      done();
    })
  });

  it("#9 E-01 事件回调案例 必测",function(done){
    driver.run(function* (){
      yield driver.elementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeButton[1]').tap();
      driver.acceptAlert();

      yield driver.alertText().should.eventually.include('执行了Click事件');
      done();
    })
  });

  it("#10 E-02 数据获取案例 必测",function(done){
    driver.run(function* (){
      var text1 = yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[4]/XCUIElementTypeStaticText[1]');
      var text2 = yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[5]/XCUIElementTypeStaticText[1]');
      var text3 = yield driver.hasElementByXPath('//XCUIElementTypeApplication[1]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[3]/XCUIElementTypeWebView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[7]/XCUIElementTypeStaticText[1]');
      text1.should.to.be.true;
      text2.should.to.be.true;
      text3.should.to.be.true;
      done();
    })
  });
});
