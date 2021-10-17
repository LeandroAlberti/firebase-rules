import { bd, ref, onValue, push, remove } from "./config.js";
import { dataProdutos } from "./produtos.js";

const refOfertas = ref(bd, '/ofertas');

const abrirProdutos = async (idOferta, mercadoOferta, dataDe, dataAte) => {
	listaProdutos.style.display = 'flex';

	fecharListaProdutos.onclick = () => {
		listaProdutos.style.display = 'none';
	}
	
	titulo.innerHTML = `${mercadoOferta} ${dataDe} - ${dataAte}`;

	buscaProduto.value = '';
	resultadoBusca.innerHTML = '';
	
	buscaProduto.oninput = () => {
		resultadoBusca.innerHTML =
			`
			<p>Nome</p>
			<p>Marca</p>
			<p>Valor</p>
			<p></p>
			`;
		for (const idProduto in dataProdutos) {
			const nomeProduto = dataProdutos[idProduto].nome;
			const marcaProduto = dataProdutos[idProduto].marca;
			const produto = `${nomeProduto.toLowerCase()} ${marcaProduto.toLowerCase()}`;

			if (buscaProduto.value && produto.includes(buscaProduto.value.toLowerCase())) {
				const pNome = document.createElement('p');
				const pMarca = document.createElement('p');
				const inputValorProduto = document.createElement('input');
				const imgAdd = document.createElement('img');

				pNome.className = 'nome';
				pNome.innerHTML = nomeProduto;
				pMarca.innerHTML = marcaProduto;
				inputValorProduto.type = 'tel';
				imgAdd.src = 'images/icons/add.svg';

				const nodes = [pNome, pMarca, inputValorProduto, imgAdd];

				imgAdd.onclick = () => {
					if (inputValorProduto.value) {
						alert(`Incluir produto ${idProduto} na oferta ${idOferta} no valor de ${inputValorProduto.value}`)
						for (const node of nodes) {
							node.remove();
						}
					}
				}

				resultadoBusca.appendChild(pNome);
				resultadoBusca.appendChild(pMarca);
				resultadoBusca.appendChild(inputValorProduto);
				resultadoBusca.appendChild(imgAdd);
			}
		}
	}
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

export const listarOfertas = (elementoLista) => {
	onValue(refOfertas, (snapshot) => {
		if (snapshot.exists()) {
			const objOfertas = snapshot.val();
			elementoLista.innerHTML =
				`<p>Mercado</p>
                <p>De</p>
                <p>Até</p>
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
				pDataDe.innerHTML = `${(new Date(dataDeOferta).getDate()).toString().padStart(2, 0)}/${(new Date(dataDeOferta).getMonth() + 1).toString().padStart(2, 0)}/${new Date(dataDeOferta).getFullYear()}`;
				pDataAte.innerHTML = `${(new Date(dataAteOferta).getDate()).toString().padStart(2, 0)}/${(new Date(dataAteOferta).getMonth() + 1).toString().padStart(2, 0)}/${new Date(dataAteOferta).getFullYear()}`;

				imgProdutos.src = 'images/icons/produtos.png';
				imgProdutos.onclick = () => abrirProdutos(idOferta, mercadoOferta, pDataDe.innerHTML, pDataAte.innerHTML);
				imgRemove.src = 'images/icons/delete.svg';
				imgRemove.onclick = () => removerOferta(mercadoOferta, idOferta, tsOferta);

				elementoLista.appendChild(pMercado);
				elementoLista.appendChild(pDataDe);
				elementoLista.appendChild(pDataAte);
				elementoLista.appendChild(imgProdutos);
				elementoLista.appendChild(imgRemove);
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