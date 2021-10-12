import { auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "./config.js";
import { bd, ref, set } from "./config.js";

export const login = async (email, senha) => {
    try {
        return await signInWithEmailAndPassword(auth, email, senha);
    } catch (erro) {
        throw erro;
    }
}

export const logout = async () => {
    if (!auth.currentUser) {
        throw 'Nenhum usuário conectado';
    }

    try {
        await signOut(auth);
        alert('Saiu');
    } catch (error) {
        alert(error.message);
    }
}

export const novoUsuario = async (email, senha, nivel) => {
    try {
        const emailAtual = auth.currentUser.email;
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const refNovoUsuario = await ref(bd, `regras/usuarios/${userCredential.user.uid}`);
        await signInWithEmailAndPassword(auth, emailAtual, prompt('Confirme sua senha'));
        return await set(refNovoUsuario, { nivel: parseInt(nivel) });
    } catch (error) {
        throw error;
    }
}