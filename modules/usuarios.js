import { bd, ref, onValue, push, set, update, get } from "./config.js";

const refUsuarios = ref(bd, '/regras/usuarios');

export const carregarUsuarios = () => {
	onValue(refUsuarios, (snapshot) => {
		const data = snapshot.val();
		if (!data) {
			listaUsuarios.textContent = 'Nenhum usuário';
		} else {
			listaUsuarios.textContent = JSON.stringify(data, null, 4);
		}
	});
}