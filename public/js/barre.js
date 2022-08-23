let barre = document.getElementById('barreSearch');
 let aucun = $('.user').innerText = "aucun utilisateur";
 let result = document.getElementById('resultat');

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
                            let photo = document.createElement('img');
                            photo.setAttribute('class', 'photo');
                            photo.setAttribute('alt', 'photo de profil')
                            photo.src = '../img/profil.svg';
                            let resultat = document.createElement('div');
                            resultat.setAttribute('id','resultat');
                            users.forEach(element =>{
                                suggestion+=`<div  class="user" onclick="ajout_amis(event)"><p>${element.username}</p></div>`; 
                                document.getElementById('resultats').innerHTML=suggestion; 
                               $("<img class='photo' src='../img/profil.svg'></img>").prependTo(".user");
                                    
                            }) 
                        }else{
                            suggestion+=`<div class="aucun"><p>aucun resultat</p></div>`;
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
    if($('.amis').css("display","none")){
        let ami= event.target
        $(`<div class="amis"><a href=/ami/add/ class="ami"> ajouté en amis ?</a></div>`).appendTo(ami);
        event.stopPropagation(ami)
    }else{
        $('.amis').css("display","none")
    console.log(event)
    }
}





