document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!currentUser) {
    alert("Harap login terlebih dahulu!");
    window.location.href = "register.html";
    return;
  }

  let chats = JSON.parse(localStorage.getItem("chats") || "{}");
  const chatTab = "global";

  const chatMessages = document.getElementById("chatMessages");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  // === Render Chat Global ===
  function renderChat() {
    chatMessages.innerHTML = "";
    const messages = chats[chatTab] || [];

    messages.forEach(msg => {
      const div = document.createElement("div");
      div.className = "chat-message";
      div.classList.add(msg.username === currentUser.username ? "self" : "other");
      div.innerHTML = `
        <img src="${msg.photo}" alt="avatar" class="chat-avatar">
        <div>
          <strong>${msg.username}</strong>
          <p>${msg.text}</p>
        </div>
      `;
      chatMessages.appendChild(div);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // === Kirim Pesan ===
  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const newMsg = {
      username: currentUser.username,
      photo: currentUser.photo || "assets/default-avatar.png",
      text
    };

    if (!chats[chatTab]) chats[chatTab] = [];
    chats[chatTab].push(newMsg);

    localStorage.setItem("chats", JSON.stringify(chats));
    messageInput.value = "";
    renderChat();
  }

  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // === Load awal ke Chat Global ===
  renderChat();
});