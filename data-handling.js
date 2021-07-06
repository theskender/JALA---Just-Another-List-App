'use-strict';

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

// Probably add an else if to trigger a similar but different function to save when editing projects
function saveProject() {
  let projectName = document.querySelector('#projectName').value;
  if (!projectName == '') {
    // Info from LS query, needed to update ID counter for projects
    let serviceObj = JSON.parse(localStorage.getItem('service'));
    // Info from LS query, whole projects 'database'
    let projects = JSON.parse(localStorage.getItem('projects'));
    // Object for use within function, contains all data from modal
    let project = {};
    project.projectName = projectName;
    project.notes = document.querySelector('#notes').value;
    project.tasks = [];
    // hard part: list items to get text and priority labels
    const tasks = Array.from(
      document.querySelectorAll(
        '#new-project-modal__tasks-container .modal__task'
      )
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

    //// Update projects object in LS, create task card on FE with same id
    // Case: saving new project
    if (activeTaskCardId == '') {
      // store project to LS
      projects[`pro${serviceObj.projectsIdCounter}`] = project;
      localStorage.setItem('projects', JSON.stringify(projects));
      // Create new Task Card in FE
      createTaskCard(project, serviceObj);
      // Update project counter in LS
      serviceObj.projectsIdCounter++;
      localStorage.setItem('service', JSON.stringify(serviceObj));
    }
    // Case: updating existing project
    else if (activeTaskCardId !== '') {
      // update project in LS
      projects[`${activeTaskCardId}`] = project;
      localStorage.setItem('projects', JSON.stringify(projects));
      // update task card on FE
      const taskCardHeading = document.querySelector(
        `#${activeTaskCardId} .task-card__header`
      );
      const taskCardFill = document.querySelector(
        `#${activeTaskCardId} .progress-bar-fill`
      );
      taskCardHeading.textContent = project.projectName;

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

      taskCardFill.style.width = `${progressBarWidth}%`;
      taskCardFill.style.backgroundColor = `${progressBarColor}`;
    }

    closeModal();
    cardDeleteListeners();
    addMainListeners();
  } else alert('Ime projekta je obvezno polje!');
}

// separate for day and project if necessary for now, then se how to make universal
// see if it has to be nested in saveProject() - for variable contexts etc, or can be separate function triggered by saveProject
// see if id from LS object can be passed as argument into function
////// MAIN CANDIDATE FOR REACT REVAMP ///////
// For now this is version for task-card-project
function createTaskCard(project, serviceObj = {}, lblOverride) {
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
  taskCard.id =
    Object.keys(serviceObj).length !== 0
      ? `pro${serviceObj.projectsIdCounter}`
      : `${lblOverride}`;
  taskCardCloseContainer.classList.add('task-card__delete-container');
  taskCardClose.classList.add('fa', 'fa-times', 'task-card__delete');
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
}

function saveDay() {
  console.log('Day has been saved!');
}

// Large loop function which renders all task cards from LS. Use only on init!!
// Works only on projects for now, apply days after implementing them!!
function renderTaskCards() {
  const projectCardsContainer = document.querySelector('#projects-container');
  projectCardsContainer.innerHTML = '';

  const projectCardsData = JSON.parse(localStorage.getItem('projects'));

  // Go through each object key and createFE elements accordinlgy
  const entries = Object.entries(projectCardsData);
  for (const [key, value] of entries) {
    createTaskCard(value, undefined, key);
  }
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

// limited to header for now, will be much bigger when cards are implemented - has to populate all cards from LS
function loadFE() {
  const userDataObj = JSON.parse(localStorage.getItem('userData'));
  if (userDataObj) {
    document.querySelector('.header-user-pic').src = userDataObj.profilePicUrl;
  }
  if (userDataObj) {
    document.querySelector('.header-user-name').textContent =
      userDataObj.firstName;
  }
  addModalCloseListeners();
  cardDeleteListeners();
  addMainListeners();
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

function loadProjectData(id) {
  let loadedProject = {};
  loadedProjects = JSON.parse(localStorage.getItem('projects'));
  loadedProject = loadedProjects[id];
  return loadedProject;
}
