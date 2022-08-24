let plusDeDiscussion = document.getElementById('plus_discussion');
let discussions = document.getElementsByClassName('discussion');

const url = JSON.parse(document.getElementById("mercure-url").textContent);

const eventSource = new EventSource(url);
eventSource.onmessage = e => {
    let data = JSON.parse(e.data);
    
}

(function(){
    Object.entries(discussions).forEach(entry => {
        const [key, value] = entry;
        value.lastElementChild.innerText = date_diff(new Date(value.lastElementChild.innerText));
    });
})()

plusDeDiscussion.addEventListener('click', afficherPlus);

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