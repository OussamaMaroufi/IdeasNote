const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');



//Load Idea Model 
require('../models/Idea');
const Idea = mongoose.model('ideas')




//add Idea Form 

router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add');
})

//edit idea Form

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{

    Idea.findOne({
        _id:req.params.id
    }).lean()
    .then(idea=>{
        if(idea.user != req.user.id){
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas')
        }else{

            res.render('ideas/edit',{idea:idea});
        }

    })
})
//Idea index page
router.get('/',ensureAuthenticated,(req,res)=>{ 

    Idea.find({user:req.user.id}).lean()
        .sort({date:'desc'})
        .then(ideas =>{
         res.render('ideas/index',{
                ideas:ideas
            });
        })




        
})

//Process Form 
router.post('/',(req,res)=>{
    let errors = [];

    //some validation 
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }

    if(errors.length > 0){
        res.render('/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        });

    }else{
        const newUser  ={
            title:req.body.title,
            details:req.body.details,
            //Authenticated user here -user.id
            user:req.user.id


        }
        new Idea(newUser)
            .save()
            .then(idea=>{
                req.flash('success_msg','Video Idea Added');
                res.redirect('/ideas')
            })
    }
})


//Edit form process
router.put("/:id",ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea =>{
        //new value
        idea.title =  req.body.title;
        idea.details = req.body.details;
        

        idea.save()
        .then(idea =>{
                req.flash('success_msg','Video Idea Updated successfuly');
                res.redirect('/ideas');
            })
          
    })


})

//Delete Idea 
router.delete('/:id',(req,res)=>{
    Idea.deleteOne({_id:req.params.id})
        .then(()=>{
            req.flash('success_msg','Video Idea deleted');
            res.redirect('/ideas');
        })
})


module.exports = router;
