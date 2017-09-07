/**
 * Created by kukuchong on 2017/9/5.
 */
module.exports =function (client) {
    describe("..setUrl",function () {

        it("sdfsf", function () {
            return client
                .url("http://webdriver.io")
                .contexts()
                .then(function (result) {
                    result['value'].should.have.lengthOf(3);
                    console.log(result.value)
                    return client.context(result['value'][2]);
                })
                .element(".mainnav")
                .then(function (result) {
                    console.log(result.value)
                    return client.elementIdElements(result.value["ELEMENT"],"a")
                }).then(res=>{
                    return client.elementIdClick(res.value[3]['ELEMENT'])
                })
                .timeouts("page load",2000)
                .getUrl()
                .then(res=>{
                    console.log(res);
                    res.should.equal("http://webdriver.io/api.html");
                    return client
                })

        })
    })
}