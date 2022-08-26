let plusDeDiscussion = document.getElementById('plus_discussion');
let discussions = document.getElementsByClassName('discussion');
let liste_discussions = document.getElementById('liste_conversations');
const urls = document.getElementsByClassName('mercure-url');



for(let i = 0; i < urls.length; i++){
    let url = JSON.parse(urls[i].textContent);
    new EventSource(url).onmessage = update;
}

(function(){
    Object.entries(discussions).forEach(entry => {
        const [key, value] = entry;
        value.lastElementChild.innerText = date_diff(new Date(value.lastElementChild.innerText));
    });
})()

if(plusDeDiscussion != null){
    plusDeDiscussion.addEventListener('click', afficherPlus);
}