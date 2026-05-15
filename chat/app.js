import { db } from './firebase.js';

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
messageInput.addEventListener('keypress', function(e) {

  if(e.key === 'Enter') {
    sendMessage();
  }

});

window.sendMessage = async function () {
    const text = messageInput.value.trim();
    if (text === '') return;

    // ১. আগে ইনপুট বক্স খালি করে দিন
    messageInput.value = ''; 
    console.log("Input cleared, sending to Firebase...");

    try {
        // ২. তারপর ডাটাবেসে পাঠানোর চেষ্টা করুন
        await addDoc(collection(db, 'messages'), {
            text: text,
            createdAt: serverTimestamp()
        });
        console.log("Successfully saved to Firebase!");
    } catch (error) {
        console.error("Firebase store error:", error);
        // যদি এরর হয় তবে মেসেজটি ফেরত দিন যাতে ইউজার বুঝতে পারে
        messageInput.value = text;
        alert("Could not send message. Please check your internet or Firebase rules.");
    }
}

const q = query(collection(db, 'messages'), orderBy('createdAt'));

onSnapshot(q, (snapshot) => {

  chatBox.innerHTML = '';

  snapshot.forEach((docItem) => {

    const data = docItem.data();

    const div = document.createElement('div');
   div.classList.add('message');

    div.innerHTML = `
      ${data.text}
      <br><br>
      <button onclick="deleteMessage('${docItem.id}')">Delete</button>
    `;

    chatBox.appendChild(div);
  });
});

window.deleteMessage = async function(id) {
  await deleteDoc(doc(db, 'messages', id));
}