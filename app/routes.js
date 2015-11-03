
module.exports = function(app, passport) {

var User       = require('../app/models/user');
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs', {
	    title:'Home'
        });

    });

    // show the settings page (will change the password)
/*
    app.get('/settings', isLoggedIn, function(req, res) {
        res.render('settings.ejs', {
	    title:'Settings',
            user : req.user,
	    message:'this is message'
        });
    });
*/

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
	//User.find(function(err,polls){
	//if(err)
	//	res.send(err)
//console.log(polls);
//	res.json(polls);
	var user=req.user;
console.log(user);
	if(user.twitter.displayName){
		user.local.name=user.twitter.displayName;
		user.local.email=user.twitter.username;
	}
console.log(user.local.name);
        user.save(function(err) {
		if (err){
			console.log(err);
			res.send(err);
		}
		res.render('profile.ejs', {
		    title:'Profile',
		    user : user,
		    showform:true
		});
	});
        //});
    });

    app.get('/mypolls', isLoggedIn, function(req, res) {
	//User.find(function(err,polls){
	//if(err)
	//	res.send(err)
//console.log(polls);
//	res.json(polls);
        res.render('mypolls.ejs', {
	    title:'My Polls',
            user : req.user
        });
        //});
    });
app.get('/profile', function(req, res) {
var path = require('path');	
res.sendfile(path.resolve('../views/profile.html'));
/*
        res.render('profile.ejs', {
	    title:'Profile',
            user : '',
	    showform:true,
	    pollname:'',
	    host:''
	});*/
    });
    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { 
		title: 'Login',
		message: req.flash('loginMessage') 
	    });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { 
	    title: 'Sign up',
	    message: req.flash('signupMessage') 
	    });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.name    = undefined;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
    app.post('/profile', isLoggedIn, function(req, res) {
        var user          = req.user;
	var poll={};
	var option={};
	poll['name']=req.body.pollname.replace(/[^\w\s]/gi, '');
	poll['opts']=[];
	var i=0;
	while(i>=0){
		i++;
		if(req.body['option'+i]){
			option.name=req.body['option'+i];
			option.count='0';
			poll['opts'].push(option);
			option={};
		}else{break;}
	}
	poll['link']='http://'+req.headers.host+'/'+user.local.name.replace(/[^\w\s]/gi, '')+'/'+poll['name'];
	
/*
	var index=-1;
	for(var i=0;i<user.local.polls.length;i++){
		if(user.local.polls[i].name==req.body.pollname){
			index=i;
			console.log('find duplicate poll '+req.body.pollname +' at index '+i);
			break;
		}
	}
	user.local.polls.splice(index, 1);
*/
	user.local.polls.push(poll);
console.log(user.local.polls);
        user.save(function(err) {
		if (err)
			res.send(err);
		res.render('profile.ejs', {
		    title:'Profile',
		    user : user,
		    showform:false
		});
	});
    });//end of post
    app.post('/:username/:pollname', function(req, res) {
	var username=req.params.username;
	var pollname=req.params.pollname;
	User.findOne({ 'local.name' :  username}, function(err, user) {
                if (err)
                    return done(err);
                if (!user){
                }else{
		var index=-1;
		for(var i=0;i<user.local.polls.length;i++){
			if(user.local.polls[i].name==pollname){
				index=i;
				break;
			}
		}
		if(index>-1){
			console.log(user.local.polls[req.body.index].opts);
			console.log(req.body.option.length);
			if(req.body.option.length>0){
				var count = user.local.polls[req.body.index].opts[req.body.option].count;
				count=count+1;
				user.local.polls[req.body.index].opts[req.body.option].count=count;
			}
			var poll=user.local.polls[req.body.index];
			user.local.guest.url='/'+username+'/'+pollname;
			user.local.host=req.headers.host;
			user.local.guest.role=true;
			user.save(function(err) {
				if (err)
					res.send(err);
				res.render('chart.ejs', {
				    title:poll.name,
				    user : user,
				    poll:poll
				});
			});
		}
		}
            });
    });//end of post
    app.get('/:username/:pollname', function(req, res) {
	var username=req.params.username;
	var pollname=req.params.pollname;
	console.log(req.user);
	console.log(username);
	console.log(pollname);
	User.findOne({ 'local.name' :  username}, function(err, user) {
                // if there are any errors, return the error
                if (err){
			console.log(err);
                    return done(err);
		}

                // if no user is found, return the message
                if (!user){
			console.log('no user found');
                //    return done(null, false, req.flash('loginMessage', 'No user found.'));
                // all is well, return user
                }else{
		var index=-1;
			console.log(user);
		for(var i=0;i<user.local.polls.length;i++){
			console.log(user.local.polls[i].name);
			if(user.local.polls[i].name==pollname){
				index=i;
				break;
			}
		}
	if(index>-1){
		console.log(req.headers);
		user.local.host=req.headers.host;
		user.local.guest.url='/'+username+'/'+pollname;
		user.local.guest.role=true;
		console.log(user.local.guest.role);
		var poll=user.local.polls[index];
		res.render('share.ejs', {
		    title:poll.name,
		    user : user,
		    poll:poll,
		    pollindex:index
		});
	}
	console.log(index);
                //    return done(null, user);
		}
            });
    });//end of get

    app.post('/mypolls', isLoggedIn, function(req, res) {
	    console.log('----/mypolls post----');
	    console.log('-'+req.body.delindex+'-');
	    console.log('-'+req.body.pollindex+'-');
	var user          = req.user;
	if(req.body.delindex!=undefined && req.body.delindex!=""){
		console.log('dle');
		user.local.polls.splice(req.body.delindex, 1);
		user.save(function(err) {
			if (err)
				res.send(err);
			res.render('mypolls.ejs', {
			    title:'My Polls',
			    user : user
			});
		});
	}else if(req.body.pollindex!=undefined && req.body.pollindex!=""){
		console.log('go poll');
		var poll=user.local.polls[req.body.pollindex];
		user.local.guest.role=false;
		res.render('share.ejs', {
		    title:poll.name,
		    user : user,
		    poll:poll,
		    pollindex:req.body.pollindex
		});
	}else if(req.body.option!=undefined && req.body.option!=""){
		console.log('go chart');
		var count = user.local.polls[req.body.index].opts[req.body.option].count;
		console.log(count);
		count=count+1;
		console.log(count);
		user.local.polls[req.body.index].opts[req.body.option].count=count;
		console.log(user.local.polls[req.body.index].opts[req.body.option].count);
		var poll=user.local.polls[req.body.index];
console.log(poll);
			user.local.guest.role=false;
		user.save(function(err) {
			if (err)
				res.send(err);
			res.render('chart.ejs', {
			    title:poll.name,
			    user : user,
			    poll:poll
			});
		});
	}
    });//end of post
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

