import { bd, ref, push, onValue, remove } from "./config.js";

const refProdutos = ref(bd, '/regras/produtos');

const removerProduto = (nomeMercado, idMercado, tsMercado) => {
    if (!confirm(`Deseja remover o produto ${nomeMercado} criado em ${new Date(tsMercado).toLocaleString('pt-BR')}?`)) {
        return;
    }

    const removerId = ref(bd, `/regras/produtos/${idMercado}`);

    remove(removerId)
        .catch((err) => {
            if (err.code == 'PERMISSION_DENIED') {
                alert('Permissão negada');
            }
        });
}

export const incluirProduto = async (produto) => {
    // Validação dos campos
    if (produto.setor == 'Selecione um setor') {
        throw 'Selecione um setor';
    }
    if (!produto.nome) {
        throw 'Digite o nome do produto';
    }
    if (!produto.qtde) {
        throw 'Digite a quantidade do produto';
    }

    if (!confirm(`Incluir produto ${produto.nome}?`)) {
        return;
    }

    await push(refProdutos,  produto)
        .catch((err) => {
            throw err.code;
        });
}

export const listarProdutos = (elementoLista) => {
    onValue(refProdutos, (snapshot) => {
        if (snapshot.exists()) {
            const objProdutos = snapshot.val();
            elementoLista.innerHTML =
                `<p>Produto</p>
                <p>Marca</p>
                <p>Setor</p>
                <p>Qtde</p>
                <p>Un</p>
                <p></p>`;

            for (const idProduto in objProdutos) {
                const nomeProduto = objProdutos[idProduto].nome;
                const marcaProduto = objProdutos[idProduto].marca;
                const setorProduto = objProdutos[idProduto].setor;
                const qtdeProduto = objProdutos[idProduto].qtde;
                const unidadeProduto = objProdutos[idProduto].unidade;
                const tsProduto = objProdutos[idProduto].timeStamp;

                const pNome = document.createElement('p');
                const pMarca = document.createElement('p');
                const pSetor = document.createElement('p');
                const pQtde = document.createElement('p');
                const pUnidade = document.createElement('p');
                const img = document.createElement('img');

                pNome.className = 'nome';
                pNome.innerHTML = nomeProduto;
                pMarca.innerHTML = marcaProduto;
                pSetor.innerHTML = setorProduto;
                pQtde.innerHTML = qtdeProduto;
                pUnidade.innerHTML = unidadeProduto;

                img.src = 'images/icons/delete.svg';
                img.style.cursor = 'pointer';
                img.onclick = () => removerProduto(nomeProduto, idProduto, tsProduto);

            	elementoLista.appendChild(pNome);
            	elementoLista.appendChild(pMarca);
            	elementoLista.appendChild(pSetor);
            	elementoLista.appendChild(pQtde);
            	elementoLista.appendChild(pUnidade);
            	elementoLista.appendChild(img);
            }
        } else {
            alert('Nenhum produto cadastrado');
        }
    });
}