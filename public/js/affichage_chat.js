let messages = document.getElementById('liste_message');
const url = JSON.parse(document.getElementById("mercure-url").textContent);
const user_username = JSON.parse(document.getElementById("user-username").textContent);
const eventSource = new EventSource(url.concat('/', window.location.href.split('/')[window.location.href.split('/').length - 1]));
eventSource.onmessage = e => {
    let data = JSON.parse(e.data);
    let nouveauMessage = document.createElement('div');
    if(data['nom'] == user_username){
        nouveauMessage.setAttribute('class', 'message_user');
        nouveauMessage.innerHTML = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><p class=\'message_contenu_user\'>', data['message'], '</p></div><p class=\'date_message_user\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
        messages.append(nouveauMessage);
        messages.scrollTo(0, messages.scrollHeight);
        e.srcElement.value = "";
    }else{
        nouveauMessage.setAttribute('class', 'message');
        nouveauMessage.innerHTML = '<h3 class=\'nom\'>'.concat(data['nom'], '</h3><div class=\'message_info\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><p class=\'message_contenu\'>', data['message'], '</p></div><p class=\'date_message\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
        messages.append(nouveauMessage);
        messages.scrollTo(0, messages.scrollHeight);
        e.srcElement.value = "";
    }
    Object.entries(messages.children).forEach(entry => {
        const [key, value] = entry;
        value.lastElementChild.innerText = date_diff(new Date(value.lastElementChild.getAttribute('date')));
    });
    messages.scrollTo(0, messages.scrollHeight);
}

(function(){
    Object.entries(messages.children).forEach(entry => {
        const [key, value] = entry;
        value.lastElementChild.innerText = date_diff(new Date(value.lastElementChild.innerText));
    });
    messages.scrollTo(0, messages.scrollHeight);
})()


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
        document.getElementById('discussion/'.concat(data['discussion'])).remove();
    }
}