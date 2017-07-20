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

function start(event) {
    event.preventDefault()
    event.stopPropagation()
    var cases= Array.from(document.forms[0].case)

    if(cases.some((input)=>{return input.checked})){
        document.forms[0].submit()
    }else{
        var alerts =  document.querySelector(".alert")
        alerts.style.display='block'
        setTimeout(()=>{alerts.style.display='none'},2000)
    }
}
function add(event) {
    event.preventDefault()
    event.stopPropagation()
    var form = document.querySelector('form');
    if(form.name.value && form.project_url.value&&form.file.files.length>0){
        form.submit();
    }else{
        var alerts =  document.querySelector(".alert")
        alerts.innerText= "请补全提交的信息"
        alerts.style.display='block'
        setTimeout(()=>{alerts.style.display='none'},2000)
    }
}
/*
Array.from(document.querySelectorAll('.code')).each((elem)=>{
    var lines=elem.innerText.split('\n').length-1;

})*/