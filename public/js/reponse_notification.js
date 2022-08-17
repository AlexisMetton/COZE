let confirmations = document.getElementsByClassName("confirmation");
let refus = document.getElementsByClassName("refus");
Object.entries(confirmations).forEach(entry => {
    const [key, value] = entry;
    value.addEventListener('click', confirmer);
});

Object.entries(refus).forEach(entry => {
    const [key, value] = entry;
    value.addEventListener('click', refuser);
});

function confirmer(e){
    let notification = e.srcElement.parentElement.getAttribute("id").substring(12);
    $.ajax({
        type:'POST',
        url:'/ami/reponse',
        dataType:'json',
        data:{notification:notification, reponse:"oui"},
        async:true,
        success:function(data){
            console.log(data);
        }
    })
}

function refuser(e){
    let notification = e.srcElement.parentElement.getAttribute("id").substring(5);
    console.log(notification);
    $.ajax({
        type:'POST',
        url:'/ami/reponse',
        dataType:'json',
        data:{notification:notification, reponse:"non"},
        async:true,
        success:function(data){
            console.log(data);
        }
    })
}