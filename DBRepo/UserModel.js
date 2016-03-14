var mongoose = require('mongoose');
var q = require('q');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    FirstName: String,
    LastName: String,
    Email: { type: String, unique: true, required: true },
    Password: String,
    CreatedOn: { type: Date, default: Date.now() },
    AdminId: String,
    CompanyId: String,
    SalesMen: { type: [] },
    FirebaseToken: String
});
var companySchema = new Schema({
    CompanyName: { type: String, require: true },
    CompanyAddress: String,
    SalesMen: String,
    AdminId: String,
    CompanyCreatedOn: { type: Date, default: Date.now() },
});
var SalesmenSchema = new Schema({
    name: String,
    email: { type: String, require: true },
    password: String,
    AdminId: String,
    location: String,
    createdOn: { type: Date, default: Date.now() }
});
var orderShcema = new Schema({
    ProductName: String,
    AdminId: String,
    SalesmenId: String,
    ProductPrice: Number,
    ProductQty: Number,
    OrderOn: { type: Date, default: Date.now() }
});
var companyModel = mongoose.model('companies', companySchema);
var SALT_FACTOR;
var noop = function () { };
UserSchema.pre("save", function (done) {
    var user = this;
    if (!user.isModified("Password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.Password, salt, noop, function (err, hashedPassword) {
            if (err) {
                return done(err);
            }
            user.Password = hashedPassword;
            done();
        });
    });
});
var UserModel = mongoose.model('users', UserSchema);
var user;
function saveUser(userProps) {
    var deffered = q.defer();
    user = new UserModel(userProps);
    user.save(function (err, data) {
        if (err) {
            console.log('Error in saving User');
            console.log(err);
            deffered.reject('Error occured while savin user');
        }
        else {
            console.log('User saved successfully');
            deffered.resolve(data);
        }
    });
    return deffered.promise;
}
exports.saveUser = saveUser;
function saveCompany(compProps) {
    var deffered = q.defer();
    var company = new companyModel(compProps);
    //company.AdminId=company._id;
    company.save(function (err, data) {
        company.save(function (err, data) {
        });
        if (err) {
            console.log('Error in saving Company');
            console.log(err);
            deffered.reject('Error occured while savin Company');
        }
        else {
            console.log(data);
            // UserModel.update({_id:data._id},{$set:{CompanyId:data._id}},function(e,d){
            //     //console.log(e,d)
            // })
            console.log('Company saved successfully');
            deffered.resolve(data);
        }
    });
    return deffered.promise;
}
exports.saveCompany = saveCompany;
function findUser(query) {
    var deffered = q.defer();
    UserModel
        .findOne(query, function (err, record) {
        if (err) {
            console.log('Error in finding User');
            console.log(err);
            deffered.reject("Error in finding User through deffered");
        }
        else {
            deffered.resolve(record);
        }
    });
    return deffered.promise;
}
exports.findUser = findUser;
function findCompany(query) {
    var deffered = q.defer();
    companyModel
        .findOne(query, function (err, record) {
        if (err) {
            console.log('Error in finding User');
            console.log(err);
            deffered.reject("Error in finding User through deffered");
        }
        else {
            deffered.resolve(record);
        }
    });
    return deffered.promise;
}
exports.findCompany = findCompany;
var Salesmen = mongoose.model('Salesmen', SalesmenSchema);
function saveSalesmen(salesmenProps) {
    var deffered = q.defer();
    var user = new Salesmen(salesmenProps);
    user.save(function (err, data) {
        if (err) {
            console.log('Error in saving User');
            console.log(err);
            deffered.reject('Error occured while savin user');
        }
        else {
            console.log('User saved successfully');
            deffered.resolve(data);
        }
    });
    return deffered.promise;
}
exports.saveSalesmen = saveSalesmen;
function findSalesmen(query) {
    var deffered = q.defer();
    Salesmen
        .find(query, function (err, record) {
        console.log('query ' + query);
        console.log('error ' + err);
        console.log('record ' + record);
        if (err) {
            console.log('Error in finding Salesmen');
            console.log(err);
            deffered.reject("Error in finding Salesmen through deffered");
        }
        else {
            deffered.resolve(record);
            console.log(record);
        }
    });
    return deffered.promise;
}
exports.findSalesmen = findSalesmen;
var Order = mongoose.model('Order', orderShcema);
function saveProduct(product) {
    var deffered = q.defer();
    var Product = new Order(product);
    Product.save(function (err, data) {
        if (err) {
            console.log('Error in saving Product');
            console.log(err);
            deffered.reject('Error occured while savin Product');
        }
        else {
            console.log('Product saved successfully');
            deffered.resolve(data);
        }
    });
    return deffered.promise;
}
exports.saveProduct = saveProduct;
function findProduct(query) {
    var deffered = q.defer();
    Order
        .find(query, function (err, record) {
        console.log('query ' + query);
        console.log('error ' + err);
        console.log('record ' + record);
        if (err) {
            console.log('Error in finding Order');
            console.log(err);
            deffered.reject("Error in finding Order through deffered");
        }
        else {
            deffered.resolve(record);
            console.log(record);
        }
    });
    return deffered.promise;
}
exports.findProduct = findProduct;
exports.userModel = UserModel;
exports.userSchema = UserSchema;
exports.Salesmen = Salesmen;
