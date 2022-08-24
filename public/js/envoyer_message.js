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
                envoie.value = '';
            }
        })
    }
}