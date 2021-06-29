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

// State variables
let labelIdCounter =
  document.querySelector('.label-container').childElementCount ?? 0;
let currentModal;
let currentModalPrefix = '';

// Loading animation runs, comment out during development (takes 2s on reload)
// init();
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
// - save changes
adminSaveBtn.addEventListener('click', saveAdmin);

// - neProject modal
document
  .querySelector('.new-project')
  .addEventListener('click', showNewProject);

// newDay modal
document.querySelector('.new-day').addEventListener('click', showNewDay);

// editProject modal
taskCardsProjects = document.querySelectorAll(
  '.task-card__progress-bar-container'
);
for (let i = 0; i < taskCardsProjects.length; i++) {
  taskCardsProjects[i].addEventListener('click', showEditProject);
}

// editDay modal
taskCardsDays = document.querySelectorAll(
  '.task-card__tasks-preview-container'
);
for (let i = 0; i < taskCardsDays.length; i++) {
  taskCardsDays[i].addEventListener('click', showEditDay);
}

// Card delete buttons from main screen
let cardDeleteBtns = document.querySelectorAll('.task-card__close');
for (let i = 0; i < cardDeleteBtns.length; i++) {
  cardDeleteBtns[i].addEventListener('click', deleteTaskCard);
}

// - reset app button
document.getElementById('reset-all-btn').addEventListener('click', resetApp);

// - add task
addTaskBtn.addEventListener('click', addTask);

// - remove task
document
  .querySelector('.modal__tasks-container')
  .addEventListener('click', removeTask);

///////////////// Event functions /////////////////
function init() {
  overlay.classList.remove('hidden');
  loadingSpinner.classList.remove('hidden');
  setTimeout(function () {
    overlay.classList.add('hidden');
    loadingSpinner.classList.add('hidden');
  }, 2000);
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
  loadNewProject();
}

function showNewDay() {
  currentModal = newDayModal;
  currentModalPrefix = 'new-day-modal';
  newDayModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function showEditProject() {
  currentModal = editProjectModal;
  currentModalPrefix = 'edit-project-modal';
  editProjectModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function showEditDay() {
  currentModal = editDayModal;
  currentModalPrefix = 'edit-day-modal';
  editDayModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
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

  document
    .querySelector('#admin-modal__label-container')
    .removeEventListener('click', deleteLabel);
  document
    .querySelector('#add-lbl-btn')
    .removeEventListener('click', createLabel);
}

function createLabel() {
  let color = document.querySelector('.color-picker').value;
  let text = document.querySelector('#labelName').value;
  if (text) {
    const element = document.createElement('DIV');
    element.classList.add('priority-label');
    element.style.backgroundColor = color;
    labelIdCounter++;
    element.id = `lbl${labelIdCounter}`;
    let textNode = document.createTextNode(text);
    element.appendChild(textNode);
    document.querySelector('.label-container').appendChild(element);
    document.querySelector('#labelName').value = '';
  }
}

// Event bubbling - make sure clicking on empty container area doesn't delete container
function deleteLabel(e) {
  if (!e.target.classList.contains('label-container')) e.target.remove();
}

// Refresh function needs to be called here when implemented
function resetApp() {
  let decision = confirm('Jeste li sigurni?');
  if (decision == true) {
    localStorage.clear();
    alert('Baza očišćena!');
    closeModal();
    resetFE();
  }
}

// Create new task --- TO REVAMP IN REACT
function addTask() {
  let taskText = document.querySelector('#tasktext').value;
  if (taskText) {
    const element = document.createElement('LI');
    const xBtn = document.createElement('SPAN');
    const lblCont = document.createElement('DIV');
    element.classList.add('modal__task');
    xBtn.classList.add('remove-task');
    lblCont.classList.add('.label-container');
    let textNode = document.createTextNode(taskText);
    let xBtnText = document.createTextNode('x');
    xBtn.appendChild(xBtnText);
    element.appendChild(textNode);
    element.appendChild(lblCont);
    element.appendChild(xBtn);
    element.onclick = function () {
      this.classList.toggle('checked');
    };
    document.querySelector('.modal__tasks-container').appendChild(element);
    document.querySelector('#tasktext').value = '';
  }
}

// Remove this task
function removeTask(e) {
  const classes = e.target.classList;
  if (classes.contains('remove-task')) e.target.parentNode.remove();
}

// Very important later, reloads cards on main screen after any save/edit/delete all function has been triggered --- potentially will be replaced with methods since cards will become react elements
function refreshMainScreen() {}

// Placeholder function, needs to recognize task card clicked on - check previously used functions for deleting parent nodes (might be 2 levels up)
function deleteTaskCard() {
  console.log('Deleted!');
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
  // store to LS
  let userDataObj = {};
  userDataObj = Object.fromEntries(workMap);
  userDataObj.priorityLabels = labelArr;
  localStorage.setItem('userData', JSON.stringify(userDataObj));
  // Change FE elements
  loadFE();
  closeModal();
}

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
