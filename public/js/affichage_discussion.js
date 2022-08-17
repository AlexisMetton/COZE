let plusDeDiscussion = document.getElementById('plus_discussion');
let discussions = document.getElementsByClassName('discussion');

plusDeDiscussion.addEventListener('click', afficherPlus);

function afficherPlus(e){
    $.ajax({
        type:'POST',
        url:'/discussion/show',
        dataType:'json',
        data:{start:"non"},
        async:true,
        success:function(data){
            console.log(data);
        }
    })
}