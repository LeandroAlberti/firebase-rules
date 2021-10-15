import { bd, ref, push, onValue, remove } from "./config.js";

const refMercados = ref(bd, '/regras/mercados');

const removerMercado = (nomeMercado, idMercado, tsMercado) => {
    if (!confirm(`Deseja remover o mercado ${nomeMercado} criado em ${new Date(tsMercado).toLocaleString('pt-BR')}?`)) {
        return;
    }

    const removerId = ref(bd, `/regras/mercados/${idMercado}`);

    remove(removerId)
        .catch((err) => {
            if (err.code == 'PERMISSION_DENIED') {
                alert('Permissão negada');
            }
        });
}

export const incluirMercado = async (mercado) => {
    await push(refMercados,  {nome: mercado, timeStamp: Date.now()})
        .catch((err) => {
            throw err.code;
        });
}

export const listarMercados = (elementoLista) => {
    onValue(refMercados, (snapshot) => {
        if (snapshot.exists()) {
            const objMercados = snapshot.val();
            elementoLista.innerHTML = '';
            for (const idMercado in objMercados) {
                const nomeMercado = objMercados[idMercado].nome;
                const tsMercado = objMercados[idMercado].timeStamp;
                const p = document.createElement('p');
                const img = document.createElement('img');

                p.className = 'nome';
                p.innerHTML = nomeMercado;

                img.src = 'images/icons/delete.svg';
                img.style.cursor = 'pointer';
                img.onclick = () => removerMercado(nomeMercado, idMercado, tsMercado);
            	elementoLista.appendChild(p);
            	elementoLista.appendChild(img);
            }
        } else {
            alert('Nenhum mercado cadastrado');
        }
    });
}