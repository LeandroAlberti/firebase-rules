import * as usuarios from './usuarios.js'
import * as mercados from './mercados.js'
import * as setores from './setores.js'
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
				` <button id="btnInicio">Início</button>
				  <button id="btnUsuarios">Usuários</button>
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
			btnOfertas.onclick = () => abrirPagina('ofertas');
			btnAuth.onclick = () => {
				if (confirm('Deseja sair do aplicativo?')) {
					signOut(auth);
					abrirPagina('inicio');
				}
			};
		} else {
			header.innerHTML =
				`<button id="btnInicio">Início</button>
				 <button id="btnAuth">Entrar</button>
				`;

			btnAuth.onclick = () => abrirPagina('auth');
		}
		btnInicio.onclick = () => abrirPagina('inicio');
	});
}

const abrirPagina = async (path, comHeader = true) => {
	root.innerHTML = '';
	if (comHeader) {
		await criarHeader();
	}
	const dados = await fetch(`pages/${path}.html`);
	const div = document.createElement('div');
	div.innerHTML = await dados.text();
	root.appendChild(div.firstElementChild);

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
			mercados.listarMercados({elementoLista: listaMercados});

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
		case 'setores':
			setores.listarSetores(listaSetores, 'tabela');

			nome.onkeypress = (event) => {
				if (event.key == 'Enter') {
					if (!nome.value) {
						return;
					}

					if (confirm(`Incluir setor ${nome.value}?`)) {
						setores.incluirSetor(nome.value)
							.then(() => nome.value = '')
							.catch((err) => {
								if (err = 'PERMISSION_DENIED') {
									alert('Permissão negada');
									return;
								}
								alert('Erro desconhecido');
								console.log(erro);
							});
					}
				}
			};
			break;
		case 'produtos':
			setores.listarSetores(setor, 'select');

			btnCadastrar.onclick = () => {
				produtos.incluirProduto({
					nome: nome.value,
					marca: marca.value,
					setor: setor.value,
					qtde: qtde.value,
					unidade: unidade.value,
					timeStamp: Date.now()
				}).catch((err) => {
					if (err == 'PERMISSION_DENIED') {
						alert('Permissão negada');
					} else {
						alert(err);
					}
				});
			}

			produtos.listarProdutos(listaProdutos);
			break;
		case 'ofertas':
			btnCadastrar.onclick = () => ofertas.adicionarOferta({
				mercado: mercado.value,
				dataDe: dataDe.valueAsNumber + (new Date().getTimezoneOffset()/60)*60*60*1000,
				dataAte: dataAte.valueAsNumber + (new Date().getTimezoneOffset()/60)*60*60*1000 + 23*60*60*1000 + 59*60*1000 + 59*1000,
				timeStamp: Date.now()
			}).catch((err) => {
				if (err == 'PERMISSION_DENIED') {
					alert('Permissão negada');
				} else {
					alert(err);
				}
			});

			mercados.listarMercados({selectOfertas: true});

			ofertas.listarOfertas({elementoLista: listaOfertas});
			break;
		case 'auth':
			emailInp.focus();
			loginBtn.onclick = () => {
				authMod.login(emailInp.value, passwordInp.value || '0')
					.then(() => abrirPagina('ofertas'))
					.catch((erro) => {
						alert(erro);
					});
			}
			break;
		case 'inicio':
			ofertas.listarOfertas({listarInicio: true});
			break;
	}
}

abrirPagina('inicio');