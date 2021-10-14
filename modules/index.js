import * as usuarios from './usuarios.js'
import * as mercados from './mercados.js'
import * as produtos from './produtos.js'
import * as ofertas from './ofertas.js'
import * as auth from './auth.js'
import { auth as auth2, signOut, onAuthStateChanged } from './config.js'

const criarHeader = () => {
	root.innerHTML = '<div id="header" class="secao"></div>';
	onAuthStateChanged(auth2, (user) => {
		if (user) {
			header.innerHTML =
				` <button id="btnUsuarios">Usuários</button>
				  <button id="btnMercados">Mercados</button>
				  <button id="btnSetores">Setores</button>
				  <button id="btnProdutos">Produtos</button>
				  <button id="btnOfertas">Ofertas</button>
				  <button id="btnAuth">Sair</button>
			  	`;

			btnUsuarios.onclick = () => abrirPagina('usuarios', true, false);
			btnMercados.onclick = () => abrirPagina('mercados', true, false);
			btnSetores.onclick = () => abrirPagina('setores', true, false);
			btnProdutos.onclick = () => abrirPagina('produtos', true, false);
			btnOfertas.onclick = () => abrirPagina('ofertas');
			btnAuth.onclick = () => {
				signOut(auth2);
				abrirPagina('ofertas');
			};
		} else {
			header.innerHTML =
				`	<button id="btnOfertas">Ofertas</button>
					<button id="btnAuth">Entrar</button>
				`;

			btnOfertas.onclick = () => abrirPagina('ofertas');
			btnAuth.onclick = () => abrirPagina('auth', true, false);
		}
	});
}

const criarOutput = () => {
	const pre = document.createElement('pre');
	pre.id = 'output';
	pre.className = 'secao';
	root.appendChild(pre);
}

const abrirPagina = async (path, comHeader = true, comOutput = true) => {
	root.innerHTML = '';
	if (comHeader) {
		await criarHeader();
	}
	const dados = await fetch(`pages/${path}.html`);
	const div = document.createElement('div');
	div.innerHTML = await dados.text();
	root.appendChild(div.firstElementChild);

	if (comOutput) {
		criarOutput();
	}

	await atribuicoes(path);
}

const atribuicoes = async (path) => {
	switch (path) {
		case 'usuarios':
			novoUsuarioBtn.onclick = () => {
				usuarios.novoUsuario(nome.value, email.value, senha.value, nivelUsuario.value)
					.then(() => {
						nome.value = '';
						email.value = '';
						senha.value = '';
						nivelUsuario.value = 1;
						usuarios.carregarUsuarios();
					})
					.catch((erro) => alert(erro.code))
			}

			usuarios.carregarUsuarios();
			break;
		case 'mercados':

			break;
		case 'produtos':

			break;
		case 'ofertas':
			listarDados.onclick = async () => ofertas.carregarDados();
			limparBtn.onclick = () => ofertas.limparDados();

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

			ofertas.carregarDados();
			break;
		case 'auth':
			loginBtn.onclick = () => {
				auth.login(emailInp.value, passwordInp.value || '1')
					.then((ret) => {
						abrirPagina('ofertas');
					})
					.catch((erro) => alert(erro.code));
			}
			break;
	}
}

abrirPagina('ofertas');