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


const url_notification = JSON.parse(document.getElementById('mercure-url-notification').textContent);
const eventSourcenotification = new EventSource(url_notification);
eventSourcenotification.onmessage = e=>{
    data = JSON.parse(e.data);    
    $.ajax({
        type:'POST',
        url:'/notification/supprimée',
        dataType:'json',
        data:{id:data['id']},
        async:true,
        success:function(dataAjax){
            console.log(dataAjax);
        }
    }
    )
}