/**
 * Created by kukuchong on 2017/9/1.
 */
exports.hooks = {
    android:{
        before:function () {
            return client.init().contexts().then(function (result) {
                result['value'].should.have.lengthOf(2);
                return client.context(result.value[1]);
            })
        },
        after:function () {
            //return client.end()
        },
        beforeEach:function () {

        },
        afterEach:function () {

        }
    },
    ios:{
        before:function () {
            return client.init().contexts().then(function (result) {
                result['value'].should.have.lengthOf(2);
                return client.context(result.value[1]);
            })
        },
        after:function () {
            //return client.end()
        },
        beforeEach:function () {
        },
        afterEach:function () {

        }
    }
}