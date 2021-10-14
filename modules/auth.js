import { auth, signInWithEmailAndPassword } from "./config.js";

export const login = async (email, senha) => {
    try {
        return await signInWithEmailAndPassword(auth, email, senha);
    } catch (erro) {
        switch (erro.code) {
            case 'auth/invalid-email':
            case 'auth/user-not-found':
                throw 'E-mail inválido';
            case 'auth/wrong-password':
                throw 'Senha incorreta';
            default:
                throw erro.code;
        }
    }
}