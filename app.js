// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb+srv://jajjkon7:k4924031@cluster0.vxepd.mongodb.net/webgame?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

  require('./Database')
  require('./Entity');
  require('./client/Inventory')

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});

// const {Account} = require('./models/Account');


app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.get('/',(req,res)=>{
    res.render(__dirname+'/client/index.html')
})
app.use('/client',express.static(__dirname + '/client'));


var SOCKET_LIST = {}; 



var DEBUG = true;




 
// var isValidPassword = function(data,cb) {
//        Account.find({username:data.username,password:data.password},function(err,res){
//            if(res.length>0)
//                 cb(true);
//             else 
//                 cb(false);    
//        })

//     }

// var isUsernameTaken = function(data,cb){
//     Account.find({username:data.username},function(err,res){
//         if(res.length>0)
//              cb(true);
//          else 
//              cb(false);    
//     })
// }    
// var addUser = function(data,cb){
//     Account.create({username:data.username,password : data.password},function(err){
//       cb();
//     });
// }
io.on('connection',(socket)=>{
    console.log("socket connected");
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;


    socket.on('signIn',(data)=>{ //username,password
        Database.isValidPassword(data,function(res){
            if(!res){
                return socket.emit("signInResponse",{success: true})} 
            Database.getPlayerProgress(data.username,function (progress) {
                Player.onConnect(socket,data.username,progress);
            socket.emit("signInResponse",{success: true}); 
            })
            

               
        });
        
    });
    socket.on('signUp',(data)=>{
        Database.isUsernameTaken(data,function(res){
        if(res){
                    socket.emit("signUpResponse",{success: false})
                }else {
                    Database.addUser(data,function(){
                        socket.emit("signUpResponse",{success: true})
                        });

                }    
        });
       

       
    });

    socket.on('disconnect',()=>{
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });

   

    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);
    });
});




setInterval(function(){
    var packs = Entity.getFrameUpdateData();

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('init',packs.initPack);
        socket.emit('update',packs.updatePack);
        socket.emit('remove',packs.removePack);
    }
    
},1000/25);



serv.listen(3000,()=>{
    console.log('listing on *:3000');
})

