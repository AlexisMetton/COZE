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


const url_notification_reponse = JSON.parse(document.getElementById('mercure-url-notification-reponse').textContent);
const eventSourcenotification_reponse = new EventSource(url_notification_reponse);
eventSourcenotification_reponse.onmessage = e=>{
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

    if(data['type'] == "info_accepter"){
        let notification_reponse = document.createElement('div');
        notification_reponse.setAttribute('onclick', 'notifier(event)');
        notification_reponse.setAttribute('class', 'notification');
        notification_reponse.setAttribute('id', 'notification'.concat(data['id']));
        let logo_notification_reponse = document.createElement('img');
        logo_notification_reponse.setAttribute('class', 'logo_notification');
        logo_notification_reponse.setAttribute('src', data['photo']);
        logo_notification_reponse.setAttribute('alt', 'logo de notification');
        let p_reponse = document.createElement('p');
        p_reponse.setAttribute('style', 'grid-column:2/4; grid-row:1/3;text-align: center;color: rgb(230,230,230);');
        p_reponse.innerHTML = data['message'];
        liste_notification.prepend(notification_reponse);
        notification_reponse.append(logo_notification_reponse);
        notification_reponse.append(p_reponse);
    }
}



const url_notification_demande = JSON.parse(document.getElementById('mercure-url-notification-demande').textContent);
const eventSourcenotification_demande = new EventSource(url_notification_demande);
eventSourcenotification_demande.onmessage = e=>{
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

    if(data['type'] == "confirmation"){
        let notification_demande = document.createElement('div');
        notification_demande.setAttribute('class', 'notification');
        let logo_notification_demande = document.createElement('img');
        logo_notification_demande.setAttribute('class', 'logo_notification');
        logo_notification_demande.setAttribute('src', data['photo']);
        logo_notification_demande.setAttribute('alt', 'logo de notification');
        let p_demande = document.createElement('p');
        p_demande.setAttribute('style', 'grid-column: 2/4;grid-row: 1/2;padding: 10px;text-align: center;color: rgb(230,230,230);');
        p_demande.innerHTML = data['message'];
        let validation_demande = document.createElement('button');
        validation_demande.setAttribute('style', 'grid-column:2/3; grid-row:2/3; justify-self: end;background-color:transparent;border:none;margin-right:5px;cursor:pointer;');
        validation_demande.setAttribute('id', 'confirmation'.concat(data['id']));
        validation_demande.setAttribute('class', 'confirmation');
        let img_validation_demande = document.createElement('img');
        img_validation_demande.setAttribute('src', '/img/valider.png');
        img_validation_demande.setAttribute('height', '20px');
        let refus_demande = document.createElement('button');
        refus_demande.setAttribute('style', 'grid-column:3/4; grid-row:2/3; justify-self: baseline;background-color:transparent;border:none;margin-left:5px;cursor:pointer;');
        refus_demande.setAttribute('id', 'refus'.concat(data['id']));
        refus_demande.setAttribute('class', 'refus');
        let img_refus_demande = document.createElement('img');
        img_refus_demande.setAttribute('src', '/img/refuser.png');
        img_refus_demande.setAttribute('height', '20px');


        liste_notification.prepend(notification_demande);
        notification_demande.append(logo_notification_demande);
        notification_demande.append(p_demande);
        notification_demande.append(validation_demande);
        validation_demande.append(img_validation_demande);
        notification_demande.append(refus_demande);
        refus_demande.append(img_refus_demande);

        validation_demande.addEventListener('click', confirmer);
        refus_demande.addEventListener('click', refuser);
    }
}