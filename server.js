const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require("cors");
const app = express();

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
    //Hash test to compare original password with hashed passwd
    bcrypt.compare('apples', "$2a$10$F9ML4XSQTHE38ZXrJNuq7eyTAazvqS3iZ7OzbEcqUXM0SQmfcwgmO", function(err, res) {
        if (res) {
         console.log(res)
        } else {
         console.log("Enter correct password")
        }
      });
      const resUser = database.users.find(u => req.body.email === u.email && req.body.password === u.password)
        if(resUser){
        res.json('Success')
        }else{
        res.status(400).json('error'); //if  error
     }
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    bcrypt.hash(password, 10, function(err, hash) {//hash password input for security
        console.log(hash)
      });
    database.users.push({
            id: '123456',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date().toString()
    })
    res.json(database.users)
})

/*@Getting the time when user logs in/register
app.get(/, req res => {
    const date = new Date()
    req.time = date
    next()
    .....//
    (req res){
        res.json({time: req.time})
    }
})
*/

//getUser Id from array

// app.get('/profile/:id', (req, res) => {
//     const { id } = req.params; //dest id from param obj
//     database.users.forEach(user => {
//         if (user.id === id){
//              res.json(user) continuous loop
//         }else{
//             res.status(404).json('User Not Found');
//         }
//     })
// })

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