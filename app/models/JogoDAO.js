var objectId = require('mongodb').ObjectId;

function JogoDAO(connection) {
    this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function(usuario){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("jogo", function(erro, collection){
            collection.insert({
                usuario: usuario,
                moeda: 15,
                suditos:10,
                temor: Math.floor(Math.random() * 1000),
                sabedoria: Math.floor(Math.random() * 1000),
                comercio: Math.floor(Math.random() * 1000),
                magia: Math.floor(Math.random() * 1000)
            });
            mongoCliente.close();
        });
    });
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("jogo", function(erro, collection){
            collection.find({usuario: usuario}).toArray(function(erro, result){
                res.render('jogo', {img_casa: casa, jogo: result[0], msg: msg});
            });
            mongoCliente.close();
        });
    })
}

JogoDAO.prototype.acao = function(dadosAcao){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("acao", function(erro, collection){

            var date = new Date();
            
            var tempo = null;

            switch(parseInt(dadosAcao.acao)) {
                case 1: tempo = 1 * 60 * 60000; break;
                case 2: tempo = 2 * 60 * 60000; break;
                case 3: tempo = 5 * 60 * 60000; break;
                case 4: tempo = 5 * 60 * 60000; break;
            }

            dadosAcao.acao_termina_em = date.getTime() + tempo;
            collection.insert(dadosAcao);
        });

        mongoCliente.collection("jogo", function(erro, collection){

            var moedas = null;

            switch(parseInt(dadosAcao.acao)) {
                case 1: moedas = -2 * dadosAcao.quantidade; break;
                case 2: moedas = -3 * dadosAcao.quantidade; break;
                case 3: moedas = -1 * dadosAcao.quantidade; break;
                case 4: moedas = -1 * dadosAcao.quantidade; break;
            }

            collection.update(
                { usuario:dadosAcao.usuario},
                { $inc: {moeda: moedas} }
            );

            mongoCliente.close();
        });
    });
}

JogoDAO.prototype.getAcoes = function(usuario, res){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("acao", function(erro, collection){
            var momento_atual = new Date().getTime();
            collection.find({usuario: usuario, acao_termina_em: {$gt: momento_atual}}).toArray(function(erro, result){
                res.render('pergaminhos', {acoes: result});
            });
            mongoCliente.close();
        });
    });
}

JogoDAO.prototype.revogar_acao = function(id_acao, res){
    this._connection.open(function(erro, mongoCliente){
        mongoCliente.collection("acao", function(erro, collection){
            collection.remove(
                {_id: objectId(id_acao)},
                function(erro, result){
                    if(erro) console.log(erro);
                    res.redirect('/jogo?msg=D');
                    mongoCliente.close();
                }
            );
        });
    });
}


module.exports = function(){
    return JogoDAO;
}