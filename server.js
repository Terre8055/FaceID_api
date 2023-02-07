const express = require("express");
const bodyParser = require('body-parser');
// const dotenv = require('dotenv')
const app = express();

app.use(bodyParser.json({external: false}))

const database = {
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

app.get('/', (req, res) => {
   res.json(database.users)
})


app.post('/signIn', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json('Success')
    }else{
        res.status(400).json('error');
    }
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
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
  
    const user = database.users.find(u => u.id === id);
  
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
  



app.listen(3000, () => {
    console.log("Server started on port 3000 ");
})