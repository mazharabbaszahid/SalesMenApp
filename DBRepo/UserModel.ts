import mongoose = require('mongoose');
import q = require('q');
import bcrypt = require('bcrypt-nodejs')

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    FirstName:String,
    LastName:String,
    Email:{type:String,unique:true,required:true},
    Password:String,
    CreatedOn:{type:Date,default:Date.now()},  
    AdminId:String,
    CompanyId:String,
    SalesMen:{type:[]},
    FirebaseToken:String
});

let companySchema = new Schema({
    CompanyName:{type:String,require:true},
    CompanyAddress:String,
    SalesMen:[],
    AdminId:String,
    Orders:[],    
    CompanyCreatedOn:{type:Date,default:Date.now()}
});

let SalesmenSchema = new Schema({
    name:String,
    email:{type:String,require:true},
    password:String,
    AdminId:String,
    location:String,
    Orders:[],
    createdOn:{type:Date,default:Date.now()}
});


let orderShcema =new Schema({
   ProductName:String,
   AdminId:String,
   SalesmenId:String,
   ProductPrice:Number,
   ProductQty:Number,
   OrderOn:{type:Date,default:Date.now()}
    
});



let companyModel=mongoose.model('companies',companySchema);

let SALT_FACTOR;
let noop = function() {};

UserSchema.pre("save", function(done) {
  let user = this;

  if (!user.isModified("Password")) {
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.Password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.Password = hashedPassword;
      done();
    });
  });
});


let UserModel = mongoose.model('users',UserSchema);
var user;
function saveUser(userProps){
    let deffered = q.defer();
    user = new UserModel(userProps);
    
    user.save((err,data)=>{
        if(err){
            console.log('Error in saving User');
            console.log(err);
            deffered.reject('Error occured while savin user')
        }else{
            console.log('User saved successfully');
            deffered.resolve(data)
        }
    });
    return deffered.promise;
}

function saveCompany(compProps){
    let deffered = q.defer();
    let company = new companyModel(compProps);
   //company.AdminId=company._id;
   
        company.save(function (err, data) {     
    
        if(err){
            console.log('Error in saving Company');
            console.log(err);
            deffered.reject('Error occured while savin Company')
        }else{
            
            console.log(data)
            //  Upadting of Company Id in User data when saving New Company......//
            UserModel.update({_id:data.AdminId},{$set:{CompanyId:data._id}},function(e,d){
                console.log(e,d)
            })
            console.log('Company saved successfully')
            deffered.resolve(data)
        }
    });
    return deffered.promise;
}

function findUser(query){
    let deffered = q.defer();
    UserModel
    .findOne(query,function(err,record){
        if(err){
            console.log('Error in finding User');
            console.log(err);
            deffered.reject("Error in finding User through deffered");
        }
        else{
            deffered.resolve(record);
        }
    });
    return deffered.promise;
}
function findCompany(query){
    let deffered = q.defer();
    companyModel
    .findOne(query,function(err,record){
        if(err){
            console.log('Error in finding User');
            console.log(err);
            deffered.reject("Error in finding User through deffered");
        }
        else{
            deffered.resolve(record);
        }
    });
    return deffered.promise;
}



let Salesmen =mongoose.model('Salesmen',SalesmenSchema)

function saveSalesmen(salesmenProps){
    let deffered = q.defer();
    let user = new Salesmen(salesmenProps);
    
    user.save((err,data)=>{
        if(err){
            console.log('Error in saving User');
            console.log(err);
            deffered.reject('Error occured while savin user')
        }else{
            //
            companyModel.update({AdminId:data.AdminId},{$push:{SalesMen:data._id}},function(e,d){
                UserModel.update({_id:data.AdminId},{$push:{SalesMen:data._id}},function(err,data){
                                    console.log(e,d)

                })
            })
            
            
            console.log('User saved successfully')
            deffered.resolve(data)
        }
    });
    return deffered.promise;
}

function findSalesmen(query){
    let deffered = q.defer();
    Salesmen
    .find(query,function(err,record){
        console.log('query '+ query)
        console.log('error '+ err)
        console.log('record '+ record)
        if(err){
            console.log('Error in finding Salesmen');
            console.log(err);
            deffered.reject("Error in finding Salesmen through deffered");
        }
        else{
            deffered.resolve(record);
            console.log(record)
        }
    });
    return deffered.promise;
}

let Order = mongoose.model('Order',orderShcema)

function saveProduct(product){
    let deffered = q.defer();
    let Product = new Order(product);
    
    Product.save((err,data)=>{
        if(err){
            console.log('Error in saving Product');
            console.log(err);
            deffered.reject('Error occured while savin Product')
        }else{
            
            companyModel.update({AdminId:data.AdminId},{$push:{Orders:data._id}},function(e,d){
                Salesmen.update({AdminId:data.AdminId},{$push:{Orders:data._id}},function(err,data){
                                    console.log(e,d)

                })
            })
            
            
            console.log('Product saved successfully')
            deffered.resolve(data)
        }
    });
    return deffered.promise;
}

function findProduct(query){
    let deffered = q.defer();
    Order
    .find(query,function(err,record){
        console.log('query '+ query)
        console.log('error '+ err)
        console.log('record '+ record)
        if(err){
            console.log('Error in finding Order');
            console.log(err);
            deffered.reject("Error in finding Order through deffered");
        }
        else{
            deffered.resolve(record);
            console.log(record)
        }
    });
    return deffered.promise;
}





function findSalesman(query){
    let deffered = q.defer();
    Salesmen
    .findOne(query,function(err,record){
        if(err){
            console.log('Error in finding Salesman');
            console.log(err);
            deffered.reject("Error in finding Salesman through deffered");
        }
        else{
            deffered.resolve(record);
        }
    });
    return deffered.promise;
}




export {saveUser,findUser,saveCompany,findCompany,saveSalesmen,findSalesmen,saveProduct,findProduct,findSalesman}

exports.userModel=UserModel;
exports.userSchema = UserSchema;
exports.Salesmen=Salesmen
