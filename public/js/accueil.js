function update(e){
    let data = JSON.parse(e.data);
    let afficher = false;
    Object.values(discussions).forEach(value => {
        if(value.getAttribute('href').split('/')[1] == data['discussion']){
            value.firstElementChild.nextElementSibling.nextElementSibling.innerText = data['message'];
            value.lastElementChild.innerText = date_diff(new Date(data['heure']['date']));
            value.lastElementChild.setAttribute('date', data['heure']['date']);
            value.parentElement.prepend(value);
            afficher = true;
        }
    });
    if(!afficher){
        $.ajax({
            type:'POST',
            url:'/discussion/recuperer',
            dataType:'json',
            data:{id:data['discussion']},
            async:true,
            success:function(dataAjax){
                if(dataAjax != 'Cette discussion n\'existe pas!' && dataAjax != 'Erreur ajax!'){
                    let nouvelleDiscussion = document.createElement('a');
                    nouvelleDiscussion.setAttribute('href', 'discussion/'.concat(data['discussion']));
                    nouvelleDiscussion.setAttribute('class', 'discussion');
                    let nouveauConteneurPhoto = document.createElement('div');
                    nouveauConteneurPhoto.setAttribute('class', 'photo_discussion_conteneur');
                    nouvelleDiscussion.append(nouveauConteneurPhoto);
                    let nouvellePhotoDiscussion = document.createElement('img');
                    nouvellePhotoDiscussion.setAttribute('class', 'photo_discussion');
                    nouvellePhotoDiscussion.setAttribute('src', dataAjax['photo']);
                    nouvellePhotoDiscussion.setAttribute('alt', 'photo_discussion');
                    nouveauConteneurPhoto.append(nouvellePhotoDiscussion);
                    let nouveauNomDiscussion = document.createElement('h3');
                    nouveauNomDiscussion.setAttribute('class', 'nom_discussion');
                    nouveauNomDiscussion.innerText = dataAjax['nom'];
                    nouvelleDiscussion.append(nouveauNomDiscussion);
                    let dernierMessage = document.createElement('p');
                    dernierMessage.setAttribute('class', 'dernier_message');
                    dernierMessage.innerText = data['message'];
                    nouvelleDiscussion.append(dernierMessage);
                    let heureDernierMessage = document.createElement('p');
                    heureDernierMessage.setAttribute('class', 'date_dernier_message');
                    let date1 = new Date(data['heure']['date']);
                    heureDernierMessage.innerText = date_diff(date1);
                    nouvelleDiscussion.append(heureDernierMessage);
                    if(liste_discussions.children.length < 4){
                        if(liste_discussions.firstElementChild.getAttribute('id') == 'vide'){
                            liste_discussions.firstElementChild.remove();
                        }
                    }else if(liste_discussions.lastElementChild == plusDeDiscussion){
                        liste_discussions.lastElementChild.previousElementSibling.remove();
                    }
                    liste_discussions.prepend(nouvelleDiscussion);
                }else{
                    console.log(dataAjax);
                }
            }
        })
    }
    Object.entries(discussions).forEach(entry => {
        const [key, value] = entry;
        value.lastElementChild.innerText = date_diff(new Date(value.lastElementChild.getAttribute('date')));
    });
}

function afficherPlus(e){
    $.ajax({
        type:'POST',
        url:'/discussion/show',
        dataType:'json',
        data:{start:"non"},
        async:true,
        success:function(data){
            discussions = document.getElementsByClassName('discussion');
            let affichageActuel = discussions.length;
            let nouvelAffichage = 0;
            let reste = 'non';
            Object.entries(data).forEach(entry => {
                const [key, value] = entry;
                if(value['message'] != '' && affichageActuel > 0){
                    affichageActuel--;
                }else if(value['message'] != '' && affichageActuel <= 0 && nouvelAffichage < 3){
                    let nouvelleDiscussion = document.createElement('a');
                    nouvelleDiscussion.setAttribute('href', 'discussion/'.concat(value['id']));
                    nouvelleDiscussion.setAttribute('class', 'discussion');
                    let nouveauConteneurPhoto = document.createElement('div');
                    nouveauConteneurPhoto.setAttribute('class', 'photo_discussion_conteneur');
                    nouvelleDiscussion.append(nouveauConteneurPhoto);
                    let nouvellePhotoDiscussion = document.createElement('img');
                    nouvellePhotoDiscussion.setAttribute('class', 'photo_discussion');
                    nouvellePhotoDiscussion.setAttribute('src', value['photo']);
                    nouvellePhotoDiscussion.setAttribute('alt', 'photo_discussion');
                    nouveauConteneurPhoto.append(nouvellePhotoDiscussion);
                    let nouveauNomDiscussion = document.createElement('h3');
                    nouveauNomDiscussion.setAttribute('class', 'nom_discussion');
                    nouveauNomDiscussion.innerText = value['nom'];
                    nouvelleDiscussion.append(nouveauNomDiscussion);
                    let dernierMessage = document.createElement('p');
                    dernierMessage.setAttribute('class', 'dernier_message');
                    dernierMessage.innerText = value['message'];
                    nouvelleDiscussion.append(dernierMessage);
                    let heureDernierMessage = document.createElement('p');
                    heureDernierMessage.setAttribute('class', 'date_dernier_message');
                    let date1 = new Date(value['date_envoi']['date']);
                    heureDernierMessage.innerText = date_diff(date1);
                    nouvelleDiscussion.append(heureDernierMessage);
                    plusDeDiscussion.insertAdjacentElement('beforebegin', nouvelleDiscussion);
                    nouvelAffichage++;
                }else if(nouvelAffichage >= 3 && value['message'] != ''){
                    reste = 'oui'; 
                }
            });
            if (reste == 'non'){
                plusDeDiscussion.remove();
            }
        }
    })
}