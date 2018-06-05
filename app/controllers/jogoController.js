module.exports.jogo = function(application, req, res){
    
    if(req.session.autorizado !== true){
        res.send('usuário precisa fazer login!');
        return;
    }

    var msg = '';

    if(req.query.msg  != ''){
        msg = req.query.msg;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, msg);
}

module.exports.suditos = function(application, req, res){
    
    if(req.session.autorizado !== true){
        res.send('usuário precisa fazer login!');
        return;
    }
    
    res.render('aldeoes');
}

module.exports.pergaminhos = function(application, req, res){
    
    if(req.session.autorizado !== true){
        res.send('usuário precisa fazer login!');
        return;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.getAcoes(req.session.usuario, res);
}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(erro){
        res.render('index', {erros:{}});
    });
}

module.exports.ordenar_acao_sudito = function(application, req, res){
    
    if(req.session.autorizado !== true){
        res.send('usuário precisa fazer login!');
        return;
    }

    var dadosForm = req.body;

    req.assert('acao','Seleciona uma ação.').notEmpty();
    req.assert('quantidade','Informa uma quantidade.').notEmpty();

    var erros = req.validationErrors();

    if(erros){    
        res.redirect('/jogo?msg=A');
        return;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;

    JogoDAO.acao(dadosForm);

    res.redirect('/jogo?msg=B');
}