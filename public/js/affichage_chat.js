let messages = document.getElementById('liste_message');

(function(){
    Object.entries(messages.children).forEach(entry => {
        const [key, value] = entry;
        value.lastElementChild.innerText = date_diff(new Date(value.lastElementChild.innerText));
    });
})()
