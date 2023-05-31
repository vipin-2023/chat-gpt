const chatInput = document.querySelector("#chat-input")
const sendButton = document.querySelector("#send-btn")
const chatContainer = document.querySelector(".chat-container")
const themeButton = document.querySelector("#theme-btn");

const API_KEY = "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";

const loadDataFromLoacalstorage =()=>{
  chatContainer.innerHTML = localStorage.getItem("all-chats");

}
loadDataFromLoacalstorage();

let userText = null;

const createElement = (html,className)=>{
  const chatDiv = document.createElement("div")
  chatDiv.classList.add("chat",className);
  chatDiv.innerHTML=html;
  return chatDiv;
}

const getChatResponse = async (incomingChatDiv)=>{
  const API_URL="https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");

  const requestOptions = {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${API_KEY}`
    },
    body:JSON.stringify({
    model: "text-davinci-003",
    prompt: userText,
    max_tokens: 2048,
    temperature: 0.2,
    n: 1,
    stop: null
    })
  }
console.log("inside a")
try {
  const response = await (await fetch(API_URL,requestOptions)).json();
  console.log("response")
  console.log(response)

  pElement.textContent = response.choices[0].text.trim();

} catch (error) {
  console.log(error)
  console.log("inside c")

}
incomingChatDiv.querySelector(".typing-animation").revome();
incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
localStorage.setItem("all-chats",chatContainer.innerHTML)

}
const copyResponse = (copyBtn)=>{
  const responseTextElement=copyBtn.parentElement.querySelector("P");
  navigator.clipboard.writeText(responseTextElement.textContent);
  copyBtn.getAttribute('name') = "checkmark-done-outline";
  setTimeout(()=>copyBtn.getAttribute('name') = "copy-outline",1000);
}

const showTypingAnimation =()=>{
    const html = `   <div class="chat-content">
    <div class="chat-details">
        <img src="/assets/chat_gpt_logo.png" alt="user">
      <div class="typing-animation">
        <div class="typing-dot" style="--delay:0.2s"></div>
        <div class="typing-dot" style="--delay:0.3s"></div>
        <div class="typing-dot" style="--delay:0.4s"></div>
      </div>
    </div>
    <span onclick="copyResponse(this)" ><ion-icon class="ionic-icons" name="copy-outline"></ion-icon></span>
</div>`
const incomingChatDiv = createElement(html,"incoming")
chatContainer.appendChild(incomingChatDiv)
getChatResponse(incomingChatDiv)
}


const handleOutgoingChat = () => {
    userText = chatInput.value.trim()
    if(!userText) return;
    const html = ` <div class="chat-content">
                   <div class="chat-details">
                   <img src="/assets/avatar.jpeg" alt="user">
                   <p> </p>
                   </div>
                   </div>`
const outgoingChatDiv = createElement(html,"outgoing")
outgoingChatDiv.querySelector("p").textContent=userText;
chatContainer.appendChild(outgoingChatDiv)
setTimeout(showTypingAnimation,500)
}


themeButton.addEventListener("click",()=>{
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color",themeButton.innerHTML)
  themeButton.innerHTML = document.body.classList.contains("light-mode")?`<ion-icon name="contrast-outline">`:`<ion-icon name="sunny-outline">`
})
sendButton.addEventListener("click", handleOutgoingChat);
// sendButton.addEventListener('keypress', function (e) {
//   if (e.key === 'Enter') {
//     handleOutgoingChat
//   } });