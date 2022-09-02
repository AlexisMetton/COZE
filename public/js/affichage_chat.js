let messages = document.getElementById('liste_message');
const url = JSON.parse(document.getElementById("mercure-url").textContent);
const user_username = JSON.parse(document.getElementById("user-username").textContent);
const eventSource = new EventSource(url.concat('/', window.location.href.split('/')[window.location.href.split('/').length - 1]));
eventSource.onmessage = e => {
    let data = JSON.parse(e.data);
    let nouveauMessage = document.createElement('div');
    console.log(data);
    let interieurNouveauMessage = '';
    if(data['nom'] == user_username){
        nouveauMessage.setAttribute('class', 'message_user');
        interieurNouveauMessage = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu_user\'>');
        if(data['fichier'] != ''){
            let fichiers = data['fichier'].split('*');
            let type_fichiers = data['type_fichier'].split('*');
            if(fichiers.length != type_fichiers.length){
                console.log('Erreur fichiers sur la table.');
            }else{
                Object.entries(fichiers).forEach(entry => {
                    const[key, fichier] = entry;
                    if(/img/.test(fichier)){
                        interieurNouveauMessage += '<img class=\'image_message\' alt=\'image message\' src=\'' + fichier + '\'>';
                    }else if(/video/.test(fichier)){
                        interieurNouveauMessage += '<video controls width="80%" style=\'align-self:center;padding:15px;\'><source src="' + fichier +'" type="' + type_fichiers[key] +'"></video>';
                    }else if(/audio/.test(fichier)){
                        interieurNouveauMessage += '<audio controls style="align-self:center; padding:15px;" src="' + fichier + '"></audio>';
                    }else{ 
                        interieurNouveauMessage += '<a href=\'' + fichier + '\'>' + fichier.split('/').pop() + '</a>';
                    }

                });
                
            }
        }
        interieurNouveauMessage  += '<p>' + data['message'] + '</p></div></div><p class=\'date_message_user\' date=\'' + Date(data["heure"]["date"]) +'\' >A l\'instant</p></div>';
        nouveauMessage.innerHTML = interieurNouveauMessage;
        messages.append(nouveauMessage);
        messages.scrollTo(0, messages.scrollHeight);
        e.srcElement.value = "";
    }else{
        nouveauMessage.setAttribute('class', 'message');
        interieurNouveauMessage = '<h3 class=\'nom\'>'.concat(data['nom'], '</h3><div class=\'message_info\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><div class=\'message_contenu\'>');
        if(data['fichier'] != ''){
            let fichiers = data['fichier'].split('*');
            let type_fichiers = data['type_fichier'].split('*');
            if(fichiers.length != type_fichiers.length){
                console.log('Erreur fichiers sur la table.');
            }else{
                Object.entries(fichiers).forEach(entry => {
                    const[key, fichier] = entry;
                    if(/img/.test(data['fichier'])){
                        interieurNouveauMessage += '<img class=\'image_message\' alt=\'image message\' src=\'' + fichier + '\'>';
                    }else if(/video/.test(data['fichier'])){
                        interieurNouveauMessage += '<video controls width="80%" style=\'align-self:center;padding:15px;\'><source src="' + fichier +'" type="' + type_fichiers[key] +'"></video>';
                    }else if(/audio/.test(data['fichier'])){
                        interieurNouveauMessage += '<audio controls style="align-self:center; padding:15px;" src="' + fichier + '"></audio>';
                    }else{ 
                        interieurNouveauMessage += '<a href=\'' + fichier + '\'>' + fichier.split('/').pop() + '</a>';
                    }
                });
            }
        }
        interieurNouveauMessage += '<p>', data['message'] + '</p></div></div><p class=\'date_message\' date=\'' + Date(data["heure"]["date"]) +'\' >A l\'instant</p></div>';
        nouveauMessage.innerHTML = interieurNouveauMessage;
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

let recorded = 0;
var myRecorder = {
    objects: {
        context: null,
        stream: null,
        recorder: null
    },
    init: function () {
        if (null === myRecorder.objects.context) {
            myRecorder.objects.context = new (
                    window.AudioContext || window.webkitAudioContext
                    );
        }
    },
    start: function () {
        var options = {audio: true, video: false};
        navigator.mediaDevices.getUserMedia(options).then(function (stream) {
            myRecorder.objects.stream = stream;
            myRecorder.objects.recorder = new Recorder(
                    myRecorder.objects.context.createMediaStreamSource(stream),
                    {numChannels: 1}
            );
            myRecorder.objects.recorder.record();
        }).catch(function (err) {});
    },
    stop: function () {
        if (null !== myRecorder.objects.stream) {
            myRecorder.objects.stream.getAudioTracks()[0].stop();
        }
        if (null !== myRecorder.objects.recorder) {
            myRecorder.objects.recorder.stop();

            // Validate object
                // Export the WAV file
                myRecorder.objects.recorder.exportWAV(function (blob) {
                    var url = (window.URL || window.webkitURL)
                            .createObjectURL(blob);
                    let fi = new File([blob], 'fichier' + recorded);

                    // Prepare the playback
                    var audioObject = document.createElement('audio');
                    audioObject.toggleAttribute('controls');
                    audioObject.setAttribute('src', url);

                    // Append to the list
                    let fichiers = document.getElementById('liste_fichier');
                    if (!fichiers){
                        let separateur1 = document.createElement('div');
                        separateur1.setAttribute('style', 'width:100%;');
                        fichiers = document.createElement('div');
                        fichiers.setAttribute('id', 'liste_fichier');
                        input_fichier.insertAdjacentElement('beforebegin', fichiers);
                        input_fichier.insertAdjacentElement('beforebegin', separateur1);
                    }
                    fichierAEnvoyer.push(fi);
                    let fichier = document.createElement('div');
                    fichier.setAttribute('class', 'fichier-son');
                    fichier.setAttribute('style', 'position:relative;')
                    fichiers.append(fichier);
                    let nom_fichier = document.createElement('p');
                    nom_fichier.setAttribute('class', 'nom_fichier');
                    nom_fichier.innerText = fi.name;
                    let supprimer = document.createElement('button');
                    supprimer.setAttribute('class', 'bouton_supprimer');
                    supprimer.innerText = 'X';
                    fichier.append(nom_fichier);
                    fichier.prepend(supprimer);
                    supprimer.addEventListener('click', supprimerFichier);
                    fichier.append(audioObject);
                });
        }
        recorded++;
    }
};  
/*if(data['nom'] == user_username){
    nouveauMessage.setAttribute('class', 'message_user');
    nouveauMessage.innerHTML = '<h3 class=\'nom_user\'>'.concat(data['nom'], '</h3><div class=\'message_info_user\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><p class=\'message_contenu_user\'>',holderObject, '</p></div><p class=\'date_message_user\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
    messages.append(nouveauMessage);
    messages.scrollTo(0, messages.scrollHeight);
    e.srcElement.value = "";
}else{
    nouveauMessage.setAttribute('class', 'message');
    nouveauMessage.innerHTML = '<h3 class=\'nom\'>'.concat(data['nom'], '</h3><div class=\'message_info\'><div class=\'photo_conteneur\'><img class=\'photo\' src=\'', data['photo'], '\' alt=\'photo\'></div><p class=\'message_contenu\'>', data['message'], '</p></div><p class=\'date_message\' date=\'', Date(data["heure"]["date"]),'\' >A l\'instant</p></div>');
    messages.append(nouveauMessage);
    messages.scrollTo(0, messages.scrollHeight);
    e.srcElement.value = "";
}*/



// Prepare the record button
$('[data-role="controls"] > button').click(function () {
    // Initialize the recorder
    myRecorder.init();

    // Get the button state 
    var buttonState = !!$(this).attr('data-recording');

    // Toggle
    if (!buttonState) {
        $(this).attr('data-recording', 'true');
        myRecorder.start();
    } else {
        $(this).attr('data-recording', '');
        myRecorder.stop(document.getElementById('fichier-son'));
    }
});



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