// signin.js
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
    window.location.href = '../../index.html';
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
