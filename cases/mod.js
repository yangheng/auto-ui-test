/**
 * Created by kukuchong on 2017/8/29.
 */

module.exports=function (client) {

    describe('----- context',function () {

        it('should list 3 contexts',function () {
            return client.contexts().then(function (result) {
                    console.log(result)
                    return client.context(result.value[result.value.length - 1]);
                    // console.log()
                })
                .getText('.case-box', 3000)
                .then(function(text){
                    // console.log(text)
                    text.should.be.equal('这里是案例的内容区')
                    // return client.quit();
                    // console.log(client.getSource())
                })
                .getText('.container', 3000)
                .then(function(text){
                    // console.log(text)
                    text.should.be.equal('这里是案例的内容区')
                    // return client.quit();
                    // console.log(client.getSource())
                })
        })


    })


}