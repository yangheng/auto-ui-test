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

    }else{
        var alerts =  document.querySelector(".alert")
        alerts.style.display='block'
        setTimeout(()=>{alerts.style.display='none'},2000)
    }
}
/*
Array.from(document.querySelectorAll('.code')).each((elem)=>{
    var lines=elem.innerText.split('\n').length-1;

})*/
