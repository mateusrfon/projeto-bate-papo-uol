let user;
let to = 'Todos';
let messageType = 'message';
User();

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
            if (user === messages.data[i].to || user === messages.data[i].from) {
                chat.innerHTML +=`
                <div class="msg private">
                    <span class="gray">(${messages.data[i].time}) </span>
                    <strong>${messages.data[i].from} </strong>
                    reservadamente para 
                    <strong>${messages.data[i].to}: </strong>
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
    user = prompt('Qual o seu nome?');
    const promessa = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants',
        {name: user}
    );
    
    promessa.then(StartChat);
    promessa.catch(NewUser);
}

function StartChat(){
    GetMessages();
    GetUsers();
    setInterval(GetMessages, 3000);
    setInterval(UserAlive, 5000);
    setInterval(GetUsers, 10000);
}

function NewUser() {
    user = prompt('Este nome já está em uso, digite outro nome.');
    const promessa = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants',
        {name: user}
    );
    
    promessa.then(StartChat);
    promessa.catch(NewUser);
}

function UserAlive(){
    axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status',
        {name: user}
    );
}

function SendMessage() {
    const input = document.querySelector('input');
    if (input.value !== '') {
        const promessa = axios.post(
            'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages',
            {
                from: user,
                to: to,  // ou usuário específico para o bônus
                text: input.value,
                type: messageType // ou "private_message" para o bônus
            }
        );
        promessa.then(GetMessages);
        promessa.catch(Reload);
        input.value = '';
    }
}

function Reload(){
    window.location.reload();
}

function GetUsers() {
    const promessa = axios.get(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants'
    );
    promessa.then(FillUsers);
}

function FillUsers(getusers) {
    const users = document.querySelector('.users') //local do menu onde serão inseridos os usuários
    users.innerHTML = ''; //limpar menu para jogar novos nomes
    for(let i=0; i<getusers.data.length; i++){
        if (user !== getusers.data[i].name){
            users.innerHTML +=`
                <button onclick="MessageTo('${getusers.data[i].name}')">
                    <ion-icon name="person-circle" class="menu-icons"></ion-icon>
                    <span>${getusers.data[i].name}</span>
                </button>
            `;
        }
    }
}

function ShowMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.remove('hidden')
}

function CloseMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.add('hidden')
}

function MessageTo(who) {
    to = who;
    //MessageTo('Todos')
}

function MessageType(what) {
    messageType = what;
    //MessageType('message')
    //MessageType('private_message')
}

/*{
[
	{
		name: "João"
	},
	{
		name: "Maria"
	}
]
}*/