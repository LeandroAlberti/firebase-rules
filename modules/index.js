import * as dados from './dados.js'
import * as usuarios from './usuarios.js'
import * as mercados from './mercados.js'
import * as produtos from './produtos.js'
import * as ofertas from './ofertas.js'
import * as auth from './auth.js'

const abrirHeader = async () => {
	const header = await fetch('components/header.html');
	root.innerHTML = await header.text();

	btnDados.onclick = () => abrirPagina('dados');
	btnUsuarios.onclick = () => abrirPagina('usuarios', true, false);
	btnMercados.onclick = () => abrirPagina('mercados');
	btnProdutos.onclick = () => abrirPagina('produtos');
	btnOfertas.onclick = () => abrirPagina('ofertas');
	btnLogin.onclick = () => abrirPagina('auth');
}

const abrirOutput = async () => {
	const output = await fetch('components/output.html');
	const div = document.createElement('div');
	div.innerHTML = await output.text();
	root.appendChild(div.firstElementChild);
}

const abrirPagina = async (path, comHeader = true, comOutput = true) => {
	if (comHeader) {
		await abrirHeader();
	}

	const dados = await fetch(`pages/${path}.html`);
	const div = document.createElement('div');
	div.innerHTML = await dados.text();
	root.appendChild(div.firstElementChild);

	if (comOutput) {
		await abrirOutput();
	}

	atribuicoes(path);
}

const atribuicoes = async (path) => {
	switch (path) {
		case 'dados':
			listarDados.onclick = async () => dados.carregarDados();
			limparBtn.onclick = () => dados.limparDados();

			input.focus();
			input.onkeypress = (event) => {
				if (event.key == 'Enter') {
					if (!auth.auth.currentUser) {
						alert('Nenhum usuário logado');
					} else {
						const novoDado = {};
						novoDado.dado = input.value;
						novoDado.addPor = auth.auth.currentUser.uid;
						dados.adicionarDados(novoDado);
						input.value = '';
						input.focus();
					}
				}
			}

			dados.carregarDados();
			break;
		case 'usuarios':
			usuarios.carregarUsuarios();
			break;
		case 'mercados':

			break;
		case 'produtos':

			break;
		case 'ofertas':

			break;
		case 'auth':
			
			loginBtn.onclick = () => {
				auth.login(emailInp.value, passwordInp.value || '1')
					.then((ret) => {
						abrirPagina('dados');
					})
					.catch((erro) => alert(erro.code));
			}
			
			logoutBtn.onclick = async () => {
				auth.logout()
					.then(() => abrirPagina('dados'))
					.catch((erro) => alert(erro));
			};
			
			novoUsuario.onclick = () => {
				auth.novoUsuario(emailInp.value, passwordInp.value, nivelUsuario.value)
					.then((ret) => abrirPagina('usuarios'))
					.catch((erro) => alert(erro.code))
			}

			break;
	}
}

abrirPagina('dados');