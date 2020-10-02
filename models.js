const db = require('./db')

class Restaurant {
    constructor(data) {
        const restaurant = this
        restaurant.id = data.id
        restaurant.name = data.name
        restaurant.image = data.image
        restaurant.menu = []

        if (restaurant.id) {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM menu WHERE restaurant_id=?;', [restaurant.id], (err, rows) => {
                    const arrayOfPromises = rows.map(row => new Menu(row)) //array of promises
                    Promise.all(arrayOfPromises)
                    .then(menu => {
                        restaurant.menu = menu
                        resolve(restaurant)
                    }).catch(err => reject(err))
            })
        })
            //return Promise.resolve(restaurant) //immediate resolvement as we already have the resturant ID
        } else { //brand new restaurant no ID
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO restaurants(name, image) VALUES (?,?);', [restaurant.name, restaurant.image], 
                function (err) {
                    if (err) return reject(err)
                    restaurant.id = this.lastID
                    return resolve(restaurant)
            })
            })
        }
    }
    async addMenu(data) {
        const menu = await new Menu({title: data.title, restaurant_id: this.id})
        this.menu.push(menu)

    }
}

class Menu {
    constructor(data) {
        const menu = this
        menu.id = data.id
        menu.title = data.title
        menu.restaurant_id = data.restaurant_id

        if (menu.id) {
            return Promise.resolve(menu)
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO menu(title, restaurant_id) VALUES (?, ?);', [menu.title, menu.restaurant_id], function (err) {
                    if (err) return reject(err)
                    menu.id = this.lastID
                    return resolve(menu)
                })
            })
        }
    }
}

class Item {
    constructor(data) {
        const item = this
        item.id = data.id
        item.name = data.name
        item.price = data.price
        item.menu_id = data.menu_id

        if (item.id) {
            return Promise.resolve(item)
        } else {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO item(name, price, menu_id) VALUES (?, ?, ?);', [item.name, item.price, item.menu_id], function (err) {
                    if (err) return reject(err)
                    item.id = this.lastID
                    return resolve(item)
                })
            })
        }
    }
}
module.exports = {
    Restaurant,
    Menu,
    Item
}