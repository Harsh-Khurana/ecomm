const express = require('express');
const router = express.Router();
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/cart/show');

router.post('/cart/products', async(req, res)=>{
    let cart;
    if(!req.session.cardId){
        cart = await cartsRepo.create({ items : [] });
        req.session.cardId = cart.id;
    }else {
        cart = await cartsRepo.getOne(req.session.cardId);
    }

    const existingItem = cart.items.find(item=> item.id === req.body.productId);
    if(existingItem){
        existingItem.quantity++;
    }else{
        cart.items.push({ id : req.body.productId, quantity : 1 });
    }
    await cartsRepo.update(cart.id, {
        items : cart.items
    });
    res.redirect('/');
})

router.get('/cart', async (req, res)=>{
    if(!req.session.cardId){
        return res.redirect('/');
    }
    const cart = await cartsRepo.getOne(req.session.cardId);
    for(let item of cart.items){
        item.product = await productsRepo.getOne(item.id);
    }
    res.send(cartShowTemplate({ items : cart.items }));
})

router.post('/cart/products/delete', async (req, res)=>{
    const cart = await cartsRepo.getOne(req.session.cardId);
    const items = cart.items.filter(item=>item.id !== req.body.itemId);
    await cartsRepo.update(req.session.cardId, { items });
    res.redirect('/cart');
})

module.exports = router;