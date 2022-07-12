class LoginController{
    //[GET] /login
    login(req, res, next){
        res.send('<a href="/auth/google">Auth with Google</a>')
    }
    
    authCallback(req, res, next){
        res.redirect("/user");
    }
}
module.exports = new LoginController();