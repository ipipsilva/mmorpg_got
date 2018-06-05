var crypto = require('crypto');

function UsuariosDAO(connection) {
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(dadosUsuario){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("usuarios", function(erro, collection){
           
            // criptografa a senha
            var senha_criptografada = crypto.createHash('md5').update(dadosUsuario.senha).digest('hex');

            dadosUsuario.senha = senha_criptografada;
            collection.insert(dadosUsuario);
            mongoCliente.close();
        });
    });
}

UsuariosDAO.prototype.autenticar = function(dadosUsuario, req, res){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("usuarios", function(erro, collection){

            var senha_criptografada = crypto.createHash('md5').update(dadosUsuario.senha).digest('hex');
            dadosUsuario.senha = senha_criptografada;

            collection.find(dadosUsuario).toArray(function(erro, result){

                if(result[0] != undefined){
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                }

                if(req.session.autorizado){
                    res.redirect('/jogo');
                } else {
                    res.render('index', {erro_autenticacao:'usuário e / ou senha inválido.', dadosUsuario: dadosUsuario, erros:{}});
                }

            });
            mongoCliente.close();
        });
    })
}

module.exports = function(){
    return UsuariosDAO;
}