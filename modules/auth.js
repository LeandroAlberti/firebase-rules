import { auth, signInWithEmailAndPassword } from "./config.js";

export const login = async (email, senha) => {
    try {
        return await signInWithEmailAndPassword(auth, email, senha);
    } catch (erro) {
        throw erro;
    }
}