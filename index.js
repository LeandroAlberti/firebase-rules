// --- DATABASE ---//

import { bd, ref, onValue, push, set, update, get } from "./config.js";

const refUsuarios = ref(bd, '/regras/usuarios');
const refDados = ref(bd, '/regras/dados');

const carregarUsuarios = () => {
	onValue(refUsuarios, (snapshot) => {
		const data = snapshot.val();
		if (!data) {
			output.textContent = 'Nenhum usuário';
		} else {
			output.textContent = JSON.stringify(data, null, 4);
		}
	});
}

const carregarDados = () => {
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

carregarDados();

listarDados.onclick = async () => {
	carregarDados();
}

input.focus();
input.onkeypress = (event) => {
	if (event.key == 'Enter') {
		if (!auth.currentUser) {
			alert('Nenhum usuário logado');
		} else {
			const novoDado = {};
			novoDado.dado = input.value;
			novoDado.addPor = auth.currentUser.uid;
			push(refDados, novoDado);
			input.value = '';
			input.focus();
		}
	}
}

limparBtn.onclick = () => {
	set(refDados, null);
}

// --- AUTH ---//

import { auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "./config.js";

loginBtn.onclick = () => {
	signInWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
		.then(() => {
			carregarDados();
		})
		.catch((error) => {
			console.log(error);
		});
}

logoutBtn.onclick = async () => {
	try {
		await signOut(auth);
		alert('Saiu');
		carregarDados();
	} catch (error) {
		alert(error);
	}
}

novoUsuario.onclick = () => {
	const emailAtual = auth.currentUser.email;

	createUserWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
		.then((userCredential) => {
			const refNovoUsuario = ref(bd, `regras/usuarios/${userCredential.user.uid}`);

			signInWithEmailAndPassword(auth, emailAtual, prompt('Confirme sua senha'))
				.then((userCredential) => {
					set(refNovoUsuario, { nivel: parseInt(nivelUsuario.value) });

					carregarUsuarios();
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
}
