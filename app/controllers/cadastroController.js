module.exports.cadastro = function(application, req, res){
    res.render('cadastro', {erros: {}, dadosForm: {}});
}

module.exports.cadastrar = function(application, req, res){
    
    var dadosForm = req.body;

    req.assert('nome','Nome não pode ser vazio.').notEmpty();
    req.assert('usuario','Usuario não pode ser vazio.').notEmpty();
    req.assert('senha','Senha não pode ser vazia.').notEmpty();
    req.assert('senha','Senha deve ter entre 4 e 15 caracteres.').len(4,15);
    req.assert('casa','Uma casa deve ser escolhida para jogar.').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('cadastro', {erros: erros, dadosForm: dadosForm});
        return;
    }

    var connection = application.config.dbConnection;

    var UsuariosDAO = new application.app.models.UsuariosDAO(connection);

    UsuariosDAO.inserirUsuario(dadosForm);

    // geração dos parametros do jogo
    var JogoDAO = new application.app.models.JogoDAO(connection);
    JogoDAO.gerarParametros(dadosForm.usuario);

    res.redirect('/cadastro');
}