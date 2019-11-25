"use strict";
let fullTaskList = {};
let taskTemplate = document.querySelector('#task-template').content;
var newItemTemplate = taskTemplate.querySelector('.todo-list-item');
let changeTaskTemplate = document.querySelector('#change-task-template').content;
let changeTask = changeTaskTemplate.querySelector('.inplaceeditor');

let list = document.querySelector('.todo');
let items = list.children;
let emptyListMessage = document.querySelector('.empty-list'); 
let newItem = document.querySelector('.create-new-item');
let newItemTitle = newItem.querySelector('.create-new-item-input');

let delAll = document.querySelector('.delete-done-items-panel');

let doneList = document.querySelector('.done-list');
let doneItems = doneList.children;
let emptyDoneListMessage = document.querySelector('.empty'); 
let done_prbar = document.querySelector('.done-progress');
let todo_prbar = document.querySelector('.todo-progress');

/****************** progress bar ******************/
function changeProgressBar() {
  let progress = (doneItems.length / (items.length + doneItems.length))*100;
  done_prbar.setAttribute("style", "width:" + progress + "%;"); 
  todo_prbar.setAttribute("style", "width:" + progress + "%;"); 
}

/****************** show message ******************/
let toggleEmptyListMessage = function() {
    if (items.length === 0) {
        emptyListMessage.classList.remove('hidden');
    }
    else {
        emptyListMessage.classList.add('hidden');
    }
};

let toggleEmptyDoneListMessage = function() {
  if (doneItems.length === 0) {
    emptyDoneListMessage.classList.remove('hidden');
  }
  else {
    emptyDoneListMessage.classList.add('hidden');
  }
};

/********************* change list **********************/
let addCheckHandler = function(item) {
    let checkbox = item.querySelector('.checkbox');
    checkbox.addEventListener('change', function() {
      if (checkbox.parentElement.parentElement.className == 'todo')
      {
        doneList.prepend(item);
        //fullTaskList[checkbox.parentElement.querySelector('span').textContent] = 'done';
        fullTaskList.todo = list.innerHTML;
        fullTaskList.done = doneList.innerHTML;
        localStorage.setItem('elems', JSON.stringify(fullTaskList));
      }
      else
      {
        list.append(item);
        fullTaskList.todo = list.innerHTML;
        fullTaskList.done = doneList.innerHTML;
        localStorage.setItem('elems', JSON.stringify(fullTaskList));
      }
      newItemTitle.focus();
      toggleEmptyListMessage();
      toggleEmptyDoneListMessage();
      changeProgressBar(); 
    });
};

/******************* create task while initialization ******************/
function CreateTodoTask(taskName) {
  let task = newItemTemplate.cloneNode(true);
  let taskDescription = task.querySelector('span');
  taskDescription.textContent = taskName;
  list.appendChild(task);
}

function CreateDoneTask(taskName) {
  let task = newItemTemplate.cloneNode(true);
  let taskDescription = task.querySelector('span');
  //let taskCheckBox = task.querySelector('input');
  //taskCheckBox.checked = true;
  taskDescription.textContent = taskName;
  doneList.appendChild(task);
}

/*******************  initialization ******************/
let temp = JSON.parse(localStorage.getItem('elems'));
if (temp === null){
  let tasksArray = ["Howdy. Let's get you up and running.", 
                    "All changes are saved locally, automatically.", 
                    "Drag this item onto another list (on the right) to transfer it.", 
                    "Drag this item up or down to re-order it.", 
                    "Drag the list, Example template, over this lists title above.",
                    "The list, Important Info, is worth a quick look.", 
                    "All done. Tick all the items off then hit the trash icon below."];
  for (let i=0; i<tasksArray.length; i++) {
    CreateTodoTask(tasksArray[i]);
  }
  fullTaskList.todo = list.innerHTML; 
  fullTaskList.done = doneList.innerHTML;
  localStorage.setItem('elems', JSON.stringify(fullTaskList));
  toggleEmptyDoneListMessage();
}
else{
  fullTaskList = temp;
  list.innerHTML = fullTaskList.todo;
  doneList.innerHTML = fullTaskList.done;
  toggleEmptyListMessage();  
  toggleEmptyDoneListMessage();
}

let dels = list.querySelectorAll('.delete-item');
let dels_done = doneList.querySelectorAll('.delete-item');

/********************* change task on db click **************************/
function taskChange(item) {
  item.addEventListener('dblclick', function() {
  let changeTaskDescription = item.querySelector('span').textContent;
  let newTask = item.querySelector('span');
  let changedItem = changeTask.cloneNode(true); //замена новым шаблоном
  let inputChanged = changedItem.querySelector(".input-new-task");
  inputChanged.value = changeTaskDescription;//запись в строку ввода нового шаблона текста из старого
  item.replaceWith(changedItem);
  inputChanged.select();

  let elementForm = changedItem.querySelector('.form'); //получаем форму нового шаблона
  let saveButton = elementForm.querySelector('.save');// получаем кнопку сохранения изменений
  let canselButton = elementForm.querySelector('.cansel');//кнопка отмены изменений

  /********************* save changes **************************/
  function saveItem() {
    let taskDescription = inputChanged.value; 
    changedItem.replaceWith(item);
    newTask.textContent = taskDescription;
    newItemTitle.focus();
    fullTaskList.todo = list.innerHTML;
    fullTaskList.done = doneList.innerHTML;
    localStorage.setItem('elems', JSON.stringify(fullTaskList));
  }

  saveButton.addEventListener ('click', function() { //сохраняем изменения по кнопке save
    saveItem();
  });

  item.addEventListener('keydown', function() {//сохраняем изменения по нажатию  enter
    if (evt.keyCode == 13) {
      saveItem();
    }
  });

  /********************* cansel changes **************************/
  canselButton.addEventListener('click', function() {//отменяем изменения по нажатию кнопки cansel
    let taskDescription = changeTaskDescription; // записываем в переменную старое описание задачи
    changedItem.replaceWith(item);
    let newTask = item.querySelector('span');
    newItemTitle.focus();
    newTask.textContent = taskDescription; //перезаписываем имя задачи на старое
    });
  }); 
}

for (let i = 0; i < items.length; i++) {
  taskChange(items[i]);
  addCheckHandler(items[i]);
}

for (let i = 0; i < doneItems.length; i++) {
  addCheckHandler(doneItems[i]);
  taskChange(doneItems[i]);
  let taskCheckBox = doneItems[i].querySelector('input');
  taskCheckBox.checked = true;
}

changeProgressBar(); 

/********************* create new task **************************/
newItem.addEventListener('keydown', function(evt) {
  if (evt.keyCode === 13) {
    if (newItemTitle.value == "") {
      alert("Did you forget to type your item?");
    }
    else {
      let taskText = newItemTitle.value;
      let task = newItemTemplate.cloneNode(true);
      let taskDescription = task.querySelector('span');
      taskDescription.textContent = taskText;
      addCheckHandler(task);
      list.appendChild(task);
      newItemTitle.value = '';
      changeProgressBar(); 
      let delH = task.querySelector('.delete-item');
      DelHandler(delH);
      taskChange(task);
      fullTaskList.todo = list.innerHTML;
      fullTaskList.done = doneList.innerHTML;
      localStorage.setItem('elems', JSON.stringify(fullTaskList));
      toggleEmptyListMessage();  
    }
  }
});
/********************* delete one task **************************/
let DelHandler = function(del) {
  del.addEventListener('click', function() {
  del.parentNode.remove();
  fullTaskList.todo = list.innerHTML;
  fullTaskList.done = doneList.innerHTML;
  localStorage.setItem('elems', JSON.stringify(fullTaskList));
  toggleEmptyListMessage();
  toggleEmptyDoneListMessage();
  changeProgressBar(); 
  });
};

for (let i = 0; i < dels.length; i++) {
  DelHandler(dels[i]);
} 

for (let i = 0; i < dels_done.length; i++) {
  DelHandler(dels_done[i]);
}   

/********************* delete all tasks **************************/
delAll.onclick = function() {
  doneList.innerHTML='';
  newItemTitle.focus();
  fullTaskList.todo = list.innerHTML;
  fullTaskList.done = doneList.innerHTML;
  localStorage.setItem('elems', JSON.stringify(fullTaskList));
  toggleEmptyDoneListMessage();
} 