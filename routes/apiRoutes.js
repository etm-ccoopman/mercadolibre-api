const axios = require('axios');
const e = require('express');

module.exports = app => {

    app.get('/api/items', async (req, res) => {
        const { q } = req.query;

        const data = await axios({
            method: 'get',
            url: process.env.API_ITEMS,
            headers: {}
        }).then(function async(results) {
            const obj = {
                author: {
                    name: process.env.AUTHOR_NAME
                    , lastname: process.env.AUTHOR_LASTNAME
                }, categories: []
                , items: []
            };

            if (results.data !== undefined && results.data !== null && results.data.results.length > 0) {
                results.data.results.map((e, i) => {
                    if (i < 4) {
                        obj.categories.push(e.category_id);
                        obj.items.push({
                            id: e.id
                            , title: e.title
                            , price: {
                                currency: e.currency_id
                                , amount: e.price
                                , decimals: 0
                            }, picture: e.thumbnail
                            , condition: e.condition
                            , free_shipping: e.shipping.free_shipping
                        });
                    }
                });
            }
            res.json({
                state: true
                , data: obj
            });
        }).catch(function (err) {
            res.json({
                state: false
                , err
            });
        });
    });

    app.get('/api/items/:id', async (req, res) => {
        const obj = {
            author: {
                name: process.env.AUTHOR_NAME
                , lastname: process.env.AUTHOR_LASTNAME
            }, item: {}
        };

        const step1 = await axios({
            method: 'get',
            url: `${process.env.API_ITEMS_BY_ID}/${req.params.id}`,
            headers: {}
        }).then(function async(results) {
            if (results.data !== undefined && results.data !== null) {
                obj.item = {
                    id: results.data.id
                    , title: results.data.title
                    , price: {
                        currency: results.data.currency_id
                        , amount: results.data.price
                        , decimals: 0
                    }, picture: results.data.thumbnail
                    , condition: results.data.condition
                    , free_shipping: results.data.shipping.free_shipping
                    , sold_quantity: results.data.sold_quantity
                }
            }
            return {
                state: true
            }
        }).catch(function (err) {
            return {
                state: false
                , err
            }
        });

        if (step1.state) {
            const step2 = await axios({
                method: 'get',
                url: `${process.env.API_ITEMS_BY_ID}/${req.params.id}/description`,
                headers: {}
            }).then(function async(results) {
                if (results !== undefined && results !== null) {
                    obj.item.description = results.data.plain_text;
                }
                return {
                    state: true
                }
            }).catch(function (err) {
                return {
                    state: false
                    , err
                }
            });

            if (step2.state) {
                res.json({
                    state: true
                    , data: obj
                });
            }
        } else {
            res.json({
                state: false
                , err: step1.err
            });
        }
    });

}