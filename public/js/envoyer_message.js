let envoie=document.getElementById('envoyer_message');
let input_fichier= document.getElementById('input_fichier');

input_fichier.addEventListener('change', chargementFichier);

envoie.addEventListener('keypress', envoyer);

function envoyer(e){
    if (e.key === 'Enter'){
        let message = envoie.value;
        envoie.value = '';
        e.preventDefault();
        let idDiscussion = window.location.href.split('/')[window.location.href.split('/').length - 1];
        
        $.ajax({
            type:'POST',
            url:'/message/envoi',
            dataType:'json',
            data:{id:idDiscussion, message:message},
            async:true,
            success:function(data){
                envoie.value = '';
            }
        })
    }
}

function chargementFichier(e){
    let image_fichier = document.createElement('img');
    image_fichier.setAttribute('id', 'image_fichier');
    image_fichier.setAttribute('src', URL.createObjectURL(input_fichier.files[0]));
    image_fichier.setAttribute('alt', 'representation du fichier');
    let separateur = document.createElement('div');
    separateur.setAttribute('style', 'width:100%;');
    document.getElementById('zone_input').prepend(separateur);
    document.getElementById('zone_input').prepend(image_fichier);
}

//message direct vers le bas
$("#liste_message").scrollTop($("#liste_message")[0].scrollHeight);