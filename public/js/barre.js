 let barre = document.getElementById('barreSearch');
 let aucun = $('.user').innerText = "aucun utilisateur";
 let result = document.getElementById('resultat');
 const user_username = JSON.parse(document.getElementById("user-username").textContent);
 let dami = document.getElementsByClassName('ami');

$(document).ready(function(){

    $('#barreSearch').on('keyup',function(){

        let utilisateur = $(this).val();
        let suggestion = "";
        if(utilisateur != "" ){
            const newLocal =  '/recherche_utilisateur' ;
            $.ajax({
                    type: 'POST',
                    url:newLocal,
                    data:{user: utilisateur},
                    success: function(data){
                        console.log(data);
                        let users =  data.filter(element => element.username);    
                        if(users != ""){ 
                                let resultat = document.getElementById('resultats');
                                if(!resultat){
                                    resultat = document.createElement('div');
                                    resultat.setAttribute('id','resultats');
                                    document.getElementById('barreSearch').insertAdjacentElement("afterend", resultat);
                                }
                                users.forEach(element =>{
                                    if(element.username!= user_username){
                                        let exist = false
                                        Object.values(dami).forEach(value =>{
                                            if(value.lastElementChild.innerText == element.username){
                                                exist = true;
                                            }
                                        })
                                        if(!exist){
                                            suggestion+=`<div id="user-`.concat(element.id,`"  class="user" onclick="ajout_amis(event)"><img class="photo" src="`,element.photo,`" alt="photo de profil"><p style='margin-left:10px' class="username">${element.username}</p></div>`); 
                                        }else{
                                            suggestion+=`<div id="user-`.concat(element.id,`"  class="user" onclick="deja_ami(event)"><img class="photo" src="`,element.photo,`" alt="photo de profil"><p style='margin-left:10px' class="username">${element.username}</p></div>`); 
                                        }
                                        resultat.innerHTML=suggestion; 
                                    }
                                }) 
                        }else{
                            suggestion+=`<div class="aucun"><p>aucun&nbsp;resultat</p></div>`;
                            let resultat = document.getElementById('resultats');
                            if(!resultat){
                                resultat = document.createElement('div');
                                resultat.setAttribute('id','resultats');
                                document.getElementById('barreSearch').insertAdjacentElement("afterend", resultat);
                            }
                            resultat.innerHTML=suggestion;
                        }               
                    }
                            /*if(element.username){
                            let user = document.createElement('p');
                            user.setAttribute('class', 'user')
                            let result = $('#resultat').append(element.username);
                            result.append(user);
                            }else {
                            $('#resultat').remove();
                            $('#resultat').append(aucun);
                            }*/
        }) 
        }else{
                if($('#resultats')){
                    document.getElementById('resultats').innerHTML ="";
                }
            //document.querySelectorAll('.user').forEach(element => {
               // element.innerHTML = suggestion;
            //})
        }
    })
})

function ajout_amis(event){
        $('.amis').remove();
        let ami= "";
        let point = "";
        console.log(event);
        if(event.path.length==8){
            ami= event.target;
            point = event.srcElement;
             
        }else if(event.path.length==9){
            ami= event.target.parentElement
            point = event.srcElement.parentElement;
           
        }
        $(`<div onclick= amis() class="amis"><a style="color:whitesmoke;" href="/ami/add/`.concat(point.getAttribute('id').split('-')[point.getAttribute('id').split('-').length -1],`" class="amii"> ajouter en ami </a></div>`)).appendTo(ami);
        event.stopPropagation(event); 
 
}

function amis(){
     window.alert('vous avez envoyé une demande d\'ami !!')
}

function deja_ami(event){
    $('.amis').remove();
    let ami= "";
    let point = "";
    if(event.path.length==8){
        ami= event.target.parentElement
        point = event.srcElement.parentElement;
         
    }else{
        ami= event.target
        point = event.srcElement;
       
    }
    $(`<div class="amis">vous êtes déja ami</div>`).appendTo(ami);
    event.stopPropagation(event); 
}

function rechercheAmis(){
    document.getElementById("resultats").style.display = "flex";
    document.getElementById("overlay").style.zIndex = "10";
    document.getElementById("recherche").style.zIndex = "11";
}

function overlayRecherche(){
    document.getElementById("resultats").style.display = "none";
    document.getElementById("recherche").style.zIndex = "1";
    document.getElementById("overlay").style.zIndex = "-100";
}





