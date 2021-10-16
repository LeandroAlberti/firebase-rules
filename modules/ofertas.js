import { bd, ref, onValue, push, remove } from "./config.js";

const refOfertas = ref(bd, '/ofertas');

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
                <p></p>`;

			for (const idOferta in objOfertas) {
				const mercadoOferta = objOfertas[idOferta].mercado;
				const dataDeOferta = objOfertas[idOferta].dataDe;
				const dataAteOferta = objOfertas[idOferta].dataAte;
				const tsOferta = objOfertas[idOferta].timeStamp;

				const pMercado = document.createElement('p');
				const pDataDe = document.createElement('p');
				const pDataAte = document.createElement('p');
				const img = document.createElement('img');

				pMercado.className = 'nome';
				pMercado.innerHTML = mercadoOferta;
				pDataDe.innerHTML = `${(new Date(dataDeOferta).getDate()).toString().padStart(2, 0)}/${(new Date(dataDeOferta).getMonth() + 1).toString().padStart(2, 0)}/${new Date(dataDeOferta).getFullYear()}`;
				pDataAte.innerHTML = `${(new Date(dataAteOferta).getDate()).toString().padStart(2, 0)}/${(new Date(dataAteOferta).getMonth() + 1).toString().padStart(2, 0)}/${new Date(dataAteOferta).getFullYear()}`;

				img.src = 'images/icons/delete.svg';
				img.style.cursor = 'pointer';
				img.onclick = () => removerOferta(mercadoOferta, idOferta, tsOferta);

				elementoLista.appendChild(pMercado);
				elementoLista.appendChild(pDataDe);
				elementoLista.appendChild(pDataAte);
				elementoLista.appendChild(img);
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