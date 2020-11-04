const express = require('express')
const path = require('path')
const {Client} = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express()

const PORT = process.env.PORT || 5000
app.use(cors())
app.use(bodyParser.json());
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

const config = new Client({
    user: "skfkphlaszgmel",
    password: "8efd269dfb4861093426700b1d64069ffb01af7c05ae8f0b463d5ff2f6224457",
    database: "ddf3o6img023gr",
    port: 5432,
    host: "ec2-3-210-23-22.compute-1.amazonaws.com",
    requestCert: true,
    agent: false,
    ssl: {
        rejectUnauthorized: false
    }
});

config.connect()

app.get('/api/brand/get-brand', (request, response) => {
    config.query('select * from brand;', (err, res) => {
        if (err) {
            console.log(err)
        } else {
            response.status(200)
            response.send(res.rows)
        }
    })
})

app.get('/api/category/get-category', (request, response) => {
    config.query('select * from category;', (err, res) => {
        if (err) {
            console.log(err)
        } else {
            response.status(200)
            response.send(res.rows)
        }
    })
})

app.post('/api/orders/add-orders', (request, response) => {
    const orders = request.query
    if (orders != null) {
        config.query('insert into orders (customer_id,store_id,admin_id,created_at,updated_at) values ($1,$2,$3,current_timestamp,current_timestamp);',
            [parseInt(orders.customer_id), parseInt(orders.store_id), parseInt(orders.admin_id)],
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    response.send({status: "Successful"})
                }
            })
    } else {
        response.send({status: "Fail"})
    }
})

app.post('/api/orders/add-orders-detail', (request, response) => {
    const ordersDetail = request.query
    if (ordersDetail != null) {
        config.query('insert into ordersdetail (orders_id,product_id,quantity,created_at,updated_at) values ($1,$2,$3,current_timestamp,current_timestamp);',
            [ordersDetail.orders_id, ordersDetail.product_id, ordersDetail.quantity],
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    response.send({status: "Successful"})
                }
            })
    } else {
        response.send({status: "Fail"})
    }
})

app.get('/api/orders/get-orders', (request, response) => {
    config.query('select admin.admin_name, customer.customer_name, store.store_name, orders.orders_id, orders.created_at from orders inner join admin on orders.admin_id = admin.admin_id inner join store on store.admin_id = admin.admin_id inner join customer on customer.customer_id = orders.customer_id;', (err, res) => {
        if (err) {
            console.log(err)
        } else {
            response.status(200)
            response.send(res.rows)
        }
    })
})

app.get('/api/orders/get-orders-detail', (request, response) => {
    const orderId = request.query.orderId
    config.query('select store.store_name, product.product_id, customer.customer_name , admin.admin_name , orders.created_at , product.product_name , product.product_price , ordersdetail.quantity from orders inner join ordersdetail on orders.orders_id = ordersdetail.orders_id inner join product on product.product_id = ordersdetail.product_id inner join admin on admin.admin_id = orders.admin_id inner join store on store.admin_id = admin.admin_id inner join customer on customer.customer_id = orders.customer_id where orders.orders_id = $1;',
        [orderId],
        (err, res) => {
            if (err) {
                console.log(err)
            } else {
                response.status(200)
                response.send(res.rows)
            }
        })
})

app.post('/api/product/add-product', (request, response) => {
    const product = request.query
    if (product != null) {
        config.query('insert into product'
            + '(product_name,product_price,product_status,product_image,brand_id,category_id,created_at,updated_at)'
            + 'values ($1, $2, $3, $4, $5, $6, current_timestamp, current_timestamp);',
            [product.name, product.price, product.status, product.image, product.brand, product.category],
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    response.send({status: "Successful"})
                }
            })
    } else {
        response.send({status: "Fail"})
    }
})

app.get('/api/product/get-product', (request, response) => {
    config.query('select * from product;', (err, res) => {
        if (err) {
            console.log(err)
        } else {
            response.status(200)
            response.send(res.rows)
        }
    })
})