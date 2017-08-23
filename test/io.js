/**
 * Created by kukuchong on 2017/8/18.
 */
const webdriverio = require('webdriverio');
const chai = require('chai')
const fs = require('fs');
var {config,p9} = require('../helpers/capabilities')
chai.should();
config.desiredCapabilities = p9;
const client=webdriverio.remote(config)
describe('android webview',function () {
  //导入案例的url，兼顾POC、项目
    try {
      var casesAddress = JSON.parse(fs.readFileSync("./helpers/casesAddress.json"));
      var cases = casesAddress.cases;
      var currentTest = -1;
      console.log(cases);
    } catch (e) {
      console.log(e);
    }
    this.timeout(514229);

    before(function () {
      return client.init().contexts().then(function (result) {
                result['value'].should.have.lengthOf(2);
                console.log(result);
                return client.context('WEBVIEW_com.yunshipei.enterplorer.debug');
              })
    });

    after(function () {
      // return client.quit()
    });

    beforeEach(function () {
      currentTest += 1;
      return client.url(cases[currentTest].url)
    })

    describe('----- context',function () {

        it('should list 3 contexts',function () {
            return client.contexts().then(function (result) {
                result['value'].should.have.lengthOf(2);
                console.log('it 1.1')
            })
        })

        it('s-----',function () {
          console.log('it 1.2')
        })
    })

    describe('show context',function () {

        it('should list 2 contexts',function () {
            return client.contexts().then(function (result) {
                      result['value'].should.have.lengthOf(2);
                      console.log("it 2.1")
                    })
        });

        it('s-----',function () {
          console.log('it 2.2')
        })
    });

})
