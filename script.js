let isAdmin = false;

function send() {
  const text = document.getElementById('textInput').value;
  const image = document.getElementById('imageInput').files[0];
  const messages = document.getElementById('messages');

  const div = document.createElement('div');
  if (text) {
    div.textContent = text;
  }

  if (image) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(image);
    div.appendChild(img);
  }

  messages.appendChild(div);
}

function checkCode() {
  const code = document.getElementById('secretCode').value;
  if (code === "556655") { // <- тут твой секретный код
    isAdmin = true;
    document.getElementById('adminPanel').style.display = 'block';
    alert("Добро пожаловать, админ!");
  } else {
    alert("Неверный код!");
  }
}
