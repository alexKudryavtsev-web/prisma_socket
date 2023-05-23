const app = () => {
  const socket = io('http://localhost:3000');

  const msgInput = document.querySelector('.message-input');
  const msgList = document.querySelector('.messages-list');
  const sendBtn = document.querySelector('.send-btn');
  const usernameInput = document.querySelector('.username-input');
  const messages = [];

  async function getMessages() {
    try {
      const { data } = await axios.get('http://localhost:3000/api/chat');

      renderMessages(data);

      data.forEach((item) => {
        messages.push(item);
      });
    } catch (error) {
      console.log(error);
    }
  }

  function renderMessages(data) {
    let messages = '';

    data.forEach(
      (message) =>
        (messages += `
        <li class="bg-dark p-2 rounded mb-2 d-flex justify-content-between message">
            <div class="mr-2">
                <span class="text-info">${message.username}</span>
                <p class="text-light">${message.text}</p>
            </div>
            <span class="text-muted text-right date">
                ${new Date(message.createdAt).toLocaleString('ru', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
            </span>
        </li>`),
    );

    msgList.innerHTML = messages;
  }

  getMessages();

  function sendMessage(message) {
    socket.emit('sendMessage', message);
  }

  socket.on('recMessage', (message) => {
    messages.push(message);
    renderMessages(messages);
  });

  function handleSendMessage(text) {
    if (!text.trim()) {
      return;
    }

    sendMessage({
      username: usernameInput.value || 'anonymous',
      text,
      createdAt: new Date(),
    });

    msgInput.value = '';
  }

  msgInput.addEventListener(
    'keydown',
    (e) => e.keyCode === 13 && handleSendMessage(e.target.value),
  );

  sendBtn.addEventListener('click', () => handleSendMessage(msgInput.value));
};

app();
