var express =require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var router = express.Router();
var app= express();
const mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;


var User = require('./mo/user');
var Record = require('./mo/rentalrecord');
var Bookinfo = require('./mo/bookinfos');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());



/////////////////////////////////////////////////////////////////////////////
//////Signin Function below
/////////////////////////////////////////////////////////////////////////////
router.get('/signin', function(req, res) {

  var email = req.query.email;
  var password = req.query.password;  
  
  User.findOne(
    {
      email: email
    }, 
    function(err, check){
      
      if(err){
        return next(err);
      }
      
      if(check){

        User.findOne(
          {password:password, email:email},
          function(err, pass){
            
            if (pass) {
              res.send('0');
            }
            
            if (!pass) {
              res.send('2');
            }
            
          }
        );
      } 
      else{

        res.send('1');
      }


    }
  );
}); // router
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///SignUP function below
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 router.get('/signup',function(req,res)
  {
    var email = req.query.email;
    var password = req.query.password;
    var FName = req.query.firstname;
    var LName = req.query.lastname;
    var Gender = req.query.gender;
    var Id = req.query.iid;
    var Phone = req.query.phone;
    
    User.findOne({email:email}, function (err, existingUser)
    {

      if(err) 
      {
        return next(err)
      }
      if(existingUser)
      { 
        res.send('1');
      }
      if(!existingUser)
      {
        var url = 'mongodb://localhost:27017/easybook';
          MongoClient.connect(url, function (err, db) 
          {
            var collection = db.collection('userinfos');
            var user1 = {email:email,password:password,firstname:FName,lastname:LName,gender:Gender,iid:Id,phone:Phone};
            collection.insert([user1], function (err, result) 
            {
              if (err) 
               {
                  console.log(err);
               } 
          });
            
            db.close();
          }); 
          res.send('0');

      };
  
    });

});






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get Book Name From Serial;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/getBookName',function(req,res){
  var MongoClient = require("mongodb").MongoClient;
  var Dburl = "mongodb://localhost:27017/easybook";
  var serial = req.query.serial;


  MongoClient.connect(Dburl, function(error, db){
      var collection = db.collection('bookinfos')
      collection.findOne({serial:serial},function(error,result)
      {
        if(error)
        {
          res.send("1");
        }
        if(result!=null)
        {
          res.send(result.bookname);
        }
        else
        {
          res.send("1")
        }
      })
      
    })
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//rentupdate;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/rent',function(req,res){
  
  var MongoClient = require("mongodb").MongoClient;
  var DB_URL = "mongodb://localhost:27017/easybook";
  MongoClient.connect(DB_URL, function(error, db){
  var rentOut = 1;
  var updatepass1 = 1;
  var rentpass = 1;
  var bookNotExist= 1;
     
      
      checkBookStatus(db);
    });


    function checkBookStatus(db)
    {
       var serial = req.query.serial;
       var collection = db.collection('bookinfos');
       collection.findOne({serial:serial, status:true}, function (erro,resu)
       {
        if (erro)
        {
            console.log("status error");
        }
        else if (resu!= null)
        {
          rentOut = 0;
          console.log(rentOut);
          updateBookInfos(db);
        }
        else
        {
          res.send("1");
        }
       })
       //db.close()
    }
    function createRentRecord(db)
    {
      var serial = req.query.serial;
      var email = req.query.email;
      var bookname = req.query.bookname;
      var date = new Date();
      console.log(date);
      var collection = db.collection('rentrecords');

          var user1 = {email:email,bookname:bookname,serial:serial,date:date};
            collection.insert([user1], function (err, result) 
            {
              if (err) 
               {
                  console.log(err);
               }
              else
              {
                console.log("inserted")
                rentpass = 0;
                res.send("0");
              }
            } 

            )  
        
      db.close();
    }

      function updateBookInfos(db)
  {
      var Bookinfo = db.collection('bookinfos');
      var serial = req.query.serial; 
      var whereData = {serial:serial}
      var updateDat = {$set: {status:false}}; 
      Bookinfo.update(whereData, updateDat, function(error, result){
              if(error )
              {

               console.log("book status not updated");
               res.send("1");
              }
              else
              {
                console.log("book status updated");
                updatepass1=0;
                createRentRecord(db)
              }
          //db.close();
      });
  } 
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ReturnRentalRecord function below

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/returnrentalrecord',function(req,res, next)
{

      
      var email = req.query.email;
 
      var url = 'mongodb://localhost:27017/easybook';
        MongoClient.connect(url, function (err, db) {

      var collection = db.collection('rentrecords');
  collection.find({email:req.query.email}).toArray(function(err,documents, next){
    if(err){
      return res.send();
    }
    var result = [];
    for(var i=0;i<documents.length;i++)
    {
        result.push({'bookname':documents[i].bookname,'date':documents[i].date});
    }
      
      res.json(JSON.stringify(result));
    db.close();
  });
});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Search Book

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/search',function(req,res){
  var booknames = req.query.bookname;
 // var booknames = booknamess.toLowerCase();
  var authornames = req.query.authorname;
//  var authornames = authornamess.toLowerCase();
   var MongoClient = require("mongodb").MongoClient;
  var DB_URL = "mongodb://localhost:27017/easybook";
  MongoClient.connect(DB_URL, function(error, db){
    var collection = db.collection('bookinfos');
    if (booknames!=null&&authornames==null)
    {
        collection.find({bookname: {$regex: booknames}}).toArray(function(err,result,next)
        {
          console.log(result)
          if (err)
          {

          }
          if (result)
          {
            
            for(var i = 0; i<result.length; i++)
            {
              console.log(result[i].bookname);
            }
            //res.json(JSON.stringify(result));
          }
        })
    }
    if(booknames==null&&authornames!=null)
    {
        collection.find({author: {$regex: authornames}}).toArray(function(err,result,next)
        {
          console.log(result)
          if (err)
          {

          }
          if (result)
          {
            
            for(var i = 0; i<result.length; i++)
            {
              console.log(result[i].bookname);
            }
            //res.json(JSON.stringify(result));
          }
        })
    }
    if(booknames!=null&&authornames!=null)
    {
      collection.find({bookname: {$regex: booknames},author:{$regex: authornames}}).toArray(function(err,result)
        {
          console.log(result)
          if (err)
          {

          }
          if (result)
          {
            res.setHeader('Content-Type','text/html');
            //res.json(result[0].bookname);
             //res.json(result[1].bookname);
             var collector = []
            for(var i = 0; i<result.length; i++)
            {
              collector.push({'bookname':result[i].bookname,'author':result[i].author,'status': result[i].status});
            }
            //filter
            var finalResult = [];
            var counter= 0
            for (var n = 0; n<collector.length; n++)
            {
                if (n==0)
                {
                  finalResult[counter]=collector[n];
                  counter++
                }
                var duplicated = Boolean(false);
                //compare the current element with the filtered array
                for (var j = 0; j<finalResult.length; j++)
                {
                  console.log(finalResult[j].bookname);
                  console.log(collector[n].bookname);
                  console.log(finalResult[j].author);
                  console.log(collector[n].author);
                  if(finalResult[j].bookname == collector[n].bookname && finalResult[j].author == collector[n].author)
                  {
                    if(finalResult[j].status)
                    {
                      duplicated = true;
                      j = finalResult.length;
                    }
                    else if(collector[n].status)
                    {
                      duplicated = true;
                      finalResult[j].status = true;
                      j = finalResult.length;
                    }
                    else
                    {
                      duplicated = true;
                      j = finalResult.length;
                    }
                  }
                }
                //The element is the new element, insert into the final array
                if (!duplicated)
                {
                  finalResult.push(collector[n]);
                }
            }
            res.json(JSON.stringify(finalResult));
            //res.json(JSON.stringify(result));
          }
        })
    }
  })

})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//NFC function below

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/return', function(req, res) {


  var MongoClient = require("mongodb").MongoClient;
  var Dburl = "mongodb://localhost:27017/easybook";
  var updatepass = 1;
  var deletepass = 1;
  var findBookPass = 1;
  MongoClient.connect(Dburl, function(error, db){
      findBook(db);

  });

  function findBook(db)
  {
    var device2 = db.collection('bookinfos');
    var serial1 = req.query.serial;
    console.log(serial1);
    device2.findOne({serial:serial1},function(error,result){
      if (error)
      {
       
      }
      if (result)
      {
         findBookPass = 0;
	       updatebookrecord(db);
      }
      else
      {
          res.send('1');
      }
    }
    )
    
  }
  function updatebookrecord(db)
  {
      var Bookinfo = db.collection('bookinfos');
      var serial = req.query.serial; 
      var whereData = {serial:serial}
      var updateDat = {$set: {status:true}}; 
      Bookinfo.update(whereData, updateDat, function(error, result){
              if(!result)
              {

               console.log("book status not updated");
              }
              else
              {
                console.log("book status updated");
                updatepass=0;
                deleteData(db);
              }
          
      });
  } 

  function deleteData(db)
  {
      var devices = db.collection('rentrecords');
      var serial = req.query.serial; 
     devices.remove({serial:serial},{ justOne: true },function(err)
      {
        if (err)
        {
            console.logs('delete');
        }
        else
        {
          deletepass = 0;
            if((updatepass==0)&&(deletepass==0))
          {
            res.send('0');
          }
          else
          {
            res.send('2');
          }
        }
      });

     db.close();
  }
});

module.exports=router;
