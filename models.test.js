const db = require("./db")

const {Restaurant, Menu, Item} = require('./models') //restaurant key destructuring assignment 

describe('Restaurant', () => {
    beforeAll((done) => {
        db.exec('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name TEXT, image TEXT); CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);',done)
    })
    test('when a restaurant is created is it added to the database', async () =>{
        const restaurant = await new Restaurant({name: 'Oeuf', image: 'url'})
        expect(restaurant.id).toBe(1)
    })
    test('create a restaurant for the data row', async (done) => {
        db.get('SELECT * FROM restaurants WHERE id = 1', async (err, row) => {
            expect(row.name).toBe('Oeuf')
            const restaurant = await new Restaurant(row)
            expect (restaurant.id).toBe(1)
            expect (restaurant.name).toBe('Oeuf')
            done()
        })
    })
    test('a restaurant should have menus', async () => {
        const restaurant = await new Restaurant({name: 'Fromage', image: 'url'})
        expect(restaurant.menu.length).toBe(0)
        //const menu = await new Menu({title:'Dessert', restaurant_id: restaurant.id})
        await restaurant.addMenu({title: 'Dessert'})
        expect(restaurant.menu[0] instanceof Menu).toBeTruthy() //check if it is an instance of this class 
        expect(restaurant.menu[0].id).toBeTruthy()
        await restaurant.addMenu({title: 'Main Menu'})
        await restaurant.addMenu({title: 'Wine Menu'})

        db.get('SELECT * FROM restaurants WHERE id=?;', [restaurant.id], async (err, row) => {
            const fromage = await new Restaurant(row)
            expect(fromage.id).toBe(restaurant.id)
            expect(fromage.menu.length).toBe(3)
            expect(restaurant.menu[0] instanceof Menu).toBeTruthy()
        })


    })
})

describe('Menu', () => {
    beforeAll((done) => {
        db.exec('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name TEXT, image TEXT); CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, title TEXT, restaurant_id INTEGER);',done)
    })
    test('when a menu is created is it added to the database', async () => {
        const menu = await new Menu({title: 'Set Menu', restaurant_id: 1})
        expect(menu.id).toBeTruthy()
        expect(menu.restaurant_id).toBe(1)
        expect (menu.title).toBe('Set Menu')

    })
    test('create a menu for the data row', async (done) => {
        db.get('SELECT * FROM menu WHERE id = 1', async (err, row) => {
            expect(row.title).toBe('Dessert')
            const menu = await new Menu(row)
            expect (menu.id).toBe(1)
            done()
        })
    })
})

describe('Items', () => {
    beforeAll((done) => {
        db.exec('CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY, name TEXT, price FLOAT, menu_id INTEGER);', done)
    })
    test('when an item is created is it added to the database', async () =>{
        const item = await new Item({name: 'steak', price: 28, menu_id: 1})
        expect(item.id).toBe(1)
        expect(item.menu_id).toBe(1)
        expect(item.name).toBe('steak')
        expect(item.price).toBe(28)
    })
})