$(function(){


//Backbone.js code
//
  window.MessageModel= Backbone.Model.extend({

    EMPTY : '',
    
    initialize: function() {
        if (!this.get("content")) {
        this.set({"content": this.EMPTY});

              }
        
        if(!this.get("ID")){
        this.set({"ID":this.EMPY});
        
        }

        if(!this.get("time")){
        this.set({"time":new Date()});
        
        }    
    }

  });


 window.MessageCollection = Backbone.Collection.extend({
 
    model:MessageModel,
    localStorage: new Store("messageList")
 

 });

 window.messageList = new window.MessageCollection;


 window.MessageView = Backbone.View.extend({
    tagName:"li",  
     
    initialize: function() {
      _.bindAll(this, 'render');
      console.log(this.model);
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function(){
            
        $(this.el).html(this.model.get('ID')+' : '+ this.model.get('content')+' on '+this.model.get('time'));
            
        return this;
            }


 });


//Socket.io code

  var socket = new io.Socket(null,{port: 8000,rememberTransport:false});
  socket.connect();
  socket.on('connect',function(){console.log('Connected');});
  socket.on('message',function(obj){message(obj)});

//Utility functions

window.send=function(){

    socket.send($('#content').val());
    message({ID:'You',
             content: $('#content').val(),
             time: new Date()});

    $('#content').val('');
    
    }


function message(obj){

    var msg = new MessageModel(obj);
    $('#msgbox').append(new MessageView({model:msg}).render().el);

    }


});
