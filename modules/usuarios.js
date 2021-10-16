import { bd, ref, onValue, set, remove, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "./config.js";

const refUsuarios = ref(bd, '/usuarios');

const removerUsuario = (uid, nome) => {
    if (confirm(`Deseja remover o usuário ${nome}?`)) {
        const refUid = ref(bd, `/usuarios/${uid}`)
        remove(refUid);
    }
}

export const carregarUsuarios = () => {
	onValue(refUsuarios, (snapshot) => {
		const data = snapshot.val();
		if (!data) {
			listaUsuarios.textContent = 'Nenhum usuário';
		} else {
            listaUsuarios.innerHTML = '<p>Nome</p><p>Nivel</p><p></p>';
            for (const usuario in data) {
                const p = document.createElement('p');
                const select = document.createElement('select');
                const img = document.createElement('img');

                p.className = "nome";
                p.innerHTML = data[usuario].nome;
                select.innerHTML =
                    `
                        <option ${data[usuario].nivel == 1 ? 'selected' : ''}>1</option>
                        <option ${data[usuario].nivel == 2 ? 'selected' : ''}>2</option>
                    `;
                img.src = "images/icons/deleteUser.svg";
                img.alt = "Deletar Usuário";
                img.onclick = () => removerUsuario(usuario, data[usuario].nome);

                listaUsuarios.appendChild(p);
                listaUsuarios.appendChild(select);
                listaUsuarios.appendChild(img);
            }
		}
	});
}

export const novoUsuario = async (nome, email, senha, nivel) => {
    try {
        if (!nome) {
            const erro = {};
            erro.code = 'Digite o nome';
            throw erro;
        }
        const emailAtual = auth.currentUser.email;
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const refNovoUsuario = await ref(bd, `regras/usuarios/${userCredential.user.uid}`);
        await signInWithEmailAndPassword(auth, emailAtual, prompt('Confirme sua senha'));
        return await set(refNovoUsuario, { nivel: parseInt(nivel), nome: nome });
    } catch (error) {
        throw error;
    }
}