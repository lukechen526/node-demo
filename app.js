var express = require('express'),
    app     = express.createServer(),
    io      = require('socket.io');


app.configure(function(){

    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use('/static',express.static(__dirname+'/static'));
    app.use(express.errorHandler({
        dumpExceptions:true, 
        showStack:true}));

    app.set('views',__dirname+'/views');
    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat" }));
    
});

app.get('/:id',function(req,res,next){

    if(req.params.id){
   
        res.render('index.jade',{title:'Hey', id: req.params.id });
    }
    
    else{
        next()
    };

});




app.get('/',function(req,res){

    res.render('index.jade', {title:'Hello World', id:'0'});

});

app.listen(8000);




//socket.io
var socket = io.listen(app,{});

socket.on('connection',function(client){
    //new client is here
    console.log('New Client Connected');
    client.send({ID:'Server',content:'Welcome!', time: new Date()});

    //on receiving message from a client, broadcast it to other clients
    client.on('message',function(message){
        client.broadcast({ID:client.sessionId,
                          content:message,
                          time: new Date()
        });


    //On client disconnection

    client.on('disconnect',function(){
    
        client.broadcast({ID:client.sessionId,
                          content:'disconnected',
                          time: new Date()});
    
    });



     
    
    });

});

console.log('App launched at port 8000');
