let user;
let to = 'Todos';
let usersLength = 0;
let messageType = 'message';

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
            if (user === messages.data[i].to || user === messages.data[i].from || messages.data[i].to === 'Todos') {
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
    const lastmsg = document.querySelector('.msg:last-child');
    lastmsg.scrollIntoView();
}

function User() {
    const input = document.querySelector('.login input');
    //user = prompt('Qual o seu nome?');
    if (input.value !== '') {
        user = input.value;
        const promessa = axios.post(
            'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants',
            {name: user}
        );
        
        promessa.then(StartChat);
        promessa.catch(NewUser);
    }
}

function StartChat(){
    const login = document.querySelector('.login');
    login.classList.add('hidden');
    GetMessages();
    GetUsers();
    setInterval(GetMessages, 3000);
    setInterval(UserAlive, 5000);
    setInterval(GetUsers, 10000);
}

function NewUser() {
    alert('Este nome já está em uso, digite outro nome.');
}

function UserAlive(){
    axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status',
        {name: user}
    );
}

function EnterPressed(event) {
    if (event.keyCode == 13) {
        SendMessage();
    }
}

function SendMessage() {
    const input = document.querySelector('.bottom input');
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
    alert('Desconectado, a página será recarregada.')
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
    users.innerHTML = `
        <button onclick="MessageTo('Todos')">
            <div>
                <ion-icon name="people" class="menu-icons"></ion-icon>
                <span>Todos</span>
            </div>
            <ion-icon name="checkmark-sharp" class="check-icon selected"></ion-icon>
        </button>
    `; //limpar menu para jogar novos nomes
    usersLength = getusers.data.length;
    for(let i=0; i<getusers.data.length; i++){
        if (user !== getusers.data[i].name){
            users.innerHTML +=`
                <button onclick="MessageTo('${getusers.data[i].name}')">
                    <div>
                        <ion-icon name="person-circle" class="menu-icons"></ion-icon>
                        <span>${getusers.data[i].name}</span>
                    </div>
                    <ion-icon name="checkmark-sharp" class="check-icon"></ion-icon>
                </button>
            `;
        }
    }
    MessageTo(to);
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
    const users = document.querySelector('.users');
    to = who;
    for (let i=1; i<=usersLength; i++) { //+1 pois tem a div Todos???? Ahhhhhh, mas tem eu que não aparece, por isso não precisa kkkkkk
        const button = users.querySelector(`button:nth-of-type(${i})`);
        const span = button.querySelector('span');
        if (span.innerHTML === to) {
            const uncheck = document.querySelector('.users .selected');
            uncheck.classList.remove('selected');
            const check = button.querySelector('.check-icon'); //quem recebera o check
            check.classList.add('selected'); //recebimento do check
        }
    }
    MessageToType();
}

function MessageType(what) {
    messageType = what;

    const uncheck = document.querySelector('.message-type .selected');
    uncheck.classList.remove('selected');
    const check = document.querySelector(`.message-type .${messageType}`); //quem recebera o check
    check.classList.add('selected');

    MessageToType();
}

function MessageToType() {
    const writing = document.querySelector('.writing-to-how');
    writing.innerHTML = '';
    if (messageType === 'message') {
        writing.innerHTML = `Enviando para ${to} (publicamente)`;
    } else {
        writing.innerHTML = `Enviando para ${to} (reservadamente)`;
    } 
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