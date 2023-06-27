const chatInput = document.querySelector("#chat-input")
const sendButton = document.querySelector("#send-btn")
const chatContainer = document.querySelector(".chat-container")
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;

const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;
const loadDataFromLoacalstorage =()=>{
  const themeColor = localStorage.getItem("theme-color");

  document.body.classList.toggle("light-mode",themeColor==='sunny-outline');
  var element = themeButton.querySelector('ion-icon[name]');
  localStorage.setItem("theme-color",element.getAttribute("name"))
  themeButton.innerHTML = document.body.classList.contains("light-mode")?`<ion-icon name="contrast-outline">`:`<ion-icon name="sunny-outline">`
  
  const defaultText =`<div class="default-text">
    <h1>ChatGpt</h1>
    <p>Start a conversation and explore the power of AI<br>Your chats goes here .</p>
  </div>`


  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0,chatContainer.scrollHeight);

}
loadDataFromLoacalstorage();


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
  pElement.textContent = "Ooops ! Something went wrong while retrieving the response.Please try angain.";

}
incomingChatDiv.querySelector(".typing-animation").remove();
incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
chatContainer.scrollTo(0,chatContainer.scrollHeight);
localStorage.setItem("all-chats",chatContainer.innerHTML);

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
chatContainer.appendChild(incomingChatDiv);
chatContainer.scrollTo(0,chatContainer.scrollHeight);

getChatResponse(incomingChatDiv)
}


const handleOutgoingChat = () => {
    userText = chatInput.value.trim()
    if(!userText) return;

  chatInput.value="";
  chatInput.style.height = `${initialHeight}px `;

    const html = ` <div class="chat-content">
                   <div class="chat-details">
                   <img src="/assets/avatar.jpeg" alt="user">
                   <p> </p>
                   </div>
                   </div>`
const outgoingChatDiv = createElement(html,"outgoing")
outgoingChatDiv.querySelector("p").textContent=userText;
document.querySelector('.default-text')?.remove();
chatContainer.appendChild(outgoingChatDiv);
chatContainer.scrollTo(0,chatContainer.scrollHeight);
setTimeout(showTypingAnimation,500)
}


themeButton.addEventListener("click",()=>{
  document.body.classList.toggle("light-mode");
 

  var element = themeButton.querySelector('ion-icon[name]');
 
  localStorage.setItem("theme-color",element.getAttribute("name"))
  themeButton.innerHTML = document.body.classList.contains("light-mode")?`<ion-icon name="contrast-outline">`:`<ion-icon name="sunny-outline">`
});
deleteButton.addEventListener("click",()=>{
  if(confirm("Are you sure want to delete all chats ?")){
    localStorage.removeItem("all-chats");
    loadDataFromLoacalstorage();
  };

})

chatInput.addEventListener("input",()=>{
  chatInput.style.height = `${initialHeight}px `;
  chatInput.style.height = `${chatInput.scrollHeight}px `;

});
chatInput.addEventListener("keydown",(e)=>{
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth >800){
    e.preventDefault();
    handleOutgoingChat();
  }
})
sendButton.addEventListener("click", handleOutgoingChat);
// sendButton.addEventListener('keypress', function (e) {
//   if (e.key === 'Enter') {
//     handleOutgoingChat
//   } });