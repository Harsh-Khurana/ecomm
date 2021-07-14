const express = require('express');
const cookieSession = require('cookie-session');
const userRepo = require('./repositories/users');

const app = express();

app.use(express.urlencoded({ extended : true }));
app.use(cookieSession({
    keys : ['mycookiesecret']
}))

app.get('/signup', (req, res)=>{
    res.send(`
        <div>
            Your id :${req.session.userId}<br>
            <form method="POST" action="signup">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <input name="passwordConfirmation" placeholder="password confirmation"/>
                <button>Sign up</button>
            </form>
        </div>
    `);
})

app.post('/signup', async (req, res)=>{
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await userRepo.getOneBy({ email });

    if(existingUser){
        return res.status(400).send('Email in use');
    }
    if(password !== passwordConfirmation){
        return res.status(400).send('Passwords dont match');
    }
    const user = await userRepo.create({ email, password });
    req.session.userId = user.id;
    res.send('Account created!!');
})

app.get('/signout', (req, res)=>{
    req.session = null;
    res.send('You are logged out');
})

app.get('/signin', (req, res)=>{
    res.send(`
        <div>
            <form method="POST" action="/signin">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <button>Sign In</button>
            </form>
        </div>
    `);
})

app.post('/signin', async(req, res)=>{
    const { email, password } = req.body;
    const user = await userRepo.getOneBy({ email });

    if(!user){
        return res.status(400).send('Email not found');
    }

    const validPassword = await userRepo.comparePassword(user.password, password);
    if(!validPassword){
        return res.status(400).send('Invalid password');
    }
    req.session.userId = user.id;
    res.send('You are signed in');
})

app.listen(3000, ()=>{
    console.log('Server started');
})