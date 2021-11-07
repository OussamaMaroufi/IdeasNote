if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI:'mongodb+srv://admin:admin@tmcluster.4n3hj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    }
}else {
    module.exports = {
        mongoURI:'mongodb://localhost/vidjot-dev'
    }
}