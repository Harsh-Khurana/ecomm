const express = require('express');
const { handleErrors } = require('./middlewares');
const userRepo = require('../../repositories/users');
const signinTemplate = require('../../views/admin/auth/signin');
const signupTemplate = require('../../views/admin/auth/signup');
const { requireEmail, requirePassword, requirePassswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res)=>{
    res.send(signupTemplate({ req }));
})

router.post('/signup',[
    requireEmail, requirePassword, requirePassswordConfirmation
], handleErrors(signupTemplate) , async (req, res)=>{
    const { email, password } = req.body;
    const user = await userRepo.create({ email, password });

    req.session.userId = user.id;
    res.redirect('/admin/products');
})

router.get('/signout', (req, res)=>{
    req.session = null;
    res.send('You are logged out');
})

router.get('/signin', (req, res)=>{
    res.send(signinTemplate({}));
})

router.post('/signin', [
    requireEmailExists, requireValidPasswordForUser
], handleErrors(signinTemplate), async(req, res)=>{
    const { email } = req.body;
    const user = await userRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.redirect('/admin/products');
})

module.exports = router;