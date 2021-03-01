var USE_DB = true ;
const mongoose =  USE_DB ? require("mongoose") :null;

mongoose
  .connect("mongodb+srv://jajjkon7:k4924031@cluster0.vxepd.mongodb.net/webgame?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  const {Account} = USE_DB ? require('./models/Account') :null

Database = {};  
Database.isValidPassword = function(data,cb) {
    if(!USE_DB)
        return cb(true);
    Account.findOne({username:data.username,password:data.password},function(err,res){
        if(res)
             cb(true);
         else 
             cb(false);    
    })

 }

 Database.isUsernameTaken = function(data,cb){
    if(!USE_DB)
        return cb(false);
 Account.findOne({username:data.username},function(err,res){
     if(res)
          cb(true);
      else 
          cb(false);    
 })
}    
Database.addUser = function(data,cb){
    if(!USE_DB)
        return cb(true);
 Account.create({username:data.username,password : data.password},function(err){
    Database.savePlayerProgress({username:data.username,items:[]},function () {
           cb();

    })
 });
}

Database.getPlayerProgress = function(username,cb){
    if(!USE_DB)
        return cb({items : []});
 Account.findOne({username:username},function(err,res){
   cb({items:res.items});
 });
}

Database.savePlayerProgress = function(data,cb){
    cb =cb || function(){};
    if(!USE_DB)
        return  cb();
 Account.updateOne({username:data.username},data,{upsert:true},cb);
}