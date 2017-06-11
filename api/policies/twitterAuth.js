module.exports = {
    'isTwitterAuthenticated': function(request,response, next){
        if(request.session.user.twitter.key != "a" || request.session.user.twitter.secret != "b"){
            return next();
        }
        else{
            return response.redirect('/settings/twitter');
        }
    },
    'isTwitterUnAuthenticated': function(request,response, next){
        if(request.session.user.twitter.key == "a" || request.session.user.twitter.secret == "b"){
            return next();
        }
        else{
            return response.redirect('/settings/twitter');
        }
    }
};
