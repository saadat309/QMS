import {
  showModal,
  handleError,
  fetchAgents,
  fetchQueries,
  saveAgent,
  removeAgent,
} from "./utils.js";

const admin = JSON.parse(sessionStorage.getItem("admin"));
let agentsList = [];
let queries = [];
let editId = null;

if (!admin) {
  // Not logged in — kick back to login page
  window.location.href = "/login.html";
} else {
  // ✅ Preload dashboard
  document.getElementById("welcome").textContent = `Welcome, ${admin.email}`;

  loadAgents();

  const queriesData = await fetchQueries();
  queries = queriesData.queries;

  displayQueries(queries);
}

// Query handling

function displayQueries(queries) {
  const tableBody = document.querySelector("#queryTable tbody");
  tableBody.innerHTML = "";

  queries.forEach((query, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${query.agent_name}</td>
                <td>${query.query_text}</td>
                <td>${query.phone || ""}</td>
                <td>${query.additional_info || ""}</td>
                <td>${query.query_date || ""}</td>
                <td>${query.query_time}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${
                      query.id
                    }">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${
                      query.id
                    }">Delete</button>
                </td>
            `;
    tableBody.appendChild(row);
  });

  // if (editId === null) {
  //   scrollToElement(document.getElementById("queryTable"));
  // }

  // Attach event listeners to new buttons

  // document.querySelectorAll(".edit-btn").forEach((btn) => {
  //   btn.addEventListener("click", editQueryHandler);
  // });
  // document.querySelectorAll(".delete-btn").forEach((btn) => {
  //   btn.addEventListener("click", deleteQueryHandler);
  // });
}

// Agents Handling

async function loadAgents() {
  const agentsData = await fetchAgents(admin.id);
  agentsList = agentsData.agents;

  const agents = agentsList.map((agent) => agent.name);
  console.log(agents);
  const filterAgent = document.getElementById("filterAgent");
  const agentSelect = document.getElementById("agent");
  const removeAgentSelect = document.getElementById("removeAgentSelect");

  clearSelect(filterAgent);
  clearSelect(agentSelect);
  clearSelect(removeAgentSelect);

  addOption(filterAgent, "All", "All");
  addOption(agentSelect, "Choose...", "", true);
  addOption(removeAgentSelect, "Choose...", "", true);

  agents.forEach((agent) => {
    addOption(filterAgent, agent, agent);
    addOption(agentSelect, agent, agent);
    addOption(removeAgentSelect, agent, agent);
  });
}

function clearSelect(selectElement) {
  while (selectElement.options.length > 0) {
    selectElement.remove(0);
  }
}

function addOption(selectElement, text, value, selected = false) {
  const option = document.createElement("option");
  option.text = text;
  option.value = value;
  option.selected = selected;
  selectElement.appendChild(option);
}

// Agent management handlers
document.getElementById("addAgent").addEventListener("click", addAgentHandler);
document
  .getElementById("removeAgent")
  .addEventListener("click", removeAgentHandler);

async function addAgentHandler() {
  const agentName = document.getElementById("newAgent").value;
  if (agentName) {
    try {
      await saveAgent(agentName, admin.id);
      document.getElementById("newAgent").value = "";
      loadAgents();
    } catch (err) {
      console.error("Failed to add agent:", err);
      alert("Something went wrong while adding agent.");
    }
  }
}

async function removeAgentHandler() {
  const agentName = document.getElementById("removeAgentSelect").value;
  if (agentName && agentName !== "Choose...") {
    try {
      await removeAgent(agentName, admin.id);
      loadAgents();
    } catch (err) {
      console.error("Failed to remove agent:", err);
      alert("Something went wrong while removing agent.");
    }
  }
}

// filters Management

document.getElementById("applyFilters").addEventListener("click", applyFilters);
document.getElementById("clearFilters").addEventListener("click", clearFilters);

function applyFilters() {
  const agent = document.getElementById("filterAgent").value;
  const startDate = document.getElementById("filterStartDate").value;
  const endDate = document.getElementById("filterEndDate").value;

  let filteredQueries = queries;

  if (agent && agent !== "All") {
    filteredQueries = filteredQueries.filter((q) => q.agent === agent);
  }
  if (startDate) {
    filteredQueries = filteredQueries.filter(
      (q) => new Date(q.date) >= new Date(startDate)
    );
  }
  if (endDate) {
    filteredQueries = filteredQueries.filter(
      (q) => new Date(q.date) <= new Date(endDate)
    );
  }

  displayQueries(filteredQueries);
}

function clearFilters() {
  document.getElementById("filterAgent").value = "All";
  document.getElementById("filterStartDate").value = "";
  document.getElementById("filterEndDate").value = "";
  displayQueries(queries);
}

// document.addEventListener("DOMContentLoaded", function () {
//   let db;
//   let queries = [];
//   let editId = null;
//   const scrollPositionKey = "scrollPosition";

//   request.onsuccess = function (event) {
//     db = event.target.result;
//     loadQueries();
//     loadAgents();
//     restoreScrollPosition();
//   };

//   // Scroll position handling
//   function saveScrollPosition() {
//     sessionStorage.setItem(scrollPositionKey, window.scrollY);
//   }

//   function restoreScrollPosition() {
//     const position = sessionStorage.getItem(scrollPositionKey);
//     if (position) {
//       window.scrollTo(0, parseInt(position));
//       sessionStorage.removeItem(scrollPositionKey);
//     }
//   }

//

//   // Form submission
//   document
//     .getElementById("queryForm")
//     .addEventListener("submit", function (event) {
//       event.preventDefault();

//       const agent = document.getElementById("agent").value;
//       const queryText = document.getElementById("query").value;
//       const phone = document.getElementById("phone").value;
//       const additionalInfo = document.getElementById("additionalInfo").value;
//       let queryDate = document.getElementById("queryDate").value;
//       const queryTime = new Date().toLocaleTimeString();

//       if (!queryDate) {
//         queryDate = new Date().toISOString().split("T")[0];
//       }

//       if (!agent || agent === "Choose..." || !queryText) {
//         alert("Please fill all required fields.");
//         return;
//       }

//       const queryData = {
//         agent,
//         query: queryText,
//         phone,
//         additionalInfo,
//         date: queryDate,
//         time: queryTime,
//       };

//       if (editId) {
//         queryData.id = editId;
//         updateQuery(queryData);
//       } else {
//         addQuery(queryData);
//       }
//     });

//   function addQuery(queryData) {
//     const transaction = db.transaction("queries", "readwrite");
//     const objectStore = transaction.objectStore("queries");
//     const request = objectStore.add(queryData);

//     request.onsuccess = function () {
//       resetForm();
//       loadQueries();
//       scrollToElement(document.getElementById("queryTable"));
//     };

//     request.onerror = function () {
//       alert("Error adding query.");
//     };
//   }

//   function updateQuery(queryData) {
//     const transaction = db.transaction("queries", "readwrite");
//     const objectStore = transaction.objectStore("queries");
//     const request = objectStore.put(queryData);

//     request.onsuccess = function () {
//       resetForm();
//       editId = null;
//       loadQueries();
//       scrollToElement(document.getElementById("queryForm"));
//     };

//     request.onerror = function () {
//       alert("Error updating query.");
//     };
//   }

//   function resetForm() {
//     document.getElementById("queryForm").reset();
//   }

//   function editQueryHandler(event) {
//     editId = parseInt(event.target.dataset.id);
//     const query = queries.find((q) => q.id === editId);
//     if (query) {
//       document.getElementById("agent").value = query.agent;
//       document.getElementById("query").value = query.query;
//       document.getElementById("phone").value = query.phone || "";
//       document.getElementById("additionalInfo").value =
//         query.additionalInfo || "";
//       document.getElementById("queryDate").value = query.date || "";
//       scrollToElement(document.getElementById("queryForm"));
//     }
//   }

//   function deleteQueryHandler(event) {
//     const id = parseInt(event.target.dataset.id);
//     const transaction = db.transaction("queries", "readwrite");
//     const objectStore = transaction.objectStore("queries");
//     const request = objectStore.delete(id);

//     request.onsuccess = function () {
//       loadQueries();
//     };

//     request.onerror = function () {
//       alert("Error deleting query.");
//     };
//   }

//   // Excel download
//   document
//     .getElementById("downloadExcel")
//     .addEventListener("click", downloadExcel);

//   function downloadExcel() {
//     const agentFilter = document.getElementById("filterAgent").value;
//     const startDate = document.getElementById("filterStartDate").value;
//     const endDate = document.getElementById("filterEndDate").value;
//     const filterText = `${agentFilter}_${startDate || ""}_${endDate || ""}`;

//     const filteredQueries = queries.filter((query) => {
//       const queryDate = query.date
//         ? new Date(query.date).toISOString().split("T")[0]
//         : "";
//       const startCondition = startDate ? queryDate >= startDate : true;
//       const endCondition = endDate ? queryDate <= endDate : true;
//       const agentCondition =
//         agentFilter === "All" || query.agent === agentFilter;
//       return startCondition && endCondition && agentCondition;
//     });

//     const worksheet = XLSX.utils.json_to_sheet(filteredQueries);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Queries");
//     XLSX.writeFile(workbook, `Queries_${filterText}.xlsx`);
//   }

//   // Utility functions
//   function scrollToElement(element) {
//     element.scrollIntoView({ behavior: "smooth" });
//   }

//   // Save scroll position on page unload
//   window.addEventListener("beforeunload", saveScrollPosition);
// });
