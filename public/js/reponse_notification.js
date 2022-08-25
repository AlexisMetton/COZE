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
            amis.innerHTML = amis.innerHTML.concat('<a href=\'discussion/check/',data['id'],'\' class=\'ami\'><img class=\'photo_amis\' src=\'',data['photo'],'\' alt=\'photo de ',data['username'],'\'><p>',data['username'],'</p></a>');
            let lateral = document.getElementById('titre_lateral');
            let nb = document.getElementsByClassName("ami").length;
            lateral.innerHTML = '<h3 id=\'titre_lateral\'>Amis&nbsp;-&nbsp;'+ nb +'</h3>';
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

let liste_notification = document.getElementById('liste_notification');
const url_notification = JSON.parse(document.getElementById('mercure-url-notification').textContent);
const eventSourcenotification = new EventSource(url_notification);
eventSourcenotification.onmessage = e=>{
    data = JSON.parse(e.data);    
    let lien_notification = document.getElementById('lien_notification');
    let notification_cloche = document.getElementById('nombre_notification');

    if(notification_cloche == null){
        notification_cloche = document.createElement('p');
        notification_cloche.setAttribute('id', 'nombre_notification');
        notification_cloche.innerHTML = "1";
        lien_notification.insertAdjacentElement("afterend", notification_cloche);
        liste_notification.innerHTML = "";
    }else{
        notification_cloche.innerText ++;
    }

    if(data['type'] == "url"){
        let notification = document.createElement('a');
        notification.setAttribute('href', 'discussion/'.concat(data['discussion']));
        notification.setAttribute('onclick', 'notifier(event)');
        notification.setAttribute('class', 'notification');
        notification.setAttribute('id', 'notification'.concat(data['id']));
        let logo_notification = document.createElement('img');
        logo_notification.setAttribute('class', 'logo_notification');
        logo_notification.setAttribute('src', data['photo']);
        logo_notification.setAttribute('alt', 'logo de notification');
        let p = document.createElement('p');
        p.setAttribute('style', 'grid-column:2/4; grid-row:1/3;text-align: center;color: rgb(230,230,230);');
        p.innerHTML = data['message'];
        liste_notification.prepend(notification);
        notification.append(logo_notification);
        notification.append(p);
    }
}
