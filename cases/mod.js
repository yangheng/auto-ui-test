/**
 * Created by kukuchong on 2017/9/5.
 */
module.exports =function (client) {
    describe("..setUrl",function () {

        it("sdfsf", function () {
            return client.contexts().then(function (result) {
                    console.log(result)
                    return client.context(result.value[result.value.length - 1]);
                })
                .getUrl().then(uri=> {
                    console.log(uri);
                    return client
                })
                //.timeouts("pageLoad", 3000)
                .url("http://webdriver.io")


        })
    })
}