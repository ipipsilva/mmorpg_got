module.exports.home = function(application, req, res){
    res.render('index', {erros: {}});
}

module.exports.autenticar = function(application, req, res){
    
    var dadosForm = req.body;

    req.assert('usuario','Usuário deve ser informado!').notEmpty();
    req.assert('senha','Senha deve ser informada!').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('index', {erros: erros});
        return;
    }

    var connection = application.config.dbConnection;
    var UsuariosDAO = new application.app.models.UsuariosDAO(connection);
    
    UsuariosDAO.autenticar(dadosForm, req, res);
}