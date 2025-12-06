// signin.js
// Iniciar música ao carregar
const music = document.getElementById('backgroundMusic');
      
      // Tentar tocar automaticamente
music.play().catch(() => {
        // Se falhar, tocar após qualquer interação
  document.addEventListener('click', () => {
    music.play();
  }, { once: true });
  });

      // Tornar o botão de olho funcional sem depender de CSS/ícone externo
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("toggleSenha");
  const input = document.getElementById("senha");
  if (btn) {
    btn.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  }
      });

const msgError = document.getElementById('msgError');
function entrar() {
  const usuario = document.querySelector('#usuario');
  const userLabel = document.querySelector('#userLabel');
  const senha = document.querySelector('#senha');
  const senhaLabel = document.querySelector('#senhaLabel');

  const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
  let userValid = { nome: '', user: '', senha: '' };

  listaUser.forEach((item) => {
    if (usuario.value === item.userCad && senha.value === item.senhaCad) {
      userValid = { nome: item.nomeCad, user: item.userCad, senha: item.senhaCad };
    }
  });

  if (usuario.value === userValid.user && senha.value === userValid.senha) {
    window.location.href = '../html/index.html';
    const mathRandom = Math.random().toString(16).substring(2);
    const token = mathRandom + mathRandom;
    localStorage.setItem('token', token);
    localStorage.setItem('userLogado', JSON.stringify(userValid));
  } else {
    userLabel.style.color = 'red';
    usuario.style.borderColor = 'red';
    senhaLabel.style.color = 'red';
    senha.style.borderColor = 'red';
    msgError.style.display = 'block';
    msgError.textContent = 'Usuário ou senha incorretos';
    usuario.focus();
  }
}
window.entrar = entrar;
