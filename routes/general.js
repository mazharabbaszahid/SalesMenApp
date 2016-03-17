var express = require('express');
var Firebase = require('firebase');
var bcrypt = require('bcrypt-nodejs');
var UserModel = require('../DBRepo/UserModel');
var ref = new Firebase('https://salesmem.firebaseio.com//users');
var UserModel_1 = require("../DBRepo/UserModel");
var router = express.Router();
router.post('/signup', function (req, res) {
    ref.createUser({
        email: req.body.data.Email,
        password: req.body.data.Password
    }, function (err, success) {
        if (err) {
            res.send(err);
        }
        else {
            req.body.data.FirebaseToken = success.uid;
            UserModel_1.saveUser(req.body.data)
                .then(function (userInstance) {
                res.send({ status: true, user: userInstance });
            }, function (err) {
                res.send({ status: false, message: err });
            });
        }
    });
});
router.post('/signin', function (req, res) {
    var user = req.body.data;
    UserModel_1.findUser({ Email: user.email })
        .then(function (userInstance) {
        if (!userInstance) {
            res.send("No user found with supplied email");
            return;
        }
        if (bcrypt.compareSync(user.password, userInstance.Password)) {
            res.send({ message: 'Loged in successfully', token: userInstance.FirebaseToken, user: userInstance });
            console.log(userInstance);
        }
        else {
            res.send("Wrong Password");
        }
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.get('/:FirebaseToken', function (req, res) {
    var tokenParams = req.params.FirebaseToken;
    UserModel_1.findUser({ FirebaseToken: tokenParams })
        .then(function (userInstance) {
        console.log(userInstance);
        if (userInstance) {
            res.send({ user: userInstance });
            return;
        }
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.post('/company', function (req, res) {
    UserModel_1.saveCompany(req.body.data)
        .then(function (comInstance) {
        console.log(comInstance);
        res.send({ status: true, data: comInstance });
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.get('/viewCompany/:AdminId', function (req, res) {
    var AdminId = req.params.AdminId;
    console.log(AdminId);
    UserModel_1.findCompany({ AdminId: AdminId })
        .then(function (companyInstance) {
        if (companyInstance) {
            console.log('company');
            console.log(companyInstance);
            res.send({ company: companyInstance });
            return;
        }
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.post('/salesmen', function (req, res) {
    console.log('req body' + req.body);
    UserModel_1.saveSalesmen(req.body.data)
        .then(function (comInstance) {
        res.send({ status: true, data: comInstance });
        console.log('instance' + comInstance._id);
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.get('/viewSalesmen/:AdminId', function (req, res) {
    var AdminId = req.params.AdminId;
    console.log("Admin Id " + AdminId);
    UserModel_1.findSalesmen({ AdminId: AdminId })
        .then(function (salesmenInstance) {
        if (salesmenInstance) {
            console.log('salesmen');
            console.log(salesmenInstance);
            res.send({ salesmen: salesmenInstance });
            return;
        }
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.post('/order', function (req, res) {
    UserModel_1.saveProduct(req.body.data)
        .then(function (order) {
        res.send({ status: true, data: order });
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.get('/Order/:AdminId', function (req, res) {
    //let id = req.params._id;
    var AdminId = req.params.AdminId;
    UserModel_1.findProduct({ AdminId: AdminId })
        .then(function (OrderInstance) {
        if (OrderInstance) {
            console.log('salesmen');
            console.log(OrderInstance);
            res.send({ Orders: OrderInstance });
            return;
        }
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
module.exports = router;
