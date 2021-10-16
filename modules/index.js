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

			return produtos.listarProdutos(listaProdutos, 'tabela');

			const objProdutos = {
				idProd1: {
					nome: 'Nome Prod 1',
					marca: 'Marca 1',
					setor: 'Setor 1',
					qtde: '90',
					unidade: 'g',
					timeStamp: 19874937854893
				},
				idProd2: {
					nome: 'Nome Prod 2',
					marca: 'Marca 2',
					setor: 'Setor 2',
					qtde: '1',
					unidade: 'kg',
					timeStamp: 19874937854893
				}
			}

			for (const idProd in objProdutos) {
				const nomeProduto = objProdutos[idProd].nome;
				const marcaProduto = objProdutos[idProd].marca;
				const setorProduto = objProdutos[idProd].setor;
				const qtdeProduto = objProdutos[idProd].qtde;
				const unidadeProduto = objProdutos[idProd].unidade;
				const tsSetor = objProdutos[idProd].timeStamp;
				const pNome = document.createElement('p');
				const pMarca = document.createElement('p');
				const pSetor = document.createElement('p');
				const pQtde = document.createElement('p');
				const pUni = document.createElement('p');
				const img = document.createElement('img');

				pNome.className = 'nome';
				pNome.innerHTML = nomeProduto;
				pMarca.innerHTML = marcaProduto;
				pSetor.innerHTML = setorProduto;
				pQtde.innerHTML = qtdeProduto;
				pUni.innerHTML = unidadeProduto;
				
				img.src = 'images/icons/delete.svg';
				img.style.cursor = 'pointer';
				// img.onclick = () => removerSetor(nomeSetor, idProd, tsSetor);

				listaProdutos.appendChild(pNome);
				listaProdutos.appendChild(pMarca);
				listaProdutos.appendChild(pSetor);
				listaProdutos.appendChild(pQtde);
				listaProdutos.appendChild(pUni);
				listaProdutos.appendChild(img);
			}
			break;
		case 'ofertas':
			limparBtn.onclick = () => ofertas.limparDados();

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

// abrirPagina('ofertas', true,  true);
abrirPagina('produtos');