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
    let idNotification = e.srcElement.parentElement.getAttribute("id").substring(12);
    $.ajax({
        type:'POST',
        url:'/ami/reponse',
        dataType:'json',
        data:{notification:idNotification, reponse:"oui"},
        async:true,
        success:function(data){
            let notification = e.srcElement.parentElement.parentElement;
            let liste_notification = notification.parentElement;
            notification.remove();
            if (liste_notification.children.length == 0){
                liste_notification.innerHTML = "<p style='text-align:center;'>Aucune notifications</p>";
            }
            let amis = document.getElementById('liste_amis');
            amis.innerHTML = amis.innerHTML.concat('<a href=\'discussion/check/',data['id'],'\' class=\'ami\'><p>',data['username'],'</p></a>');
            let nb_notification = document.getElementById('nombre_notification');
            if(nb_notification.innerText == '1'){
                nb_notification.remove();
            }else{
                nb_notification.innerText -= 1;
            }
        }
    })
}

function refuser(e){
    let idNotification = e.srcElement.parentElement.getAttribute("id").substring(5);
    console.log(idNotification);
    $.ajax({
        type:'POST',
        url:'/ami/reponse',
        dataType:'json',
        data:{notification:idNotification, reponse:"non"},
        async:true,
        success:function(data){
            console.log(data);
            let notification = e.srcElement.parentElement.parentElement;
            let liste_notification = notification.parentElement;
            notification.remove();
            if (liste_notification.children.length == 0){
                liste_notification.innerHTML = "<p style='text-align:center;'>Aucune notifications</p>";
            }
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
    let nb_notification = document.getElementById('nombre_notification');
        if(nb_notification.innerText == '1'){
            nb_notification.remove();
        }else{
            nb_notification.innerText -= 1;
        }
}