function UsuariosDAO(connection) {
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(dadosUsuario){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("usuarios", function(erro, collection){
            collection.insert(dadosUsuario);
            mongoCliente.close();
        });
    });
}

UsuariosDAO.prototype.autenticar = function(dadosUsuario, req, res){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("usuarios", function(erro, collection){
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