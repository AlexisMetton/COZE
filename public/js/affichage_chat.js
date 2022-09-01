let messages = document.getElementById('liste_message');
const url = JSON.parse(document.getElementById("mercure-url").textContent);
const user_username = JSON.parse(document.getElementById("user-username").textContent);
const eventSource = new EventSource(url.concat('/', window.location.href.split('/')[window.location.href.split('/').length - 1]));
eventSource.onmessage = e => {
    let data = JSON.parse(e.data);
    let nouveauMessage = document.createElement('div');
    if(data['nom'] == user_username){
        nouveauMessage.setAttribute('class', 'message_user');
        if(data['fichier'] == ''){
            nouveauMessage.innerHTML = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu_user\'><p>', data['message'], '</p></div></div><p class=\'date_message_user\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
        }else{
            if(/img/.test(data['fichier'])){
                nouveauMessage.innerHTML = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu_user\'><img class=\'image_message\' alt=\'image message\' src=\'', data['fichier'], '\'><p style="text-align:center;">', data['message'], '</p></div></div><p class=\'date_message_user\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
            }else if(/video/.test(data['fichier'])){
                nouveauMessage.innerHTML = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu_user\'><video controls width="80%" style=\'align-self:center;padding:15px;\'><source src="', data['fichier'],'" type"',data['type_fichier'],'"></video><p style="text-align:center;">', data['message'], '</p></div></div><p class=\'date_message_user\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
            }else if(/audio/.test(data['fichier'])){
                nouveauMessage.innerHTML = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu_user\'><audio controls style="align-self:center; padding:15px;" src="',data['fichier'],'"></audio><p style="text-align:center;">', data['message'], '</p></div></div><p class=\'date_message_user\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
            }else{ 
                nouveauMessage.innerHTML = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu_user\'><p style="text-align:center;">', data['message'], '</p></div></div><p class=\'date_message_user\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
            }
            
        }
        messages.append(nouveauMessage);
        messages.scrollTo(0, messages.scrollHeight);
        e.srcElement.value = "";
    }else{
        nouveauMessage.setAttribute('class', 'message');
        if(data['fichier'] == ''){
            nouveauMessage.innerHTML = '<h3 class=\'nom\'>'.concat(data['nom'], '</h3><div class=\'message_info\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu\'><p>', data['message'], '</p></div></div><p class=\'date_message\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
        }else{
            if(/img/.test(data['fichier'])){
                nouveauMessage.innerHTML = '<h3 class=\'nom\'>'.concat(data['nom'], '</h3><div class=\'message_info\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu\'><img class=\'image_message\' alt=\'image message\' src=\'', data['fichier'], '\'><p style="text-align:center;">', data['message'], '</p></div></div><p class=\'date_message\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
            }else if(/video/.test(data['fichier'])){
                nouveauMessage.innerHTML = '<h3 class=\'nom\'>'.concat(data['nom'], '</h3><div class=\'message_info\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu\'><video controls width="80%" style=\'align-self:center;padding:15px;\'><source src="', data['fichier'],'" type"',data['type_fichier'],'"></video><p style="text-align:center;">', data['message'], '</p></div></div><p class=\'date_message\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
            }else if(/audio/.test(data['fichier'])){
                nouveauMessage.innerHTML = '<h3 class=\'nom\'>'.concat(data['nom'], '</h3><div class=\'message_info\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu\'><audio controls style="align-self:center; padding:15px;" src="',data['fichier'],'"></audio><p style="text-align:center;">', data['message'], '</p></div></div><p class=\'date_message\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
            }else{ 
                nouveauMessage.innerHTML = '<h3 class=\'nom\'>'.concat(data['nom'], '</h3><div class=\'message_info\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu\'><p style="text-align:center;">', data['message'], '</p></div></div><p class=\'date_message\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
            }
        }
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

        value.firstElementChild.nextElementSibling.lastElementChild = new DOMParser().parseFromString(value.firstElementChild.nextElementSibling.lastElementChild.innerText, "text/html");
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