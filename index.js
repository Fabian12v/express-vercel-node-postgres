const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const { Pool } = require('pg');

const API_KEY='Fabian2023';

const PORT=process.env.PORT;

const apiKeyValidation=(req,res,next)=>{
    const userApiKey=req.get('x-api-key');
    if(userApiKey && userApiKey === API_KEY){
        next();
    }else{
        res.status(401).send('Invalid API Key');
    }
};

app.use(apiKeyValidation);


const pool = new Pool({
    user: 'default',
    host: 'ep-orange-smoke-08960365.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'bf3BTmnKYd4P',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

app.get('/students', function (req, res) {
    res.status(201);
    const listUsersQuery = 'SELECT * FROM students;';



    pool.query(listUsersQuery)
        .then(data => {
            console.log("List students: ", data.rows);
            res.send(data.rows);

        })
        .catch(err => {
            console.error(err);

        });
});

app.get('/students/:id', function (req, res) {
    res.status(201);
    const index = req.params.id
    const listUsersQuery = `SELECT * FROM students where id=${index}`;



    pool.query(listUsersQuery)
        .then(data => {
            console.log("id", data.rows);
            res.send(data.rows);
        })
        .catch(err => {
            console.error(err);
        });
});

app.post('/students', function (req, res) {

    const insertUsersQuery = ` INSERT INTO students (id,name,lastname,notes)VALUES 
('${req.body.id}','${req.body.name}','${req.body.lastname}','${req.body.notes}');`;

    pool.query(insertUsersQuery)
        .then(() => {
            return res.send('Student added')
        })
        .catch(err => {
            console.error(err);

        });

})

app.put('/students', (req, res) => {
    const updateUserQuery = ` 
    UPDATE students SET name ='${req.body.name}',lastname ='${req.body.lastname}',notes ='${req.body.notes}',
     WHERE id ='${req.params.id}');`;


    pool.query(updateUserQuery)
        .then(data => {
            console.log("students actualizado ");
            res.send(data.rows);

        })
        .catch(err => {
            console.error(err);

        });
    
});

app.delete("/students/:id",(req,res)=>{

    const borrarUsuario = 'DELETE FROM students WHERE id = ${req.params.id}'
    ;
     pool.query(borrarUsuario)
     .then(data=>{
        console.log(data.rows);
    
     res.send("se ha borrado el usuario");
    
    })
    .catch(err => {
           
        res.send("page not found")
        console.error(err);
    })
    });

app.listen(port, function () {
    console.log(`The app is running!!`);
});