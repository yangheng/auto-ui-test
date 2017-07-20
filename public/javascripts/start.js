/**
 * Created by kukuchong on 2017/7/20.
 */

$(document).ready(()=>{

    var interVal=setInterval(()=>{
        $.getJSON('/start/check',(data)=>{
            console.log(data)
            if(data.mochaFinish){
                interVal= null;
                window.location.href="/report/"+data.reportName
            }
        })
    },2000)
})