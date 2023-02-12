const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require("cors");
const app = express();
const knex = require('knex')//require from node
    
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432, // default port 
      user : 'Mike',
      password : '',
      database : 'face-api'
    }
  });

  db.select('*'). from ('login').then(data => {
    console.log(data)
  });

//middleware definitions

app.use(bodyParser.json({external: false}))
app.use(cors())//remove referrer restrictions

//request logger to check incoming traffic
app.use('/register', (req, res, next) => {
    console.log(`${req.path} ${req.method} -${req.ip}`)
    next()
})

const database = { //Test database
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '12345',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => { //Client makes a get request to the root page
   res.json(database.users)
})


app.post('/signIn', (req, res) => {
    /*CRUD operation: Select table of login to read table where email = req email*/
   db.select('email', 'hash').from('login')
   .where('email', '=', req.body.email)
   .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
    if(isValid){
        return db.select('*').from('users')
    /*CRUD operation: Select table of users to read table where email = req email*/
        .where('email', '=', req.body.email)
        .then(user => {
            res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user'))
    }else{

        res.status(400).json('wrong credentials')
    }
   })
   .catch(err => res.status(400).json('error'))
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body

    const hash = bcrypt.hashSync(password)//convert passkey to a hashkey (middleware)
        //doing multiple operations with transaction. Login user and then details reflect in the users table

        db.transaction(trx => {
            //line 87-92 => insert details from body to login table when client registers
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email') //next block is to return the email to the users table
            .then(loginEmail => {
                return trx('users')
                    .returning('*') 
                    .insert({
                        email: email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
                 })
                 .then(trx.commit) //commit to save changes
                 .catch(trx.rollback)//rollback changes if error
            })
            .catch (err => res.status(400).json('Unable to join'))
        
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
  
    const user = database.users.find(u => u.id === id);//loop through database to identify same id
  
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
  



app.listen(3000, () => {
    console.log("Server started on port 3000 ");//listen on this port as a debug protocol
})