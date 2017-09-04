/**
 * Created by kukuchong on 2017/7/18.
 */

function showCode(em) {
    if(em.dataset['show']=='true'){
        em.parentNode.parentNode.nextSibling.querySelector('.codeWrap').style.display='none'
        em.dataset['show']=false;
    }else{
        em.parentNode.parentNode.nextSibling.querySelector('.codeWrap').style.display='block'
        em.dataset['show']=true;
    }
}

function selectAll(event) {
    event.preventDefault()
    event.stopPropagation()

    $('form input[type="checkbox"]').map((index,val)=>{
        $(val).prop('checked',$(event.target).prop('checked'));
    })

}
$(document).ready(function () {
    $("input.selectAll").change(selectAll)

})

function start(event) {
    event.preventDefault()
    event.stopPropagation()
    if($('form input:checked').length==0){
        var alerts =  document.querySelector(".alert")
        alerts.style.display='block'
        setTimeout(()=>{alerts.style.display='none'},2000)
    }else{
        var cases = []
        $('form input:checked').map(function (input) {
            cases.push($(this).val())
        })
        $('form').submit()
        /*$.post('/start',{cases:JSON.stringify(cases)}).then(function (res) {
            if(res.result){
                window.location.href= '/start'
            }else{
                alert('报错了')
            }
        })*/
    }


}
function add(event) {
    event.preventDefault()
    event.stopPropagation()
    var form = document.querySelector('form');
    if(form.file.files.length>0){
        form.submit();
    }else{
        var alerts =  document.querySelector(".alert")
        alerts.innerText= "请选择文件"
        alerts.style.display='block'
        setTimeout(()=>{alerts.style.display='none'},2000)
    }
}

function addDevice(event) {
    event.preventDefault()
    event.stopPropagation()
    var form =document.querySelector('form');
    if(form.platformVersion.value&&form.deviceName.value&&form.udid.value){
        form.submit();
    }else{
        var alerts =  document.querySelector(".alert")
        alerts.innerText= "设备内容不完整"
        alerts.style.display='block'
        setTimeout(()=>{alerts.style.display='none'},2000)
    }
}

/*
Array.from(document.querySelectorAll('.code')).each((elem)=>{
    var lines=elem.innerText.split('\n').length-1;

})*/
