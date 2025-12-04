// index.js
if (localStorage.getItem("token") == null) {
  alert("Você precisa estar logado para acessar essa página");
  window.location.href = "./assets/html/signin.html";
}
const userLogadoRaw = localStorage.getItem("userLogado");
let userLogado = null;
try { userLogado = JSON.parse(userLogadoRaw); } catch (_) { userLogado = null; }
const logado = document.querySelector("#logado");
logado.textContent = userLogado && userLogado.nome ? `Olá ${userLogado.nome}` : "Olá!";
function sair() {
  localStorage.removeItem("token");
  localStorage.removeItem("userLogado");
  window.location.href = "./assets/html/signin.html";
}
window.sair = sair;
