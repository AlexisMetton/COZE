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


let notification = document.getElementsByClassName("notification");

function notifier(e){
    let notifs = e.srcElement.parentElement;
    let idNotif = notifs.getAttribute("id").substring(12);
    notifs.remove();
    if (liste_notification.children.length == 0){
        liste_notification.innerHTML = "<p style='text-align:center;'>Aucune notifications</p>";
    }
    $.ajax({
        type:'POST',
        url:'/notification/supprimée',
        dataType:'json',
        data:{id:idNotif},
        async:true,
        success:function(data){
            console.log(data);
        }
    })
}