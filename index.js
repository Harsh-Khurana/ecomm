const express = require('express');
const userRepo = require('./repositories/users');

const app = express();

app.use(express.urlencoded({ extended : true }));

app.get('/', (req, res)=>{
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <input name="passwordConfirmation" placeholder="password confirmation"/>
                <button>Sign up</button>
            </form>
        </div>
    `);
})

app.post('/', async (req, res)=>{
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await userRepo.getOneBy({ email });

    if(existingUser){
        res.status(400).send('Email in use');
        return;
    }
    if(password !== passwordConfirmation){
        res.send('Passwords dont match');
        return;
    }
    await userRepo.create({ email, password });
    res.send('Account created!!');
})

app.listen(3000, ()=>{
    console.log('Server started');
})