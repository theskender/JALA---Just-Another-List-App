'use strict';

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

  renderTaskCards();
  cardDeleteListeners();
  addMainListeners();
  addModalCloseListeners();
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
  let legend = document.querySelector('#project-legend');
  legend.textContent = 'Novi projekt';
  let heading = document.querySelector('#modal__header-title-project');
  heading.textContent = 'Novi projekt';
  currentModal = newProjectModal;
  currentModalPrefix = 'new-project-modal';
  newProjectModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document
    .querySelector('#new-project-modal__label-container')
    .addEventListener('click', pickTaskLabel);
  // - save new project btn
  projectSaveBtn.addEventListener('click', saveProject);
  loadLabels();
}

function showEditProject() {
  // Shares a modal with showNewProject, overrides elements that need to be loaded from LS/DB
  showNewProject();
  let dataId = this.parentNode.id;
  let projectData = loadProjectData(dataId);
  activeTaskCardId = dataId;

  // different legend and heading than newProject
  let legend = document.querySelector('#project-legend');
  legend.textContent = `${projectData.projectName}`;
  let heading = document.querySelector('#modal__header-title-project');
  heading.textContent = 'Ažuriranje projekta';
  // input fields fill from LS/DB
  document.querySelector('#projectName').value = projectData.projectName;
  document.querySelector('#notes').value = projectData.notes;
  // add and fill tasks with proper labels and colors from LS
  for (const task of projectData.tasks) {
    loadTasks(task.text, task.priorityLabels, task.checked);
  }
}

function showNewDay() {
  currentModal = newDayModal;
  currentModalPrefix = 'new-day-modal';
  newDayModal.classList.remove('hidden');
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
  // Clears FE labels for admin modal
  const labelContainerSelector = `#${currentModalPrefix}__label-container`;
  const labelContainer = document.querySelector(labelContainerSelector);
  // Clears FE labels for other modals
  const tasksContainerSelector = `#${currentModalPrefix}__tasks-container`;
  const taskContainer = document.querySelector(tasksContainerSelector);
  labelContainer.innerHTML = '';
  if (currentModalPrefix !== 'admin-modal') taskContainer.innerHTML = '';
  currentModal = undefined;
  currentModalPrefix = '';
  activeTaskCardId = '';
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
    loadFE();
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

// Meant to be iterated when called
function loadTasks(text, priorityLabels, checked) {
  let userDataObj = JSON.parse(localStorage.getItem('userData'));
  let lblReference = userDataObj.priorityLabels;
  let labels = priorityLabels;

  const element = document.createElement('LI');
  const xBtn = document.createElement('SPAN');
  const lblContainer = document.createElement('DIV');
  element.classList.add('modal__task');
  xBtn.classList.add('remove-task');
  lblContainer.classList.add('label-container');
  let textNode = document.createTextNode(text);
  let xBtnText = document.createTextNode('x');
  xBtn.appendChild(xBtnText);
  element.appendChild(textNode);
  element.appendChild(lblContainer);
  element.appendChild(xBtn);
  element.onclick = function () {
    this.classList.toggle('checked');
  };
  if (checked == 'true') element.classList.add('checked');
  // Add labels to task
  for (const label of labels) {
    const lbl = document.createElement('DIV');
    lbl.classList.add('priority-label');
    for (const ref of lblReference) {
      if (ref.id == label) {
        lbl.id = ref.id;
        lbl.innerHTML = ref.text;
        lbl.style.backgroundColor = ref.color;
        lblContainer.appendChild(lbl);
      }
    }
  }

  document.querySelector('.modal__tasks-container').appendChild(element);
}

// Remove this task
function removeTask(e) {
  const classes = e.target.classList;
  if (classes.contains('remove-task')) e.target.parentNode.remove();
}

// Adds listeners to delete buttons for task cards on init and on refresh
function cardDeleteListeners() {
  let deleteBtns = document.querySelectorAll('.task-card__delete');
  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener('click', deleteTaskCard);
  }
}

// Add main screen listeners for new/edit card/day & admin modal
function addMainListeners() {
  ///// Add FE listeners //////
  // show admin modal on profile pic click
  document
    .querySelector('.header-user-pic')
    .addEventListener('click', showAdmin);
  // - 4 ways of closing the modals
  overlay.addEventListener('click', closeModal);

  adminCancelBtn.addEventListener('click', closeModal);
  projectCancelBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    e.preventDefault;
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // - new-project btn listener
  document
    .querySelector('.new-project')
    .addEventListener('click', showNewProject);

  // - new-day btn listener
  document.querySelector('.new-day').addEventListener('click', showNewDay);

  // - edit project card listener
  let taskCardsProjects = document.querySelectorAll(
    '.task-card__progress-bar-container'
  );
  for (let i = 0; i < taskCardsProjects.length; i++) {
    taskCardsProjects[i].addEventListener('click', showEditProject);
  }

  // edit day card listener
  let taskCardsDays = document.querySelectorAll(
    '.task-card__tasks-preview-container'
  );
  for (let i = 0; i < taskCardsDays.length; i++) {
    taskCardsDays[i].addEventListener('click', showEditDay);
  }
}

// Needs LS part of function when LS is implemented - fetch and delete project/day with same id as task card
function deleteTaskCard(e) {
  let cardId = e.target.parentNode.parentNode.id;
  // Probably to be merged with delete LSDay function, for now just like this.
  deleteLSProject(cardId);

  e.target.parentNode.parentNode.classList.add('task-card-deletion');
  setTimeout(function () {
    e.target.parentNode.parentNode.remove();
  }, 400);
  alert(`Projekt s ID-em: ${cardId.toUpperCase()} uspješno je izbrisan!`);
}

function deleteLSProject(cardId) {
  let projects = JSON.parse(localStorage.getItem('projects'));
  delete projects[cardId];
  localStorage.setItem('projects', JSON.stringify(projects));
}

function addModalCloseListeners() {
  const closeBtns = document.querySelectorAll('.modal__close');
  for (const btn of closeBtns) btn.addEventListener('click', closeModal);
}
