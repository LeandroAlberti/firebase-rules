import { bd, ref, onValue, push, set, update, get } from "./config.js";

const refDados = ref(bd, '/regras/dados');

export const carregarDados = () => {
	onValue(refDados, (snapshot) => {
		const data = snapshot.val();
		if (!data) {
			output.textContent = 'Nenhum dado';
		} else {
			// output.textContent = JSON.stringify(data, null, 4);
			output.innerHTML = '';
			for (const chave in data) {
				output.innerHTML += `<p>${data[chave].addPor + ': ' + data[chave].dado}</p>`;
			}
		}
	});
}

export const limparDados = () => {
	set(refDados, null);
}

export const adicionarDados = (novoDado) => {
	push(refDados, novoDado);
}