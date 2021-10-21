import { bd, ref, push, onValue, remove } from "./config.js";

const refMercados = ref(bd, '/mercados');

const removerMercado = (nomeMercado, idMercado, tsMercado) => {
    if (!confirm(`Deseja remover o mercado ${nomeMercado} criado em ${new Date(tsMercado).toLocaleString('pt-BR')}?`)) {
        return;
    }

    const removerId = ref(bd, `/mercados/${idMercado}`);

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

export const listarMercados = (opcoes = {}) => {
    onValue(refMercados, (snapshot) => {
        if (snapshot.exists()) {
            const objMercados = snapshot.val();

            // lista do cadastro de mercados
            if (opcoes.elementoLista) {                
                opcoes.elementoLista.innerHTML = '';
                for (const idMercado in objMercados) {
                    const nomeMercado = objMercados[idMercado].nome;
                    const tsMercado = objMercados[idMercado].timeStamp;
                    const p = document.createElement('p');
                    const img = document.createElement('img');
    
                    p.className = 'nome';
                    p.innerHTML = nomeMercado;
    
                    img.src = 'images/icons/delete.svg';
                    img.onclick = () => removerMercado(nomeMercado, idMercado, tsMercado);
                    opcoes.elementoLista.appendChild(p);
                    opcoes.elementoLista.appendChild(img);
                }
            }

            // select do cadastro de ofertas
            if (opcoes.selectOfertas) {
                mercado.innerHTML = '<option></option>';

                for (const idMercado in objMercados) {
                    mercado.innerHTML += `<option>${objMercados[idMercado].nome}</option>`;
                }
            }

        } else {
            alert('Nenhum mercado cadastrado');
        }
    });
}