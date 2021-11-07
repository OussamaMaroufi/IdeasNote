const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');



const router = express.Router();

//Load user model 
require('../models/User');
const User = mongoose.model('users');



//user login route

router.get('/login',(req,res)=>{
    res.render('users/login');
})

//user register route
router.get('/register',(req,res)=>{
    res.render('users/register')
})

//Login Form Post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
})





//Register Form POST 
router.post('/register',(req,res)=>{
    let errors = [];
    if(req.body.password != req.body.password2){
       errors.push({text:"Passwords do not match"}); 
    }
    if(req.body.password.length < 4){
        errors.push({text:'Password must be at least 4 charactere'})
    }

    if(errors.length > 0){

        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2,
        })
    }else{
        const newUser = new User ({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })

        User.findOne({email:req.body.email})
            .then(user =>{
                if(user){
                    req.flash('error_msg','Email ALready Exist !!');
                    res.redirect('/users/login')
                }else{
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user =>{
                                    req.flash('success_msg','You are now registered and can logged in');
                                    res.redirect('/users/login');
                                })
                                .catch(err =>{
                                    console.log(err);
                                    return;
                                })
                        })
                    })

                }
            } )


        
    }
})

//Logout user 
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');

})


module.exports = router