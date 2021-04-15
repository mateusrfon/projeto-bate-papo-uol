const user = User();
setInterval(GetMessages, 3000);

function GetMessages() {
    const promessa = axios.get(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages'
    );
    promessa.then(FormatMessages);
}

function FormatMessages(messages){
    const chat = document.querySelector('.chat');
    chat.innerHTML = '';
    for(let i=0; i<messages.data.length; i++){
        if (messages.data[i].type === 'status'){
            chat.innerHTML +=`
            <div class="msg ${messages.data[i].type}">
                <span class="gray">(${messages.data[i].time}) </span>
                <strong>${messages.data[i].from} </strong>
                ${messages.data[i].text}
            </div>
            `;
        } else if (messages.data[i].type === 'private_message') {
            if (user === messages.data[i].to) {
                chat.innerHTML +=`
                <div class="msg private">
                    <span class="gray">(${messages.data[i].time}) </span>
                    <strong>${messages.data[i].from} </strong>
                    reservadamente para 
                    <strong>Você: </strong>
                    ${messages.data[i].text}
                </div>
                `;
            }
        } else {
            chat.innerHTML +=`
            <div class="msg">
                <span class="gray">(${messages.data[i].time}) </span>
                <strong>${messages.data[i].from} </strong>
                para 
                <strong>${messages.data[i].to}: </strong>
                ${messages.data[i].text}
            </div>
            `;
        }
    }
}

function User() {
    const user = prompt('Qual o seu nome?');
    return user;
}

function Users() {

}

function Send() {

}

//<ion-icon name="person-circle" class="menu-icons"></ion-icon>

/*{
    from: "João",
    to: "Todos",
    text: "entra na sala...",
    type: "status",
    time: "08:01:17"
}*/