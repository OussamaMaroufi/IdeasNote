const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const passport = require('passport');

//DBconfig

const db = require('./config/database');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');



//Passport config
require('./config/passport')(passport);



//body parser third party module to catch what we put it in form 
//Middelware of body parser 
//body parser let us acess whatever submitted in form 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname,'public')));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//Express middleware session 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  
}))


//Passport Middlewarte
app.use(passport.initialize())
app.use(passport.session());



app.use(flash())

//Global variables 
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    next();
})


//Map global promise -get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
//could be any kind of bd remote or local 
//onse we get response catch it with promise

//dev databse


mongoose.connect(db.mongoURI,{
    // useMongoClient:true
})
.then(()=>console.log("MongoDb Connected ..."))
.catch(err=>console.log(err))





//Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');


//Index Route

app.get('/',(req,res)=>{
    const title = "Welcome";
     res.render('index',{
         title:title
     });
})


//About Route

app.get('/about',(req,res)=>{
    res.render('about');
})





//use routes of idea
app.use('/ideas',ideas);


//use users route
app.use('/users',users);


const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})
