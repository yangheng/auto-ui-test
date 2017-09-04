/**
 * Created by kukuchong on 2017/7/20.
 */
function mocha(event) {
    if($('input:checked').length==0){
        var alerts =  document.querySelector(".alert")
        alerts.innerText= "需要选择一个设备"
        alerts.style.display='block'
        setTimeout(()=>{alerts.style.display='none'},2000)
    }else{
        $(".enable").hide();
        $(".progress").show();
        $.post('/start/mocha',{udid:$('input:checked').val(),platform:$('input[type="hidden"]').val()},(data,textStatus)=>{
            if(data.result){
                setInterval(()=>{
                    $.getJSON('/start/check',(data)=>{
                        if(data.mochaFinish){
                            interVal= null;
                            window.location.href="/report/"+data.reportName
                        }
                    })
                },2000)
            }else{
                var alerts =  document.querySelector(".alert")
                alerts.innerText= "文件打包失败了"
                alerts.style.display='block'
                setTimeout(()=>{alerts.style.display='none'},2000)
            }

        })
    }
}
$(document).ready(()=>{
    $(".progress").hide();
    $('input[type="radio"]').change(function (event) {
        $('input[type="hidden"]').val($(event.target).data('platform'));
    })
})