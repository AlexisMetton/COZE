let envoie=document.getElementById('envoyer_message');

envoie.addEventListener('keypress', envoyer);

function envoyer(e){
    if (e.key === 'Enter'){
        e.preventDefault();
        let idDiscussion = window.location.href.split('/')[window.location.href.split('/').length - 1];
        $.ajax({
            type:'POST',
            url:'/message/envoi',
            dataType:'json',
            data:{id:idDiscussion, message:envoie.value},
            async:true,
            success:function(data){
                let nouveauMessage = document.createElement('div');
                nouveauMessage.setAttribute('class', 'message_user');
                nouveauMessage.innerHTML = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur_user\'><img class=\'photo_user\' src=\' ../',data['photo'],' \' alt=\'photo_user\'></div><p class=\'message_contenu_user\'>', envoie.value, '</p></div><p class=\'date_message_user\'>A l\'instant</p></div>');
                document.getElementById('liste_message').append(nouveauMessage);
                document.getElementById('liste_message').scrollTo(0, document.getElementById('liste_message').scrollHeight);
                e.srcElement.value = "";
            }
        })
    }
}

//message direct vers le bas
$("#liste_message").scrollTop($("#liste_message")[0].scrollHeight);