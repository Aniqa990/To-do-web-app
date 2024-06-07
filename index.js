const express = require ("express")
const app = express()
const pool = require("./db")
const cors = require("cors")

app.use(cors({origin: '*'}))
app.use(express.json()) //req.body
//app.use(bodyParser.json())



//create todos
app.post("/todos", async(req, res)=>{
    try{
const { description, task, date } = req.body
const newTodo = await pool.query("INSERT INTO todo (description, task, due_date) VALUES ($1, $2, $3) RETURNING *", [description, task, date]);
res.json(newTodo.rows)
    }
    catch (err) {
        console.error(err.message)
    }
})

//see all todos

app.get("/todos", async(req, res)=>{
    try{
        const alltodos = await pool.query("SELECT * FROM todo")
        res.json(alltodos.rows)
    }
    catch(err){
        console.error(err.message)
    }
})

//update todo

app.put("/todos/:id", async(req, res)=>{
    try{
const {id} = req.params
const {task, description, date} = req.body

const updatetodo = await pool.query("UPDATE todo SET description = $1, task = $2, due_date = $3 WHERE todo_id = $4", [description, task, date, id])
res.json("To do updated!")
    }
    catch(err){
        console.error(err.message)
    }
})

//checking todos

app.put("/checked/:id", async(req, res)=>{
    try{
const {id} = req.params
const {checked} = req.body

const updatetodo = await pool.query("UPDATE todo SET status = $1 WHERE todo_id = $2", [checked, id])
res.json(updatetodo)
    }
    catch(err){
        console.error(err.message)
    }
})

//delete todo

app.delete("/todos/:id", async(req, res)=>{
    try{
const {id} = req.params

const deletetodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
res.json("To do deleted!")
    }
    catch(err){
        console.error(err.message)
    }
})

app.listen(5500,()=> {
    console.log("Server is listening on port 5500");
})
