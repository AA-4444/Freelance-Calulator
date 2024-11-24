let phaseCount = 0;

window.onload = function () {
  loadProjectData();
  showSection("calculator");
  loadProjectList();
  window.addEventListener("scroll", handleScroll); 
};


function handleScroll() {
  const topbar = document.querySelector(".topbar");

  
  if (!topbar) {
    console.error("Top bar element not found. Please check the selector.");
    return;
  }

  //MARK: Apply or remove shadow based on scroll position
  if (window.scrollY > 0) {
    topbar.classList.add("scrolled");
  } else {
    topbar.classList.remove("scrolled");
  }
}


function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show-sidebar");
}


function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".main-content > section").forEach((section) => {
    section.style.display = "none";
  });

 
  document.getElementById(sectionId).style.display = "block";

  
  const sidebar = document.getElementById("sidebar");
  if (sidebar.classList.contains("show-sidebar")) {
    sidebar.classList.remove("show-sidebar");

   
    document.querySelector(".menu-btn").classList.remove("opened");
  }
}


function handleLogin() {
  const loginButton = document.querySelector(".login-btn button");
  loginButton.textContent =
    loginButton.textContent === "Login" ? "Logout" : "Login";
}

// new project phase
function addPhase(name = "", complexity = 1, tasks = [], notes = "") {
  phaseCount++;
  const phaseContainer = document.getElementById("phases-container");
  const phaseHTML = `
        <div class="form-group" id="phase-${phaseCount}">
            <label>Phase ${phaseCount} - Name:</label>
            <input type="text" id="phaseName-${phaseCount}" placeholder="Phase Name" value="${name}" required>
            <label>Complexity:</label>
            <select class="custom-select" id="complexityLevel-${phaseCount}">
                <option value="1" ${complexity == 1 ? "selected" : ""}>Low</option>
                <option value="1.5" ${complexity == 1.5 ? "selected" : ""}>Medium</option>
                <option value="2" ${complexity == 2 ? "selected" : ""}>High</option>
            </select>
            <div id="tasks-container-${phaseCount}"></div>
            <button type="button" onclick="addTask(${phaseCount})">Add Task</button>
            <button type="button" onclick="removePhase(${phaseCount})">Remove Phase</button>
            <label class="Phase-Notes-Text">Phase Notes:</label>
            <textarea id="phaseNotes-${phaseCount}" placeholder="Notes for this phase...">${notes}</textarea>
        </div>`;

  phaseContainer.insertAdjacentHTML("beforeend", phaseHTML);

  // Load saved tasks
  tasks.forEach((task) => {
    addTask(phaseCount, task.type, task.rate, task.hours);
  });
}

// Remove a phase
function removePhase(id) {
  document.getElementById(`phase-${id}`).remove();
}


function addTask(phaseId, type = "Design", rate = "", hours = "") {
  const taskContainer = document.getElementById(`tasks-container-${phaseId}`);
  const taskId = `${phaseId}-${new Date().getTime()}`; // unique identifier
  const taskHTML = `
        <div class="form-group" id="task-${taskId}">
            <label class="Task-Type-Text">Task Type:</label>
            <select class="select-tasktype" id="taskType-${taskId}" onchange="suggestRate('${taskId}')">
                <option value="Design" ${type === "Design" ? "selected" : ""}>Design</option>
                <option value="Frontend Development" ${type === "Frontend Development" ? "selected" : ""}>Frontend Development</option>
                <option value="Backend Development" ${type === "Backend Development" ? "selected" : ""}>Backend Development</option>
                <option value="Testing" ${type === "Testing" ? "selected" : ""}>Testing</option>
                <option value="Client Improvements" ${type === "Client Improvements" ? "selected" : ""}>Client Improvements</option>
            </select>
            <input type="number" id="taskRate-${taskId}" placeholder="Hourly Rate" value="${rate}" required>
            <input type="number" id="taskHours-${taskId}" placeholder="Hours" value="${hours}" required>
            <button type="button" onclick="removeTask('${taskId}')">Remove Task</button>
        </div>`;
  taskContainer.insertAdjacentHTML("beforeend", taskHTML);
  suggestRate(taskId); // Automatically suggest rate when adding task
}

// Remove task
function removeTask(taskId) {
  document.getElementById(`task-${taskId}`).remove();
}


function suggestRate(taskId) {
  const taskType = document.getElementById(`taskType-${taskId}`).value;
  const rateInput = document.getElementById(`taskRate-${taskId}`);
  let suggestedRate;

  switch (taskType) {
    case "Design":
      suggestedRate = 50;
      break;
    case "Frontend Development":
      suggestedRate = 40;
      break;
    case "Backend Development":
      suggestedRate = 60;
      break;
    case "Testing":
      suggestedRate = 35;
      break;
    case "Client Improvements":
      suggestedRate = 45;
      break;
    default:
      suggestedRate = 0;
  }

  rateInput.value = suggestedRate;
}

// total cost
function calculateCost() {
  const projectName = document.getElementById("projectName").value;
  const projectDescription =
    document.getElementById("projectDescription").value;

  if (!projectName || !projectDescription) {
    alert("Please enter both project name and description.");
    return;
  }

  const profitMargin =
    parseFloat(document.getElementById("profitMargin").value) || 0;
  const taxRate = parseFloat(document.getElementById("taxRate").value) || 0;

  let totalCost = 0;
  let costBreakdown = "Cost Breakdown:\n";

  const phases = document.querySelectorAll("#phases-container > .form-group");

  phases.forEach((phase, index) => {
    const phaseName = phase.querySelector(`input[id^="phaseName-"]`).value;
    const complexity = parseFloat(
      phase.querySelector(`select[id^="complexityLevel-"]`).value,
    );
    const tasks = phase.querySelectorAll(`div[id^="task-"]`);

    let phaseCost = 0;
    let phaseBreakdown = `Phase ${index + 1} (${phaseName}):\n`;

    tasks.forEach((task) => {
      const taskType = task.querySelector(`select[id^="taskType-"]`).value;
      const taskRate =
        parseFloat(task.querySelector(`input[id^="taskRate-"]`).value) || 0;
      const taskHours =
        parseFloat(task.querySelector(`input[id^="taskHours-"]`).value) || 0;

      const taskCost = taskRate * taskHours * complexity;
      phaseCost += taskCost;
      phaseBreakdown += `  - ${taskType}: $${taskCost.toFixed(2)}\n`;
    });

    costBreakdown += phaseBreakdown;
    totalCost += phaseCost;
  });

  totalCost += totalCost * (profitMargin / 100) + totalCost * (taxRate / 100);

  document.getElementById("projectSummary").innerText =
    `Project Name: ${projectName}\nDescription: ${projectDescription}`;
  document.getElementById("costBreakdown").innerText = costBreakdown;
  document.getElementById("totalCost").innerText = `$${totalCost.toFixed(2)}`;
}

// Save current project data
function saveCurrentProject() {
  const projectName = document.getElementById("projectName").value;
  if (!projectName) {
    alert("Please enter a project name to save.");
    return;
  }

  const projectData = {
    name: projectName,
    description: document.getElementById("projectDescription").value,
    profitMargin: document.getElementById("profitMargin").value,
    taxRate: document.getElementById("taxRate").value,
    phases: getPhasesData(),
    notes: document.getElementById("generalProjectNotes").value,
  };

  localStorage.setItem(`project_${projectName}`, JSON.stringify(projectData));
  alert("Project saved successfully!");
  loadProjectList(); // Refresh project list
}


function getPhasesData() {
  const phases = [];
  document
    .querySelectorAll("#phases-container > .form-group")
    .forEach((phase) => {
      const phaseData = {
        name: phase.querySelector(`input[id^="phaseName-"]`).value,
        complexity: phase.querySelector(`select[id^="complexityLevel-"]`).value,
        notes: phase.querySelector(`textarea[id^="phaseNotes-"]`).value,
        tasks: [],
      };

      phase.querySelectorAll(`div[id^="task-"]`).forEach((task) => {
        const taskData = {
          type: task.querySelector(`select[id^="taskType-"]`).value,
          rate: task.querySelector(`input[id^="taskRate-"]`).value,
          hours: task.querySelector(`input[id^="taskHours-"]`).value,
        };
        phaseData.tasks.push(taskData);
      });

      phases.push(phaseData);
    });
  return phases;
}

// selected project data
function loadSelectedProject() {
  const projectName = document.getElementById("projectSelector").value;
  if (!projectName) {
    alert("Please select a project to load.");
    return;
  }

  const projectData = JSON.parse(
    localStorage.getItem(`project_${projectName}`),
  );
  if (projectData) {
    document.getElementById("projectName").value = projectData.name;
    document.getElementById("projectDescription").value =
      projectData.description;
    document.getElementById("profitMargin").value = projectData.profitMargin;
    document.getElementById("taxRate").value = projectData.taxRate;
    document.getElementById("phases-container").innerHTML = "";
    projectData.phases.forEach((phase) =>
      addPhase(phase.name, phase.complexity, phase.tasks, phase.notes),
    );
    document.getElementById("generalProjectNotes").value = projectData.notes;
  }
}

//  saved project details
function viewProject() {
  const projectName = document.getElementById("projectSelector").value;
  if (!projectName) {
    alert("Please select a project to view.");
    return;
  }

  const projectData = JSON.parse(
    localStorage.getItem(`project_${projectName}`),
  );
  if (!projectData) {
    alert("Project not found.");
    return;
  }

  // project details
  document.getElementById("detailProjectName").textContent = projectData.name;
  document.getElementById("detailProjectDescription").textContent =
    projectData.description;
  document.getElementById("detailProfitMargin").textContent =
    projectData.profitMargin;
  document.getElementById("detailTaxRate").textContent = projectData.taxRate;

  const phasesContainer = document.getElementById("detailPhases");
  phasesContainer.innerHTML = ""; // Clear previous content

  let totalCost = 0;
  projectData.phases.forEach((phase, index) => {
    const phaseDiv = document.createElement("div");
    phaseDiv.innerHTML = `<h3>Phase ${index + 1}: ${phase.name}</h3>
                          <p>Complexity: ${phase.complexity}</p>
                          <p>Notes: ${phase.notes}</p>
                          <p>Tasks:</p>`;
    let phaseCost = 0;

    phase.tasks.forEach((task) => {
      const taskCost = task.rate * task.hours * phase.complexity;
      phaseCost += taskCost;
      phaseDiv.innerHTML += `<p> - ${task.type}: $${taskCost.toFixed(
        2,
      )} (${task.rate}/hr, ${task.hours} hrs)</p>`;
    });

    totalCost += phaseCost;
    phaseDiv.innerHTML += `<p><strong>Phase Cost:</strong> $${phaseCost.toFixed(
      2,
    )}</p>`;
    phasesContainer.appendChild(phaseDiv);
  });

  totalCost += totalCost * (projectData.profitMargin / 100);
  totalCost += totalCost * (projectData.taxRate / 100);

  document.getElementById("detailTotalCost").textContent = totalCost.toFixed(2);

  // Show project details
  document.getElementById("projectDetails").style.display = "block";
}

// Close project details view
function closeProjectDetails() {
  document.getElementById("projectDetails").style.display = "none";
}

// Load project list from localStorage
function loadProjectList() {
  const projectSelector = document.getElementById("projectSelector");
  projectSelector.innerHTML = `<option value="">-- Select Project --</option>`;
  for (const key in localStorage) {
    if (key.startsWith("project_")) {
      const projectName = key.replace("project_", "");
      const option = document.createElement("option");
      option.value = projectName;
      option.textContent = projectName;
      projectSelector.appendChild(option);
    }
  }
}

// Delete selected project
function deleteProject() {
  const projectName = document.getElementById("projectSelector").value;
  if (!projectName) {
    alert("Please select a project to delete.");
    return;
  }
  if (confirm(`Are you sure you want to delete project "${projectName}"?`)) {
    localStorage.removeItem(`project_${projectName}`);
    alert("Project deleted successfully.");
    loadProjectList(); // Refresh project list
  }
}

document.getElementById("theme-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  // Optional: If you want to change the icon when clicking
  const sunIcon = document.querySelector(".sun-icon");
  const crescentIcon = document.querySelector(".crescent-icon");

  if (document.body.classList.contains("dark-mode")) {
    sunIcon.style.opacity = "0";
    crescentIcon.style.opacity = "1";
  } else {
    sunIcon.style.opacity = "1";
    crescentIcon.style.opacity = "0";
  }
});

function openSettings() {
  const settingsPanel = document.getElementById("settingsPanel");
  settingsPanel.classList.add("open");
}

function closeSettings() {
  const settingsPanel = document.getElementById("settingsPanel");
  settingsPanel.classList.remove("open");
}
