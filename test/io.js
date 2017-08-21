/**
 * Created by kukuchong on 2017/8/18.
 */
const webdriverio = require('webdriverio');
const chai = require('chai')
var {config,p9} = require('../helpers/capabilities')
chai.should();
config.desiredCapabilities = p9;
const client=webdriverio.remote(config)
describe('android webview',function () {

    this.timeout(514229);

    before(function () {

        return client.init()
    })



    describe('show context',function () {

        it('should list 2 contexts',function () {
            return client.contexts().then(function (result) {
                result['value'].should.have.lengthOf(2)
            })

        })

        it('switch webview',function () {
            return client
                .context('WEBVIEW_com.yunshipei.enterplorer.debug')
                .source()
                .then(function (result) {
                    result['value'].should.include('html')
                })
        })
    })

})

