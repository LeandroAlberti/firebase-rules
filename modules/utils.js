export const mascaraPreco = (preco, max) => {
    if (max < 3) {
        throw 'Parâmetro max de mascaraPreco() precisa ser maior que 2.';
    }
    preco = preco.replace(/\D/g, '');
    if (!preco) return '';
    preco = parseInt(preco).toString();
    if (preco.length == 1) return preco.replace(/(\d{1})/, '0,0$1');
    if (preco.length == 2) return preco.replace(/(\d{2})/, '0,$1');
    if (preco.length > max) preco = preco.substr(0, max);
    return preco.replace(/(\d+)(\d{2})/, '$1,$2');
}