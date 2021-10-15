import { bd, ref, push, onValue, remove } from "./config.js";

const refSetores = ref(bd, '/regras/setores');

const removerSetor = (nomeSetor, idSetor, tsSetor) => {
    if (!confirm(`Deseja remover o setor ${nomeSetor} criado em ${new Date(tsSetor).toLocaleString('pt-BR')}?`)) {
        return;
    }

    const removerId = ref(bd, `/regras/setores/${idSetor}`);

    remove(removerId)
        .catch((err) => {
            if (err.code == 'PERMISSION_DENIED') {
                alert('Permissão negada');
            }
        });
}

export const incluirSetor = async (setor) => {
    await push(refSetores,  {nome: setor, timeStamp: Date.now()})
        .catch((err) => {
            throw err.code;
        });
}

export const listarSetores = (elementoLista) => {
    onValue(refSetores, (snapshot) => {
        if (snapshot.exists()) {
            const objSetores = snapshot.val();
            elementoLista.innerHTML = '';
            for (const idSetor in objSetores) {
                const nomeSetor = objSetores[idSetor].nome;
                const tsSetor = objSetores[idSetor].timeStamp;
                const p = document.createElement('p');
                const img = document.createElement('img');

                p.className = 'nome';
                p.innerHTML = nomeSetor;

                img.src = 'images/icons/delete.svg';
                img.style.cursor = 'pointer';
                img.onclick = () => removerSetor(nomeSetor, idSetor, tsSetor);

            	elementoLista.appendChild(p);
            	elementoLista.appendChild(img);
            }
        } else {
            alert('Nenhum setor cadastrado');
        }
    });
}