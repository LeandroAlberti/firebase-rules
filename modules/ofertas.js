import { bd, ref, onValue, push, remove, update } from "./config.js";
import { dataProdutos } from "./produtos.js";
import { mascaraPreco, timestampParaDataBR } from "./utils.js";

const refOfertas = ref(bd, '/ofertas');

const adicionarProdutoNaOferta = (strBusca, nodes, idOferta, idProduto) => {
	if (!strBusca) {
		return alert('Digite um produto para buscar');
	}

	if (!nodes[2].value) {
		return alert('Digite o valor do produto');
	}

	const refProdutosOferta = ref(bd, `/ofertas/${idOferta}/produtos/`);

	const novoProdutoOferta = {};
	novoProdutoOferta[idProduto] = nodes[2].value;

	update(refProdutosOferta, novoProdutoOferta);

	for (const node of nodes) {
		node.remove();
	}

	buscaProduto.value = '';
	buscaProduto.focus();
	resultadoBusca.innerHTML = '';
}

const removerProdutoOferta = (produto, idOferta) => {
	const nomeProduto = dataProdutos[produto].nome;
	
	if (!confirm(`Remover produto ${nomeProduto}?`)) {
		return;
	}

	const refProdutosOferta = ref(bd, `/ofertas/${idOferta}/produtos/${produto}`);

	remove(refProdutosOferta)
		.catch((err) => {
			if (err.code == 'PERMISSION_DENIED') {
				alert('Permissão negada');
			} else {
				alert('Erro desconhecido');
				console.log(err.code);
			}
		});
}

const abrirProdutos = async (idOferta, mercadoOferta, dataDe, dataAte) => {
	listaProdutos.style.display = 'flex';

	fecharListaProdutos.onclick = () => {
		listaProdutos.style.display = 'none';
	}

	titulo.innerHTML = `${mercadoOferta} ${dataDe} - ${dataAte}`;
	buscaProduto.value = '';

	buscaProduto.oninput = () => {
		if (!buscaProduto.value) {
			return resultadoBusca.innerHTML = '';
		}
		resultadoBusca.innerHTML =
			`<b>Nome</b>
			<b>Marca</b>
			<b>Valor</b>
			<b></b>`;

		for (const idProduto in dataProdutos) {
			const nomeProduto = dataProdutos[idProduto].nome;
			const marcaProduto = dataProdutos[idProduto].marca;
			const produto = `${nomeProduto.toLowerCase()} ${marcaProduto.toLowerCase()}`;

			if (produto.includes(buscaProduto.value.toLowerCase())) {
				const pNome = document.createElement('p');
				const pMarca = document.createElement('p');
				const inputValorProduto = document.createElement('input');
				const imgAdd = document.createElement('img');

				pNome.className = 'nome';
				pNome.innerHTML = nomeProduto;
				pMarca.innerHTML = marcaProduto;
				inputValorProduto.type = 'tel';

				inputValorProduto.oninput = () => inputValorProduto.value = mascaraPreco(inputValorProduto.value, 6);
				inputValorProduto.onkeydown = (evento) => {
					if (evento.key == 'Enter') {
						imgAdd.click();
					}
				}
				imgAdd.src = 'images/icons/add.svg';

				const nodes = [pNome, pMarca, inputValorProduto, imgAdd];

				imgAdd.onclick = () => adicionarProdutoNaOferta(buscaProduto.value, nodes, idOferta, idProduto);

				resultadoBusca.appendChild(pNome);
				resultadoBusca.appendChild(pMarca);
				resultadoBusca.appendChild(inputValorProduto);
				resultadoBusca.appendChild(imgAdd);
			}
		}
	}

	const refProdutosOferta = ref(bd, `/ofertas/${idOferta}/produtos/`);

	onValue(refProdutosOferta, (snap) => {
		listaProdutosOfertas.innerHTML = '';
		if (snap.exists()) {
			listaProdutosOfertas.innerHTML =
				`<b>Produto</b>
				<b>Marca</b>
				<b>Valor</b>
				<p></p>`;

			for (const produto in snap.val()) {
				const nomeProduto = dataProdutos[produto].nome;
				const marcaProduto = dataProdutos[produto].marca;
				const valorDoProduto = snap.val()[produto];

				const pProduto = document.createElement('p');
				const pMarca = document.createElement('p');
				const pValor = document.createElement('p');
				const imgRemove = document.createElement('img');

				pProduto.className = 'nome';
				pProduto.innerHTML = nomeProduto;
				pMarca.innerHTML = marcaProduto;
				pValor.innerHTML = valorDoProduto;
				imgRemove.src = 'images/icons/delete.svg';
				imgRemove.onclick = () => removerProdutoOferta(produto, idOferta);

				listaProdutosOfertas.appendChild(pProduto);
				listaProdutosOfertas.appendChild(pMarca);
				listaProdutosOfertas.appendChild(pValor);
				listaProdutosOfertas.appendChild(imgRemove);
			}
		}
	});
}

const removerOferta = (mercadoOferta, idOferta, tsOferta) => {
	if (!confirm(`Deseja remover a oferta ${mercadoOferta} criada em ${new Date(tsOferta).toLocaleString('pt-BR')}?`)) {
		return;
	}

	const removerId = ref(bd, `/ofertas/${idOferta}`);

	remove(removerId)
		.catch((err) => {
			if (err.code == 'PERMISSION_DENIED') {
				alert('Permissão negada');
			}
		});
}

export const listarOfertas = (opcoes = {}) => {
	onValue(refOfertas, (snapshot) => {
		if (snapshot.exists()) {
			const objOfertas = snapshot.val();

			// Listar ofertas no início
			if (opcoes.listarInicio) {
				for (const oferta in objOfertas) {

					if (objOfertas[oferta].dataDe <= Date.now() && objOfertas[oferta].dataAte >= Date.now()) {
						console.log(`Mercado: ${objOfertas[oferta].mercado.padEnd(14, '.')}, De: ${timestampParaDataBR(objOfertas[oferta].dataDe)}, Hoje: ${timestampParaDataBR(Date.now())}, Até: ${timestampParaDataBR(objOfertas[oferta].dataAte)}`);
					} else {
						// Não Mostrar
						// console.log(`Mercado: ${objOfertas[oferta].mercado.padEnd(14, '.')}, De: ${timestampParaDataBR(objOfertas[oferta].dataDe)}, Hoje: ${timestampParaDataBR(Date.now())}, Até: ${timestampParaDataBR(objOfertas[oferta].dataAte)}`);
					}

				}
				return;
			}

			opcoes.elementoLista.innerHTML =
				`<b>Mercado</b>
                <b>De</b>
                <b>Até</b>
                <p></p>
                <p></p>`;

			for (const idOferta in objOfertas) {
				const mercadoOferta = objOfertas[idOferta].mercado;
				const dataDeOferta = objOfertas[idOferta].dataDe;
				const dataAteOferta = objOfertas[idOferta].dataAte;
				const tsOferta = objOfertas[idOferta].timeStamp;

				const pMercado = document.createElement('p');
				const pDataDe = document.createElement('p');
				const pDataAte = document.createElement('p');
				const imgProdutos = document.createElement('img');
				const imgRemove = document.createElement('img');

				pMercado.className = 'nome';
				pMercado.innerHTML = mercadoOferta;
				pDataDe.innerHTML = timestampParaDataBR(dataDeOferta);				
				pDataAte.innerHTML = timestampParaDataBR(dataAteOferta);
				imgProdutos.src = 'images/icons/produtos.png';
				imgProdutos.onclick = () => abrirProdutos(idOferta, mercadoOferta, pDataDe.innerHTML, pDataAte.innerHTML);
				imgRemove.src = 'images/icons/delete.svg';
				imgRemove.onclick = () => removerOferta(mercadoOferta, idOferta, tsOferta);

				opcoes.elementoLista.appendChild(pMercado);
				opcoes.elementoLista.appendChild(pDataDe);
				opcoes.elementoLista.appendChild(pDataAte);
				opcoes.elementoLista.appendChild(imgProdutos);
				opcoes.elementoLista.appendChild(imgRemove);
			}
		} else {
			alert('Nenhuma oferta cadastrada');
		}
	});
}

export const adicionarOferta = async (novaOferta) => {
	// Validar campos
	if (!novaOferta.mercado) {
		throw 'Selecione o mercado';
	}
	if (!novaOferta.dataDe || !novaOferta.dataAte || (novaOferta.dataDe > novaOferta.dataAte)) {
		throw 'Verifique o período da oferta';
	}
	if (novaOferta.dataAte < Date.now()) {
		throw 'Período da oferta já passou';
	}

	if (!confirm(`Incluir oferta do mercado ${novaOferta.mercado}?`)) {
		return;
	}

	await push(refOfertas, novaOferta)
		.catch((err) => {
			throw err.code;
		});
}
