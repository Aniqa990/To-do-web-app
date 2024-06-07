
const baseURL = "http://localhost:5500/todos"
let objarr=[]

//fetching todos

fetch(baseURL)
.then(res => res.json())
.then(json => {
  let list = document.getElementById("items");

  json.forEach(item=> {
    let obj={
      name : "",
      date : "",
      description : "",
      class_name : "",
      id : "",
      status : ""
    }
      
      obj.name = item.task
      obj.date = item.due_date
      obj.description = item.description
      obj.class_name = "item-"+(item.todo_id)
      obj.id = item.todo_id
      obj.status = item.status

    
      objarr.push(obj)

      let task_item = document.createElement("div")
      task_item.setAttribute("class", "item-"+item.todo_id)
      task_item.setAttribute("onclick", "showdesc(this)")
      
    
      let input = document.createElement("input")
      input.setAttribute("type", "checkbox")
      input.setAttribute("id", "item-"+item.todo_id)
      input.setAttribute("name", "item-"+item.todo_id)
      input.setAttribute("onclick", "crossed()")
      task_item.appendChild(input)
    
      let label = document.createElement("label")
      
      const formattedDate = new Date(obj.date).toLocaleDateString('en-US');
      
        let span = document.createElement("span")
        span.appendChild(document.createTextNode(obj.name))
      label.appendChild(span);
      label.appendChild(document.createElement("br"))
      label.appendChild(document.createTextNode("Due date: "+formattedDate))
    
      task_item.appendChild(label)
    
      let button = document.createElement("button")
      button.setAttribute("class", "delete")
      button.setAttribute("onclick", "deleteBtn(this)")
      button.appendChild(document.createTextNode("X"))
      task_item.appendChild(button)
    
      list.appendChild(task_item);
      console.log(task_item)

      if(obj.status=="crossed"){
        input.parentElement.style.textDecoration = "line-through"
        input.checked = true
      }
      else{
        input.parentElement.style.textDecoration = "none"
        input.checked = false
      }
  });
  })
  .catch(error=> console.log(error))

  





//for checking checkboxes
function crossed(){
let items = document.querySelectorAll("input[type='checkbox']")


for(let i=0; i<items.length; i++){
  for(let j=0; j<objarr.length; j++){

  if(items[i].checked && items[i].id==objarr[j].class_name){
    items[i].parentElement.style.textDecoration = "line-through"
    objarr[j].status = "crossed"

    let postReqBody = {
      checked : objarr[j].status
    }

    fetch("http://localhost:5500/checked"+`/${objarr[j].id}`, {body: JSON.stringify(postReqBody), headers: {"Content-Type": "application/json",},method:"PUT"})
  }

  else if(!items[i].checked && items[i].id==objarr[j].class_name){
    items[i].parentElement.style.textDecoration = "none"
    objarr[j].status = ""

    let postReqBody = {
      checked : objarr[j].status
    }

    fetch("http://localhost:5500/checked"+`/${objarr[j].id}`, {body: JSON.stringify(postReqBody), headers: {"Content-Type": "application/json",},method:"PUT"})
  }

    else;
  }
}
}



//for adding task

function Addtask(){
let list = document.getElementById("items");


let postReqBody = {
  description: document.getElementById("task-desc").value,
  task : document.getElementById("task-name").value,
  date: document.getElementById("task-date").value
}

fetch(baseURL, {body: JSON.stringify(postReqBody), headers: {"Content-Type": "application/json",},  method: "POST"})
.then(res=>res.json())
.then(json => {
  console.log("Created todo!")
  let obj={
    name : "",
    date : "",
    description : "",
    class_name : "",
    id:""  ,
    status : ""
  }
    
    obj.name = document.getElementById("task-name").value
    obj.date = document.getElementById("task-date").value
    obj.description = document.getElementById("task-desc").value
    obj.class_name = "item-"+(json.todo_id)
    obj.id = json.todo_id
    obj.status = ""
  
    objarr.push(obj)
  
    //resetting input boxes
    document.getElementById("task-name").value = ""
    document.getElementById("task-date").value = ""
    document.getElementById("task-desc").value = ""
  
    let task_item = document.createElement("div")
    task_item.setAttribute("class", "item-"+json.todo_id)
    task_item.setAttribute("onclick", "showdesc(this)")
    
  
    let input = document.createElement("input")
    input.setAttribute("type", "checkbox")
    input.setAttribute("id", "item-"+json.todo_id)
    input.setAttribute("name", "item-"+json.todo_id)
    input.setAttribute("onclick", "crossed()")
    task_item.appendChild(input)
  
    let label = document.createElement("label")
    
    const formattedDate = new Date(obj.date).toLocaleDateString('en-US');
    
      let span = document.createElement("span")
      span.appendChild(document.createTextNode(obj.name))
    label.appendChild(span);
    label.appendChild(document.createElement("br"))
    label.appendChild(document.createTextNode("Due date: "+formattedDate))
  
    task_item.appendChild(label)
  
    let button = document.createElement("button")
    button.setAttribute("class", "delete")
    button.setAttribute("onclick", "deleteBtn(this)")
    button.appendChild(document.createTextNode("X"))
    task_item.appendChild(button)
  
    list.appendChild(task_item);
    console.log(task_item)
    
  })
}




//show description


function showdesc(e){
let classname = e.getAttribute("class")

  
  for(let i=0; i<objarr.length; i++){
      if(objarr[i].class_name == classname)
      {
        let descbox = document.getElementById("description");
       descbox.textContent = objarr[i].description

 //setting edit button id
        document.querySelector(".edit").setAttribute("id", classname)
    }
  }
}


//for deleting task

function deleteBtn(e){



   console.log("hi")
  var div = e.parentNode;

  classname = div.getAttribute("class")
  
  for(let i=0; i<objarr.length; i++){
   if(objarr[i].class_name==classname){

    fetch(baseURL+`/${objarr[i].id}`, {method: "DELETE", headers:{"Content-Type": "application/json"}})

      objarr.splice(i,1)
    }
  }


  var div2 = document.getElementById("items")

  div2.removeChild(div)

  let inputs = document.querySelectorAll("input[type='checkbox']")

 
  //setting the ids and for attributes to the right item no.
  
  for(let i=0; i<objarr.length; i++){
    for(let j=0; j<inputs.length; j++){
      if(objarr[i].class_name==inputs[j].getAttribute("id")){
        inputs[j].setAttribute("id", "item-"+(i+1))
        inputs[j].setAttribute("name", "item-"+(i+1))
        inputs[j].parentNode.setAttribute("class", "item-"+(i+1))
        objarr[i].class_name="item-"+(i+1)
      }
    }
  }

  console.log(objarr)

  document.getElementById("description").textContent = ""
}


//for editing task

function editing(){
  
  let form = document.querySelector(".form")
  
  form.innerHTML = 
    `<form class="editing-tasks">
          <label for="task-name">Task Name : <input id="task-name" name="task-name" type="text"></label>
          <label for="task-date">Due Date  : <input name=task-date id="task-date" type="date"></label>
          <label for="task-desc">Description : <input name="task-desc" id="task-desc" type="text"></label>
        <submit class="add-task" onclick="Edittask()" value="submit">+ Edit task</submit>
   </form>`

  document.getElementById("task-name").focus()

}

function Edittask(){
  
  let id = document.querySelector(".edit").getAttribute("id")

  let items = document.querySelectorAll("input[type='checkbox']")

  for(let i=0; i<items.length; i++){
    for(let j=0; j<objarr.length; j++){
      if(items[i].getAttribute("id")==id && objarr[j].class_name==id){

        objarr[j].name = document.getElementById("task-name").value
  objarr[j].date = document.getElementById("task-date").value
  objarr[j].description = document.getElementById("task-desc").value 

  let postReqBody = {
    description: document.getElementById("task-desc").value,
    task : document.getElementById("task-name").value,
    date: document.getElementById("task-date").value
  }

  fetch(baseURL+`/${objarr[j].id}`, {body: JSON.stringify(postReqBody), headers: {"Content-Type": "application/json",},method:"PUT"})

        console.log(objarr[j])

        var label = items[i].parentNode.querySelector("label")

        label.innerHTML = `<span>${objarr[j].name}</span><br>Due date: ${objarr[j].date} `
 console.log(items[i])
      }
    }
  }

  let form = document.querySelector(".form")
  form.innerHTML = `
  <form class="adding-tasks">
          <label for="task-name">Task Name : <input id="task-name" name="task-name" type="text"></label>
          <label for="task-date">Due Date  : <input name=task-date id="task-date" type="date"></label>
          <label for="task-desc">Description : <input name="task-desc" id="task-desc" type="text"></label>
        <submit class="add-task" onclick="Addtask()" value="submit">+ Add task</submit>
        </form>`
}