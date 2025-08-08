// static/script.js
const ADMIN_CODE = "556655";
let isAdmin = false;
const endpoints = {
    get: "/get",
    send: "/send"
};

document.getElementById('btn-enter').addEventListener('click', checkCode);
document.getElementById('btn-send').addEventListener('click', sendMessage);
document.getElementById('btn-logout').addEventListener('click', logout);

function checkCode(){
    const code = document.getElementById('code').value.trim();
    if(code === ADMIN_CODE){
        isAdmin = true;
        document.getElementById('admin-panel').style.display = 'flex';
        document.getElementById('code-section').style.display = 'none';
        document.getElementById('code').value='';
        alert('Вы вошли как админ!');
    } else {
        alert('Неверный код!');
    }
}

function logout(){
    isAdmin = false;
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('code-section').style.display = 'flex';
    alert('Вы вышли');
}

// Fetch messages from server and render them
async function fetchMessages(){
    try {
        const res = await fetch(endpoints.get);
        if(!res.ok) throw new Error('Ошибка загрузки');
        const messages = await res.json();
        renderMessages(messages);
    } catch(e){
        console.error(e);
    }
}

function renderMessages(messages){
    const container = document.getElementById('messages');
    container.innerHTML = '';
    // messages expected in descending order (newest first)
    for(const m of messages){
        const div = document.createElement('div');
        div.className = 'msg';
        if(m.text) div.innerHTML += `<div class="text">${escapeHtml(m.text)}</div>`;
        if(m.image){
            const img = document.createElement('img');
            img.src = m.image;
            img.alt = 'img';
            div.appendChild(img);
        }
        container.appendChild(div);
    }
}

// Send message: read image as dataURL (base64) and POST JSON
async function sendMessage(){
    if(!isAdmin) return;
    const text = document.getElementById('messageInput').value.trim();
    const file = document.getElementById('imageInput').files[0];
    if(!text && !file){ alert('Нужно ввести текст или выбрать картинку!'); return; }

    let imageData = '';
    if(file){
        imageData = await readFileAsDataURL(file);
    }

    try {
        const res = await fetch(endpoints.send, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({text, image: imageData})
        });
        const resj = await res.json();
        if(resj.status === 'ok'){
            document.getElementById('messageInput').value='';
            document.getElementById('imageInput').value='';
            fetchMessages();
        } else {
            alert('Ошибка отправки');
        }
    } catch(e){
        console.error(e);
        alert('Ошибка сети');
    }
}

function readFileAsDataURL(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function(m) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]; });
}

// Auto-refresh every 3 seconds
fetchMessages();
setInterval(fetchMessages, 3000);
