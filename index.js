const createButton = document.querySelector("#btn-create");
const resetButton = document.querySelector("#btn-reset");
const userForm = document.querySelector("#task-form");
const taskBoard = document.querySelector(".task-list");
const errorMessage = document.getElementById("error-message");
const inputFields = document.getElementsByClassName("input-field");

let taskList = loadTaskList();
displayTasksInStorage();

createButton.addEventListener("click", HandleCreateClicked);
resetButton.addEventListener("click", HandleResetClicked);

//reset button handler
function HandleResetClicked(event) {
  cleanFormErrors();
  userForm.reset();
}

//submit button handler
function HandleCreateClicked(event) {
  event.preventDefault();
  cleanFormErrors();
  const taskData = createTaskData();
  if (!validateData(taskData)) {
    errorMessage.style.display = "inline-block";
    return;
  }
  addTaskToBoard(taskData);
  userForm.reset();
}

function cleanFormErrors() {
  errorMessage.style.display = "none";
  for (let i = 0; i < inputFields.length; i++) {
    const wrongField = inputFields[i];
    wrongField.classList.add("no-bg");
    wrongField.classList.remove("wrong-input");
  }
}

function validateData(taskData) {
  let valid = true;
  const values = Object.values(taskData);
  for (i = 0; i < values.length; i++) {
    if (!values[i]) {
      const wrongField = inputFields[i];
      wrongField.classList.remove("no-bg");
      wrongField.classList.add("wrong-input");
      valid = false;
    }
  }
  return valid;
}

function createTaskData() {
  const userData = new FormData(userForm);
  const data = {};
  userData.forEach(function (value, key) {
    data[key] = value;
  });
  const randomID = Math.floor(Math.random() * 1000000);
  data["ID"] = randomID;
  return data;
}

function addTaskToBoard(taskData) {
  saveToLocalStorage(taskData);
  displayTasksInStorage();
}

function displayTaskOnBoard(taskData) {
  const taskCard = createTaskCard(taskData);
  taskBoard.appendChild(taskCard);
}

function saveToLocalStorage(taskData) {
  taskList.push(taskData);
  sortTaskListByDate();
  const listString = JSON.stringify(taskList);
  window.localStorage.setItem("list", listString);
}

function createTaskCard(taskData) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("task-card", "custom-text");
  const date = taskData.taskDate;
  const dateFragments = date.split("-");
  taskCard.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16">
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
    </svg>
    <p class="task-content">${taskData.taskContent}</p>
    <p class="custom-text-sm">${dateFragments[2]}/${dateFragments[1]}/${dateFragments[0]}</p>
    <p class="custom-text-sm">${taskData.taskTime}</p>`;
  taskCard.id = `Task-${taskData.ID}`;

  const deleteButton = taskCard.firstElementChild;
  deleteButton.addEventListener("click", () => removeTask(taskData));
  return taskCard;
}

function sortTaskListByDate() {
  taskList.sort(function (taskA, taskB) {
    //sort by date first...
    if (taskA.taskDate < taskB.taskDate) {
      return -1;
    }
    if (taskA.taskDate > taskB.taskDate) {
      return 1;
    }
    
    //then by time
    if (taskA.taskTime < taskB.taskTime) {
      return -1;
    }
    if (taskA.taskTime > taskB.taskTime) {
      return 1;
    }
    return 0;
  });
}

function removeTask(taskData) {
  //find both html element and task data
  const indexToRemove = findTaskByID(taskData.ID);
  const taskCardToRemove = findCardByID(taskData.ID);

  //remove both data and the html card
  taskList.splice(indexToRemove, 1);
  taskBoard.removeChild(taskCardToRemove);

  //save to local storage
  const listString = JSON.stringify(taskList);
  window.localStorage.setItem("list", listString);
}

function findTaskByID(taskID) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].ID == taskID) {
      return i;
    }
  }
}

function findCardByID(taskID) {
  return document.querySelector(`#Task-${taskID}`);
}

function loadTaskList() {
  const itemListString = window.localStorage.getItem("list");
  if (itemListString) {
    const taskListParse = JSON.parse(itemListString);
    return taskListParse;
  }
  return [];
}

function displayTasksInStorage() {
  taskBoard.innerHTML = "";
  taskList.forEach(function (value) {
    displayTaskOnBoard(value);
  });
}
