const socket = io("http://localhost:5600");

//  Get DOM elements in respective Js variables
const form = document.getElementById("sendContainer");
const messageInput = document.getElementById("msgInput");
const messageContainer = document.querySelector(".container");

//  Audio that will play on recieve message
var audio = new Audio("ting.mp3");

// a function which will append event to the container
const append = (message, position) => {
  const msgElem = document.createElement("div");
  msgElem.innerText = message;
  msgElem.classList.add("message");
  msgElem.classList.add(position);
  messageContainer.append(msgElem);

  if (position == "left") audio.play(); // play audio while message is recieved
};

//  a function which will append time event to the container
const appendTime = (message, position) => {
  const timeElem = document.createElement("div");
  timeElem.innerText = message;
  timeElem.classList.add("time");
  timeElem.classList.add(position);
  messageContainer.append(timeElem);
};

// a function which will return current time with hours & minutes
const getCurrentTime = () => {
  const dateTime = new Date();
  const time = dateTime.getHours() + ": " + dateTime.getMinutes();
  return time;
};

// get user name using prompt
const names = prompt("Enter your name to join");
//  send server message that new user join
socket.emit("new-user-joined", names);

//  If any new user joins, recieve the event from server
socket.on("user-joined", (names) => {
  // append message to the container
  append(`${names} joined the chat at ${getCurrentTime()}`, "center");
});

//  If server sends a message, recieve it
socket.on("receive", (data) => {
  // append message to the container
  append(` ${data.message}`, "left");
  appendTime(`${data.name}, ${data.time}`, "left");
});

// If any user left the chat, append the info to the container
socket.on("left", (names) => {
  append(`${names} left the chat at ${getCurrentTime()}`, "center-back"); // append message to the container
});

//  if any form is submitted, send the message to the server
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // create message
  const message = { text: messageInput.value, time: getCurrentTime() };

  // append message to the container
  append(`${message.text}`, "right");
  appendTime(`You, ${message.time}`, "right");
  // broadcast the message to the server
  socket.emit("send", message);

  // empty value after form is submitted
  messageInput.value = "";
});
