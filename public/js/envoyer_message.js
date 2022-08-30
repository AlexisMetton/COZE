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
        let fichier = '';
        if (input_fichier.files[0]){
            fichier = input_fichier.files[0];
        }
        let jsonData = new FormData();
        jsonData.append('id', idDiscussion);
        jsonData.append('message', message);
        jsonData.append('fichier', fichier);
        $.ajax({
            type:'POST',
            url:'/message/envoi',
            dataType:'json',
            data:jsonData,
            async:true,
            cache: false,
            contentType: false,
            processData: false,
            success:function(data){
                envoie.value = '';
                if(fichier){
                    supprimerFichier();
                }
            }
        })
    }else if((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey){
        envoie.value += '\r\n';
    }
}

function chargementFichier(e){
    let fichier = document.getElementById('fichier');
    let nom_fichier = document.getElementById('nom_fichier');
    let image_fichier = document.getElementById('image_fichier');
    if (fichier){
        if(image_fichier){
            URL.revokeObjectURL(image_fichier.getAttribute('src'));
            if(/image/.test(input_fichier.files[0].type)){ 
                image_fichier.setAttribute('src', URL.createObjectURL(input_fichier.files[0]));
            }else{
                image_fichier.remove();
            }
        }else{
            if(/image/.test(input_fichier.files[0].type)){
                image_fichier = document.createElement('img');
                image_fichier.setAttribute('id', 'image_fichier');
                image_fichier.setAttribute('src', URL.createObjectURL(input_fichier.files[0]));
                image_fichier.setAttribute('alt', 'representation du fichier');
                fichier.prepend(image_fichier);
            }
        }
        nom_fichier.innerText = input_fichier.files[0].name;
    }else{
        let separateur1 = document.createElement('div');
        separateur1.setAttribute('style', 'width:100%;');
        fichier = document.createElement('div');
        fichier.setAttribute('id', 'fichier');
        nom_fichier = document.createElement('p');
        nom_fichier.setAttribute('id', 'nom_fichier');
        nom_fichier.innerText = input_fichier.files[0].name;
        let supprimer = document.createElement('button');
        supprimer.setAttribute('class', 'bouton_supprimer');
        supprimer.innerText = 'X';
        if(/image/.test(input_fichier.files[0].type)){
            image_fichier = document.createElement('img');
            image_fichier.setAttribute('id', 'image_fichier');
            image_fichier.setAttribute('src', URL.createObjectURL(input_fichier.files[0]));
            image_fichier.setAttribute('alt', 'representation du fichier');
            fichier.prepend(image_fichier);
        }
        fichier.append(nom_fichier);
        fichier.prepend(supprimer);
        supprimer.addEventListener('click', supprimerFichier);
        input_fichier.insertAdjacentElement('beforebegin', fichier);
        input_fichier.insertAdjacentElement('beforebegin', separateur1);
    }
}

function supprimerFichier(){
    input_fichier.value = '';
    let image_fichier = document.getElementById('image_fichier');
    if(image_fichier){
        URL.revokeObjectURL(image_fichier.getAttribute('src'));
    }
    document.getElementById('fichier').remove();
}

//message direct vers le bas
$("#liste_message").scrollTop($("#liste_message")[0].scrollHeight);