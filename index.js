
var express    = require('express');
var request = require("request");
var changeCase = require('change-case');
var dateFormat = require('dateformat');


var app = express();
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));

var i=1;
var mongojs   = require('mongojs')

var port = process.env.PORT||8080;

var db = mongojs('mongodb://amritaclub:9885@ds029486.mlab.com:29486/mani', ['event','subscribed']);

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/',function(req,res){
        
    res.sendFile(__dirname +'/public/login.html');
   
                                });
app.post('/login',function(req,res){

var user=req.body.user;
var pass=req.body.pass;


   db.login.find({$and:[{id:user,pass:pass}]},function(err,docs)
   {

     if (docs.length=="1")

    {
        if(pass=="mani666")
        {
         res.sendFile(__dirname +'/public/form_admin.html');
        }else
        {
           res.sendFile(__dirname +'/public/form.html');
        }
    }
        else
        {
            res.sendFile(__dirname +'/public/failed.html');

        }

   })


})




app.post('/event',function(req,res){

    

    var name2=req.body.club;
    var name=changeCase.upperCase(name2);

    var hall=req.body.hall;
    var date=req.body.date;
    var time=req.body.time;
    var event=req.body.event;

    var des=req.body.des;
     var cid;
    if(name=="FACE")
    {
        cid="2";
    }else if(name=="ECIF"){
        cid="3";
    }else if(name=="Vidyuth"){
        cid="4";
    }else if(name=="Ingenium"){
        cid="5";
    }else if(name=="Aavishkara"){
        cid="6";
    }else if(name=="Vyom"){
        cid="7";
    }else if(name=="Sankhya"){
        cid="8";
    }else if(name=="ACROM"){
        cid="9";
    }else if(name=="IEEE"){
        cid="10";
    }
    else if(name=="Lekhani"){
        cid="12";
    }else if(name=="The Squad"){
        cid="13";
    }else if(name=="Kala"){
        cid="14";
    }else if(name=="Narthana"){
        cid="15";
    }else if(name=="Raaga"){
        cid="16";
    }else if(name=="Smriti"){
        cid="17";
    }else if(name=="The Quiz Club"){
        cid="18";
    }else if(name=="The Humour Club"){
        cid="19";
    }else if(name=="Abhinaya"){
        cid="20";
    }else if(name=="SPICMACAY"){
        cid="21";
    }else if(name=="Chetana"){
        cid="22";
    }else if(name=="Maardhani"){
        cid="23";
    }else if(name=="Epic"){
        cid="24";
    }else if(name=="ACE"){
        cid="25";
    }
    else{
       cid="50";
    }

    db.event.insert({cid:cid,club:name,hall:hall,date:date,time:time,event:event,descrip:des},function(err,docs)
     {
        if(err)
        {
            console.log(err);
        }else
        {
            res.sendFile(__dirname +'/public/success.html');
        }

        db.subscribed.find({cid:cid},function(err,docs2){
            if(err)
        {
            console.log(err);
        }else
        {
            var i;
            for(i=0;i<docs2.length;i++)
            {
            
                  request("https://www.gupshup.io/developer/bot/amritaevents/public?key="+docs2[i].id+"&message="+ name +" is conducting *"+ event +  '*, '+des+' in '+hall + ' on '+date +' starts at '+time


                      , function(error, response, body) {
                        if(err)
                        {
                            console.log("err");
                        }
                        
                          console.log(response);
                        });

                             
            }
        }


        })

    })
 var d=dateFormat("yyyy-mm-dd");
   db.event.remove({date: { $lte:d} },function(err){
        if(err)
       {
        console.log(err);
      }
    })

});

app.get('/nclub/:cid',function(req,res){
    
    var cid1=req.params.cid;
    var d=dateFormat("yyyy-mm-dd");       

    db.event.find({$and:[{cid:cid1,date: { $gte:d} }]},function(err,docs){

        if(err)
        {
            console.log("err");

        }else
        {
          
                    res.send(docs);
                
        }


    })

});

app.get('/dclub',function(req,res){
    
   
         var d=dateFormat("yyyy-mm-dd");


    db.event.find({date:d},function(err,docs){
        if(err)
        {
            console.log("err");

        }else
        {
            res.send(docs);
        }


    })

});

app.get('/insertid',function(req,res){



    var id=req.query.id;
    var cid=req.query.cid;

  
   db.subscribed.find({$and:[{id:id,cid:cid}]},function(err,docs)
   {
console.log(docs.length);
    if (docs.length=="0")

    {
       db.subscribed.insert({id:id,cid:cid},function(err,docs2)
    {
        if(err)
        {
            console.log("err");
        }else
        {
            res.send("success");
        }

    })

    }else
    {
        res.send("unsuccess");
    }
   })

   

});


app.get('/deleteid',function(req,res){



    var id=req.query.id;
    


   db.subscribed.find({id:id},function(err,docs)
   {
    if (docs.length=="0")

    {
                res.send("unsuccess");

     
    }else
    {
          db.subscribed.remove({id:id},function(err,docs2)
    {
        if(err)
        {
            console.log("err");
        }else
        {
            res.send("success");
        }


    })

        
    }

   });

   

});



app.get('/publish',function(req,res){
    

        var d=dateFormat("yyyy-mm-dd");

   db.event.find({date:d},function(err,docs){

var n1=docs.length;
var i;
     var name=[];
     var event=[];
     var date=[];
     var time=[];
     var hall=[];
     var des=[];

var k=0;
    for (i=0; i<n1; i++) {


    var store=docs[i].cid;

 console.log(i);




      name[k]=docs[i].club;
      event[k]=docs[i].event;
      date[k]=docs[i].date;
      time[k]=docs[i].time;
      hall[k]=docs[i].hall;
      des[k]=docs[i].descrip;
         var m=0;
console.log(store);
        db.subscribed.find({cid:store},function(err,docs2){
            if(err)
        {
            console.log(err);
        }else
        { 
            var j;  
           
        var n2=docs2.length;

            for(j=0;j<n2;j++)
{


   
     var id=docs2[j].id;


     
        request("https://www.gupshup.io/developer/bot/amritaevents/public?key="+id+"&message="+ name[m] +" is conducting *"+ event[m] +  '*,Today '+des[m]+' in '+hall[m] + ' starts at '+time[m]

                      , function(error) {
                        if(error)
                        {
                            console.log("err");
                        }
                   
                        });

              
               
            }
            m=m+1;
            
     }
        });

       k++;
       
    }

    res.sendFile(__dirname +'/public/success2.html');
       
   });

})

app.listen(port,function(){
    console.log("app is listening");

});



