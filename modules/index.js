import * as usuarios from './usuarios.js'
import * as mercados from './mercados.js'
import * as produtos from './produtos.js'
import * as ofertas from './ofertas.js'
import * as authMod from './auth.js'
import { auth, signOut, onAuthStateChanged } from './config.js'

const criarHeader = () => {
	root.innerHTML = '<div id="header" class="secao"></div>';
	onAuthStateChanged(auth, (user) => {
		loader.style.display = 'none';
		if (user) {
			header.innerHTML =
				` <button id="btnUsuarios">Usuários</button>
				  <button id="btnMercados">Mercados</button>
				  <button id="btnSetores">Setores</button>
				  <button id="btnProdutos">Produtos</button>
				  <button id="btnOfertas">Ofertas</button>
				  <button id="btnAuth">Sair</button>
			  	`;

			btnUsuarios.onclick = () => abrirPagina('usuarios');
			btnMercados.onclick = () => abrirPagina('mercados');
			btnSetores.onclick = () => abrirPagina('setores');
			btnProdutos.onclick = () => abrirPagina('produtos');
			btnOfertas.onclick = () => abrirPagina('ofertas', true, true);
			btnAuth.onclick = () => {
				if (confirm('Deseja sair do aplicativo?')) {
					signOut(auth);
					abrirPagina('ofertas', true, true);
				}
			};
		} else {
			header.innerHTML =
				`	<button id="btnOfertas">Ofertas</button>
					<button id="btnAuth">Entrar</button>
				`;

			btnOfertas.onclick = () => abrirPagina('ofertas', true, true);
			btnAuth.onclick = () => abrirPagina('auth');
		}
	});
}

const criarOutput = () => {
	const pre = document.createElement('pre');
	pre.id = 'output';
	pre.className = 'secao';
	root.appendChild(pre);
}

const abrirPagina = async (path, comHeader = true, comOutput = false) => {
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
			mercados.listarMercados(listaMercados);

			nome.onkeypress = (event) => {
				if (event.key == 'Enter') {
					if (!nome.value) {
						return;
					}
					if (confirm(`Incluir mercado ${nome.value}?`)) {
						mercados.incluirMercado(nome.value)
							.then(() => nome.value = '')
							.catch((err) => {
								if (err = 'PERMISSION_DENIED') {
									alert('Permissão negada');
								}
							});
					}
				}
			};

			break;
		case 'produtos':

			break;
		case 'ofertas':
			limparBtn.onclick = () => ofertas.limparDados();

			input.focus();
			input.onkeypress = (event) => {
				if (event.key == 'Enter') {
					if (!authMod.auth.currentUser) {
						alert('Nenhum usuário logado');
					} else {
						const novoDado = {};
						novoDado.dado = input.value;
						novoDado.addPor = authMod.auth.currentUser.uid;
						dados.adicionarDados(novoDado);
						input.value = '';
						input.focus();
					}
				}
			}

			await ofertas.carregarDados();
			break;
		case 'auth':
			emailInp.focus();
			loginBtn.onclick = () => {
				authMod.login(emailInp.value, passwordInp.value || '0')
					.then(() => abrirPagina('ofertas', true,  true))
					.catch((erro) => {
						alert(erro);
					});
			}
			break;
	}
}

abrirPagina('ofertas', true,  true);