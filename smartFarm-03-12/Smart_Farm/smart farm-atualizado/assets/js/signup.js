// signup.js
const nome = document.querySelector('#nome');
const labelNome = document.querySelector('#labelNome');
let validNome = false;

const usuario = document.querySelector('#usuario');
const labelUsuario = document.querySelector('#labelUsuario');
let validUsuario = false;

const senha = document.querySelector('#senha');
const labelSenha = document.querySelector('#labelSenha');
let validSenha = false;

const confirmSenha = document.querySelector('#confirmSenha');
const labelConfirmSenha = document.querySelector('#labelConfirmSenha');
let validConfirmSenha = false;

const msgError = document.querySelector('#msgError');
const msgSuccess = document.querySelector('#msgSuccess');

nome.addEventListener('keyup', () => {
  if (nome.value.trim().length <= 2) {
    labelNome.style.color = 'red';
    labelNome.textContent = 'Nome *Insira no mínimo 3 caracteres';
    nome.style.borderColor = 'red';
    validNome = false;
  } else {
    labelNome.style.color = 'green';
    labelNome.textContent = 'Nome';
    nome.style.borderColor = 'green';
    validNome = true;
  }
});

usuario.addEventListener('keyup', () => {
  if (usuario.value.trim().length <= 4) {
    labelUsuario.style.color = 'red';
    labelUsuario.textContent = 'Usuário *Insira no mínimo 5 caracteres';
    usuario.style.borderColor = 'red';
    validUsuario = false;
  } else {
    labelUsuario.style.color = 'green';
    labelUsuario.textContent = 'Usuário';
    usuario.style.borderColor = 'green';
    validUsuario = true;
  }
});

senha.addEventListener('keyup', () => {
  if (senha.value.length <= 5) {
    labelSenha.style.color = 'red';
    labelSenha.textContent = 'Senha *Insira no mínimo 6 caracteres';
    senha.style.borderColor = 'red';
    validSenha = false;
  } else {
    labelSenha.style.color = 'green';
    labelSenha.textContent = 'Senha';
    senha.style.borderColor = 'green';
    validSenha = true;
  }
});

confirmSenha.addEventListener('keyup', () => {
  if (senha.value !== confirmSenha.value) {
    labelConfirmSenha.style.color = 'red';
    labelConfirmSenha.textContent = 'Confirmar Senha *As senhas não conferem';
    confirmSenha.style.borderColor = 'red';
    validConfirmSenha = false;
  } else {
    labelConfirmSenha.style.color = 'green';
    labelConfirmSenha.textContent = 'Confirmar Senha';
    confirmSenha.style.borderColor = 'green';
    validConfirmSenha = true;
  }
});

function cadastrar() {
  if (validNome && validUsuario && validSenha && validConfirmSenha) {
    const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
    const jaExiste = listaUser.some(u => u.userCad === usuario.value);
    if (jaExiste) {
      msgError.style.display = 'block';
      msgError.innerHTML = '<strong>Usuário já existe. Escolha outro.</strong>';
      msgSuccess.textContent = '';
      msgSuccess.style.display = 'none';
      return;
    }
    listaUser.push({
      nomeCad: nome.value.trim(),
      userCad: usuario.value.trim(),
      senhaCad: senha.value
    });
    localStorage.setItem('listaUser', JSON.stringify(listaUser));
    msgSuccess.style.display = 'block';
    msgSuccess.innerHTML = '<strong>Cadastrando usuário...</strong>';
    msgError.style.display = 'none';
    msgError.innerHTML = '';
    setTimeout(() => {
      window.location.href = '../html/signin.html';
    }, 1500);
  } else {
    msgError.style.display = 'block';
    msgError.innerHTML = '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>';
    msgSuccess.textContent = '';
    msgSuccess.style.display = 'none';
  }
}
window.cadastrar = cadastrar;
