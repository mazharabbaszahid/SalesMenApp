import express = require('express');
import mongoose = require('mongoose')
import Firebase = require('firebase');
import bcrypt = require('bcrypt-nodejs');
let UserModel = require('../DBRepo/UserModel')
let ref = new Firebase('https://salesmem.firebaseio.com//users');
import {saveUser,saveCompany ,findUser,saveSalesmen,findCompany,findSalesmen,saveProduct,findProduct,findSalesman} from "../DBRepo/UserModel"; 
let router = express.Router();

router.post('/signup', (req: express.Request, res: express.Response) => {

    ref.createUser({
        email: req.body.data.Email,
        password: req.body.data.Password
    }, function(err, success) {
        if (err) {
            res.send(err);
        } else {
            req.body.data.FirebaseToken = success.uid;            
                saveUser(req.body.data)
                .then((userInstance) => {
                    res.send({ status: true, user: userInstance });
                }, (err) => {
                    res.send({ status: false, message: err })
                })
        }
    })
})

router.post('/signin', (req: express.Request, res: express.Response) => {
    
    let user = req.body.data;
    findUser({ Email: user.email })
        .then((userInstance) => {
            if (!userInstance) {
                res.send("No user found with supplied email");
                return;
            }
            if (bcrypt.compareSync(user.password,userInstance.Password))  {
                res.send({ message: 'Loged in successfully', token: userInstance.FirebaseToken,user:userInstance });
                console.log(userInstance)

            } else {
                res.send("Wrong Password");
            }
        }, (err) => {
            res.send({ status: false, message: err });
        });
});

router.get('/:FirebaseToken', (req: express.Request, res: express.Response) => {
 let tokenParams = req.params.FirebaseToken;
    
    findUser({ FirebaseToken : tokenParams })
        .then((userInstance) => {
            console.log(userInstance);
            if (userInstance) {
                res.send({user:userInstance});
                return;
            }
           
        }, (err) => {
            res.send({ status: false, message: err });
        });
});

router.post('/company', (req: express.Request, res: express.Response) => {
       saveCompany(req.body.data)
                .then((comInstance) => { 
                    console.log(comInstance)                    
                    
                    res.send({ status: true, data: comInstance });
                }, (err) => {
                    res.send({ status: false, message: err })
                })
    
        
        
})
router.get('/viewCompany/:AdminId', (req: express.Request, res: express.Response) => {
 let AdminId = req.params.AdminId;
console.log(AdminId)
    findCompany({AdminId : AdminId })
        .then((companyInstance) => {
            if (companyInstance) {
                console.log('company')
                console.log(companyInstance)
                res.send({company:companyInstance});
                return;
            }
           
        }, (err) => {
            res.send({ status: false, message: err });
        });
});
router.post('/salesmen', (req: express.Request, res: express.Response) => {
   console.log('req body'+req.body)
            saveSalesmen(req.body.data)
                .then((comInstance) => {
                    res.send({ status: true, data: comInstance });
                    console.log('instance'+comInstance._id)
                }, (err) => {
                    res.send({ status: false, message: err })
                })
        }
    );
    
 router.get('/viewSalesmen/:AdminId', (req: express.Request, res: express.Response) => {
 let AdminId = req.params.AdminId;
 
console.log("Admin Id "+ AdminId)
    findSalesmen({AdminId : AdminId })
        .then((salesmenInstance) => {
            if (salesmenInstance) {
                console.log('salesmen')
                console.log(salesmenInstance)
                res.send({salesmen:salesmenInstance});
                return;
            }
           
        }, (err) => {
            res.send({ status: false, message: err });
        });
});

router.post('/order', (req: express.Request, res: express.Response) => {
   
            saveProduct(req.body.data)
                .then((order) => {
                    res.send({ status: true, data: order });
                }, (err) => {
                    res.send({ status: false, message: err })
                })
        }
    );


router.get('/Order/:salesmenId', (req: express.Request, res: express.Response) => {
 let id = req.params
 console.log(id)
 let SalesmenId = req.params.salesmenId;
    findProduct({SalesmenId : SalesmenId })
        .then((OrderInstance) => {
            if (OrderInstance) {
                console.log('salesmen order')
                console.log(OrderInstance)
                res.send({Orders:OrderInstance});
                return;
            }
           
        }, (err) => {
            res.send({ status: false, message: err });
        });
});

















router.post('/login', (req: express.Request, res: express.Response) => {
    
    let Salesman = req.body.data;
    findSalesman({ email: Salesman.email })
        .then((salesmanInstance) => {
            if (!salesmanInstance) {
                res.send("No Salesman found with supplied email");
                return;
            }
            if (Salesman.password==salesmanInstance.password)  {
                res.send({ message: 'Loged in successfully', salesman:salesmanInstance });
                console.log(salesmanInstance)

            } else {
                res.send("Wrong Password");
            }
        }, (err) => {
            res.send({ status: false, message: err });
        });
});

module.exports = router;