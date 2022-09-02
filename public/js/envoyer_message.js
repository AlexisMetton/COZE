let envoie=document.getElementById('envoyer_message');
let input_fichier= document.getElementById('input_fichier');
let fichierAEnvoyer = [];

input_fichier.addEventListener('change', chargementFichier);

envoie.addEventListener('keypress', envoyer);

function envoyer(e){
    if (e.key === 'Enter'){
        let message = envoie.value + ' ';
        envoie.value = '';
        e.preventDefault();
        let idDiscussion = window.location.href.split('/')[window.location.href.split('/').length - 1];
        let jsonData = new FormData();
        if (fichierAEnvoyer != []){
            let idxx = 0;
            fichierAEnvoyer.forEach(element => {
                jsonData.append('fichier' + idxx++, element);
            });
        }
        jsonData.append('id', idDiscussion);
        jsonData.append('message', message);
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
                if(fichierAEnvoyer != []){
                    supprimerFichier(e);
                }
            }
        })
    }else if((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey){
        envoie.value += '\r\n';
    }
}

function chargementFichier(e){
    let fichiers = document.getElementById('liste_fichier');
    let nom_fichiers = document.getElementsByClassName('nom_fichier');
    if (fichiers){
        Object.entries(input_fichier.files).forEach(entry => {
            const[key, value] = entry;
            let included = false;
            Object.values(nom_fichiers).forEach(nom =>{
                if(value.name == nom.innerText){
                    included = true;
                }
            })
            if(!included){
                fichierAEnvoyer.push(value);
                let fichier = document.createElement('div');
                fichier.setAttribute('class', 'fichier');
                fichiers.append(fichier);
                let nom_fichier = document.createElement('p');
                nom_fichier.setAttribute('class', 'nom_fichier');
                nom_fichier.innerText = value.name;
                let supprimer = document.createElement('button');
                supprimer.setAttribute('class', 'bouton_supprimer');
                supprimer.innerText = 'X';
                if(/image/.test(value.type)){
                    let image_fichier = document.createElement('img');
                    image_fichier.setAttribute('class', 'image_fichier');
                    image_fichier.setAttribute('src', URL.createObjectURL(value));
                    image_fichier.setAttribute('alt', 'representation du fichier');
                    fichier.prepend(image_fichier);
                }
                fichier.append(nom_fichier);
                fichier.prepend(supprimer);
                supprimer.addEventListener('click', supprimerFichier);
            }
        });
    }else{
        let separateur1 = document.createElement('div');
        separateur1.setAttribute('style', 'width:100%;');
        fichiers = document.createElement('div');
        fichiers.setAttribute('id', 'liste_fichier');
        input_fichier.insertAdjacentElement('beforebegin', fichiers);
        input_fichier.insertAdjacentElement('beforebegin', separateur1);
        Object.values(input_fichier.files).forEach(value => {
            fichierAEnvoyer.push(value);
            let fichier = document.createElement('div');
            fichier.setAttribute('class', 'fichier');
            fichiers.append(fichier);
            let nom_fichier = document.createElement('p');
            nom_fichier.setAttribute('class', 'nom_fichier');
            nom_fichier.innerText = value.name;
            let supprimer = document.createElement('button');
            supprimer.setAttribute('class', 'bouton_supprimer');
            supprimer.innerText = 'X';
            if(/image/.test(value.type)){
                let image_fichier = document.createElement('img');
                image_fichier.setAttribute('class', 'image_fichier');
                image_fichier.setAttribute('src', URL.createObjectURL(value));
                image_fichier.setAttribute('alt', 'representation du fichier');
                fichier.prepend(image_fichier);
            }
            fichier.append(nom_fichier);
            fichier.prepend(supprimer);
            supprimer.addEventListener('click', supprimerFichier);
        })
    }
}

function supprimerFichier(e){
    if(e.key === 'Enter'){
        document.getElementById('liste_fichier').remove();
        fichierAEnvoyer = [];
    }else{
        fichier_nom = e.srcElement.parentElement.lastElementChild.innerText;
        if(e.srcElement.nextElementSibling.getAttribute('class') == 'image_fichier'){
            URL.revokeObjectURL(e.srcElement.nextElementSibling.getAttribute('src'));
        }
        e.srcElement.parentElement.remove();
        Object.entries(fichierAEnvoyer).forEach(entry=>{
            const[key, value] = entry;
            if (value.name == fichier_nom){
                fichierAEnvoyer.splice(key, 1);
            }
        })
    }
}

//message direct vers le bas
$("#liste_message").scrollTop($("#liste_message")[0].scrollHeight);