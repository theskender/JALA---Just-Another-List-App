'use strict';

// Save re-usable elements to variables
let modalCloseBtns;
let taskCardsProjects;
let taskCardsDays;
const addTaskBtn = document.querySelector('#add-task-btn');
const overlay = document.querySelector('.overlay');
const loadingSpinner = document.querySelector('.loading-spinner');
const adminModal = document.querySelector('.admin-modal');
const newProjectModal = document.querySelector('.new-project-modal');
const editProjectModal = document.querySelector('.edit-project-modal');
const newDayModal = document.querySelector('.new-day-modal');
const editDayModal = document.querySelector('.edit-day-modal');
const projectCancelBtn = document.querySelector('#project-cancel-btn');
const adminCancelBtn = document.querySelector('#admin-cancel-btn');
const adminSaveBtn = document.querySelector('#admin-save-btn');
const projectSaveBtn = document.querySelector('#project-save-btn');

// State variables
let currentModal;
let currentModalPrefix = '';

// Loading animation runs, comment out during development (takes 2s on reload)
init();
loadFE();

///////////////// Add event handlers /////////////////
// admin modal
document.querySelector('.header-user-pic').addEventListener('click', showAdmin);
// - 4 ways of closing the modals - need to be tweaked when other modals are added - see how to re-use general modal closing function for all modals
overlay.addEventListener('click', closeModal);

modalCloseBtns = document.querySelectorAll('.modal__close');
for (let i = 0; i < modalCloseBtns.length; i++) {
  modalCloseBtns[i].addEventListener('click', closeModal);
}

adminCancelBtn.addEventListener('click', closeModal);
projectCancelBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  e.preventDefault;
  if (e.key === 'Escape') {
    closeModal();
  }
});
// - save changes admin
adminSaveBtn.addEventListener('click', saveAdmin);

// - newProject modal
document
  .querySelector('.new-project')
  .addEventListener('click', showNewProject);

// newDay modal
document.querySelector('.new-day').addEventListener('click', showNewDay);

// editProject modal
function projectCardListener() {
  taskCardsProjects = document.querySelectorAll(
    '.task-card__progress-bar-container'
  );
  for (let i = 0; i < taskCardsProjects.length; i++) {
    taskCardsProjects[i].addEventListener('click', showEditProject);
  }
}
projectCardListener();

// editDay modal
function dayCardListener() {
  taskCardsDays = document.querySelectorAll(
    '.task-card__tasks-preview-container'
  );
  for (let i = 0; i < taskCardsDays.length; i++) {
    taskCardsDays[i].addEventListener('click', showEditDay);
  }
}
dayCardListener();

// Card delete buttons from main screen
function cardDeleteListener() {}
let cardDeleteBtns = document.querySelectorAll('.task-card__close');
for (let i = 0; i < cardDeleteBtns.length; i++) {
  cardDeleteBtns[i].addEventListener('click', deleteTaskCard);
}

// - reset app button
document.getElementById('reset-all-btn').addEventListener('click', resetApp);

// - add task
addTaskBtn.addEventListener('click', addTask);
document
  .querySelector('#add-task-btn-edit-pro')
  .addEventListener('click', addTask);

// - remove task
document
  .querySelector('.modal__tasks-container')
  .addEventListener('click', removeTask);

///////////////// Event functions /////////////////
function init() {
  // loading animation - fixed time, can be tied to data loading from server request
  // overlay.classList.remove('hidden');
  // loadingSpinner.classList.remove('hidden');
  // setTimeout(function () {
  //   overlay.classList.add('hidden');
  //   loadingSpinner.classList.add('hidden');
  // }, 2000);
  // initialize service data object from LS
  let service = {
    labelIdCounter: 0,
    projectsIdCounter: 0,
    daysIdCounter: 0,
  };
  let projects = {};
  let days = {};
  if (localStorage.getItem('service') === null) {
    localStorage.setItem('service', JSON.stringify(service));
  }
  if (localStorage.getItem('projects') === null) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }
  if (localStorage.getItem('days') === null) {
    localStorage.setItem('days', JSON.stringify(days));
  }
  cardDeleteListeners();
}

function showAdmin() {
  currentModal = adminModal;
  currentModalPrefix = 'admin-modal';
  adminModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  loadAdmin();
  document
    .querySelector('#admin-modal__label-container')
    .addEventListener('click', deleteLabel);
  document.querySelector('#add-lbl-btn').addEventListener('click', createLabel);
}

function showNewProject() {
  currentModal = newProjectModal;
  currentModalPrefix = 'new-project-modal';
  newProjectModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document
    .querySelector('#new-project-modal__label-container')
    .addEventListener('click', pickTaskLabel);
  // - save new project
  projectSaveBtn.addEventListener('click', saveProject);
  loadNewProject();
}

function showNewDay() {
  currentModal = newDayModal;
  currentModalPrefix = 'new-day-modal';
  newDayModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  loadNewDay();
}

function showEditProject() {
  currentModal = editProjectModal;
  currentModalPrefix = 'edit-project-modal';
  editProjectModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  loadEditProject();
}

function showEditDay() {
  currentModal = editDayModal;
  currentModalPrefix = 'edit-day-modal';
  editDayModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  loadEditDay();
}

// Labels in label container need to be cleared, needs to be added to this function as they're not part of form and not affected by reset()
function closeModal() {
  currentModal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.getElementById('admin').reset();
  document.getElementById('newprojectname').reset();
  document.getElementById('taskinput').reset();
  document.getElementById('tasks').reset();
  const labelContainerSelector = `#${currentModalPrefix}__label-container`;
  const labelContainer = document.querySelector(labelContainerSelector);
  labelContainer.innerHTML = '';
  // currentModal = undefined;
  currentModalPrefix = '';
  // remove unnecessary event listeners for closed modals
  document
    .querySelector('#admin-modal__label-container')
    .removeEventListener('click', deleteLabel);
  document
    .querySelector('#add-lbl-btn')
    .removeEventListener('click', createLabel);
  document
    .querySelector('#new-project-modal__label-container')
    .removeEventListener('click', pickTaskLabel);
  projectSaveBtn.removeEventListener('click', saveProject);
}

function createLabel() {
  let color = document.querySelector('.color-picker').value;
  let text = document.querySelector('#labelName').value;
  if (text) {
    let serviceObj = JSON.parse(localStorage.getItem('service'));
    const element = document.createElement('DIV');
    element.classList.add('priority-label');
    element.style.backgroundColor = color;
    serviceObj.labelIdCounter++;
    element.id = `lbl${serviceObj.labelIdCounter}`;
    const textNode = document.createTextNode(text);
    element.appendChild(textNode);
    document.querySelector('.label-container').appendChild(element);
    document.querySelector('#labelName').value = '';
    localStorage.setItem('service', JSON.stringify(serviceObj));
  }
}

// Event bubbling - make sure clicking on empty container area doesn't delete container
function deleteLabel(e) {
  if (!e.target.classList.contains('label-container')) {
    e.target.remove();
  }
}

function pickTaskLabel(e) {
  if (e.target.classList.contains('priority-label'))
    e.target.classList.toggle('picked-label');
}

// Refresh function needs to be called here when implemented
function resetApp() {
  let decision = confirm('Jeste li sigurni?');
  if (decision == true) {
    localStorage.clear();
    alert('Baza očišćena!');
    closeModal();
    resetFE();
    init();
  }
}

// Create new task --- TO REVAMP IN REACT
function addTask() {
  let taskText = document.querySelector('#taskText').value;
  if (taskText) {
    const element = document.createElement('LI');
    const xBtn = document.createElement('SPAN');
    const lblContainer = document.createElement('DIV');
    element.classList.add('modal__task');
    xBtn.classList.add('remove-task');
    lblContainer.classList.add('label-container');
    let textNode = document.createTextNode(taskText);
    let xBtnText = document.createTextNode('x');
    xBtn.appendChild(xBtnText);
    element.appendChild(textNode);
    element.appendChild(lblContainer);
    element.appendChild(xBtn);
    element.onclick = function () {
      this.classList.toggle('checked');
    };
    // pick lbls for new task
    let pickLblContainer = document.querySelector(
      '#new-project-modal__label-container'
    );
    let lbls = pickLblContainer.childNodes;
    for (const lbl of lbls) {
      if (lbl.classList.contains('picked-label')) {
        let lblClone = lbl.cloneNode(true);
        lblContainer.appendChild(lblClone);
        lbl.classList.remove('picked-label');
        lblClone.classList.remove('picked-label');
      }
    }
    // Create task and reset form
    document.querySelector('.modal__tasks-container').appendChild(element);
    document.querySelector('#taskText').value = '';
  }
}

// Remove this task
function removeTask(e) {
  const classes = e.target.classList;
  if (classes.contains('remove-task')) e.target.parentNode.remove();
}

// Adds listeners to delete buttons for task cards on init and on refresh
function cardDeleteListeners() {
  let closeBtns = document.querySelectorAll('.task-card__close');
  for (let i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener('click', deleteTaskCard);
  }
}

// Needs LS part of function when LS is implemented - fetch and delete project/day with same id as task card
function deleteTaskCard(e) {
  e.target.parentNode.parentNode.classList.add('task-card-deletion');
  setTimeout(function () {
    e.target.parentNode.parentNode.remove();
  }, 400);
}

/////////////////////////// Data handling ///////////////////////////
/////// Saving data from forms in modals to LS
/// - save user data and labels from admin form
function saveAdmin() {
  const userInput = Array.from(document.querySelectorAll('#admin input'));
  let workMap = new Map();
  for (const [index, formItem] of userInput.entries()) {
    if (formItem.value == '') formItem.value = '-';
    workMap.set(formItem.id, formItem.value);
  }
  // remove values not stored directly in base
  workMap.delete('labelColor');
  workMap.delete('labelName');
  // Get inputed labels
  let userLabels = Array.from(
    document.querySelectorAll('#admin-modal__label-container .priority-label')
  );
  let labelArr = [];
  for (const [index, label] of userLabels.entries()) {
    labelArr.push({
      id: label.id,
      text: label.textContent,
      color: label.style.backgroundColor,
    });
  }
  // store admin data to LS
  let userDataObj = {};
  userDataObj = Object.fromEntries(workMap);
  userDataObj.priorityLabels = labelArr;
  localStorage.setItem('userData', JSON.stringify(userDataObj));
  // Change FE elements
  loadFE();
  closeModal();
}

function saveProject() {
  let projectName = document.querySelector('#projectName').value;
  if (!projectName == '') {
    let serviceObj = JSON.parse(localStorage.getItem('service'));
    let projects = JSON.parse(localStorage.getItem('projects'));
    let project = {};
    project.projectName = projectName;
    project.notes = document.querySelector('#notes').value;
    project.tasks = [];
    // hard part: list items to get text and priority labels
    const tasks = Array.from(
      document.querySelectorAll('#new-project__tasks-container .modal__task')
    );
    for (const [index, content] of tasks.entries()) {
      let labelIds = [];
      let labels = content.querySelectorAll('.label-container .priority-label');
      for (const label of labels) {
        labelIds.push(label.id);
      }
      project.tasks.push({
        text: content.innerHTML.substr(0, content.innerHTML.indexOf('<')),
        priorityLabels: labelIds,
        checked: `${content.classList.contains('checked') ? true : false}`,
      });
    }

    // Update projects object in LS, create task card on FE with same id
    projects[`pro${serviceObj.projectsIdCounter}`] = project;
    localStorage.setItem('projects', JSON.stringify(projects));
    createTaskCard(project, serviceObj);
    // Update project counter in LS
    serviceObj.projectsIdCounter++;
    localStorage.setItem('service', JSON.stringify(serviceObj));

    closeModal();
    cardDeleteListeners();
  } else alert('Ime projekta je obvezno polje!');
}

// separate for day and project if necessary for now, then se how to make universal
// see if it has to be nested in saveProject() - for variable contexts etc, or can be separate function triggered by saveProject
// see if id from LS object can be passed as argument into function
////// MAIN CANDIDATE FOR REACT REVAMP ///////
// For now this is version for task-card-project
function createTaskCard(project, serviceObj) {
  // create elements
  const taskCard = document.createElement('DIV');
  const taskCardCloseContainer = document.createElement('DIV');
  const taskCardClose = document.createElement('I');
  const progressBarContainer = document.createElement('DIV');
  const progressBar = document.createElement('DIV');
  const progressBarFill = document.createElement('DIV');
  const taskCardHeader = document.createElement('H3');
  const textNode = document.createTextNode(`${project.projectName}`);
  let progressBarWidth = 0;
  let progressBarColor = '';
  function calcProgressWidth() {
    let totalTasks = project.tasks.length;
    let checked = 0;
    for (const task of project.tasks) {
      if (task.checked == 'true') {
        checked++;
      }
    }
    let checkedTasks = checked;

    progressBarWidth = (checkedTasks / totalTasks).toFixed(2) * 100;
  }
  function calcProgressColor() {
    if (progressBarWidth < 33) progressBarColor = 'red';
    else if (progressBarWidth >= 33 && progressBarWidth < 67)
      progressBarColor = 'yellow';
    else if (progressBarWidth >= 67) progressBarColor = 'green';
  }
  calcProgressWidth();
  calcProgressColor();

  // add css classes and attributes to elements
  taskCard.classList.add('task-card', 'task-card-project');
  taskCard.id = `pro${serviceObj.projectsIdCounter}`;
  taskCardCloseContainer.classList.add('task-card__close-container');
  taskCardClose.classList.add('fa', 'fa-times', 'task-card__close');
  taskCardClose.setAttribute('aria-hidden', 'true');
  taskCardHeader.classList.add('task-card__header', 'project-header');
  progressBarContainer.classList.add('task-card__progress-bar-container');
  progressBar.classList.add('progress-bar');
  progressBarFill.classList.add('progress-bar-fill');
  // PB needs to change dynamically based on % of items checked and name of object

  progressBarFill.style.width = `${progressBarWidth}%`;
  progressBarFill.style.backgroundColor = `${progressBarColor}`;

  // Appending children and rendering to DOM
  taskCard.appendChild(taskCardCloseContainer);
  taskCardCloseContainer.appendChild(taskCardClose);
  taskCard.appendChild(taskCardHeader);
  taskCardHeader.appendChild(textNode);
  taskCard.appendChild(progressBarContainer);
  progressBarContainer.appendChild(progressBar);
  progressBar.appendChild(progressBarFill);
  progressBarContainer.appendChild(progressBar);

  document.querySelector('#projects-container').appendChild(taskCard);

  cardDeleteListeners();
  projectCardListener();
}

function saveDay() {}

/////// Loading LS data on change || when opening forms
function loadAdmin() {
  const userDataObj = JSON.parse(localStorage.getItem('userData'));
  if (userDataObj) {
    const userDataArr = Object.entries(userDataObj);
    for (const [label, input] of userDataArr) {
      if (label == 'priorityLabels') continue;
      document.getElementById(label).value = input;
    }
    loadLabels();
  }
}

function loadNewProject() {
  loadLabels();
}

function loadEditProject() {}

function loadNewDay() {}

function loadEditDay() {}

// limited to header for now, will be much bigger when cards are implemented
function loadFE() {
  const userDataObj = JSON.parse(localStorage.getItem('userData'));
  if (userDataObj) {
    document.querySelector('.header-user-pic').src = userDataObj.profilePicUrl;
  }
  if (userDataObj) {
    document.querySelector('.header-user-name').textContent =
      userDataObj.firstName;
  }
}

// limited to header for now, will be much bigger when cards are implemented
function resetFE() {
  document.querySelector('.header-user-pic').src = '';
  document.querySelector('.header-user-name').textContent = '';
}

// universal for all modals
function loadLabels() {
  const userDataObj = JSON.parse(localStorage.getItem('userData'));
  const labels = userDataObj.priorityLabels;
  const labelContainerSelector = `#${currentModalPrefix}__label-container`;
  const labelContainer = document.querySelector(labelContainerSelector);
  for (const label of labels) {
    const element = document.createElement('DIV');
    let textNode = document.createTextNode(label.text);
    element.classList.add('priority-label');
    element.style.backgroundColor = label.color;
    element.id = label.id;
    element.appendChild(textNode);
    labelContainer.appendChild(element);
  }
}
