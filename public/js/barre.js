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
                        let users =  data.filter(element => element.username);    
                        if(users != ""){ 
                                let resultat = document.createElement('div');
                                resultat.setAttribute('id','resultat');
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
                                        document.getElementById('resultats').innerHTML=suggestion; 
                                    }else{
                                        suggestion;
                                    }
                                }) 
                        }else{
                            suggestion+=`<div class="aucun"><p>aucun&nbsp;resultat</p></div>`;
                            document.getElementById('resultats').innerHTML=suggestion;
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
            document.querySelectorAll('.user').forEach(element => {
                element.innerHTML = suggestion;
            })
        }
    })
})

function ajout_amis(event){
        $('.amis').remove();
        let ami= "";
        let point = ""
        if(event.path.length==8){
            ami= event.target.parentElement
            point = event.srcElement.parentElement;
             
        }else{
            ami= event.target
            point = event.srcElement;
           
        }
        $(`<div onclick= amis() class="amis"><a href="/ami/add/`.concat(point.getAttribute('id').split('-')[point.getAttribute('id').split('-').length -1],`" class="amii"> ajouté en ami ?</a></div>`)).appendTo(ami);
        event.stopPropagation(event); 
 
}

function amis(){
     window.alert('vous avez envoyé une demande d\'ami !!')
}

function deja_ami(event){
    $('.amis').remove();
    let ami= "";
    let point = ""
    if(event.path.length==8){
        ami= event.target.parentElement
        point = event.srcElement.parentElement;
         
    }else{
        ami= event.target
        point = event.srcElement;
       
    }
    $(`<div class="amis">vous êtes deja ami</div>`).appendTo(ami);
    event.stopPropagation(event); 
}





