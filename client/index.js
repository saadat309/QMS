const admin = JSON.parse(sessionStorage.getItem("admin"));
console.log(admin.id, admin.email);

if (!admin) {
  // Not logged in — kick back to login page
  window.location.href = "/login.html";
} else {
  // ✅ Preload dashboard
  document.getElementById("welcome").textContent = `Welcome, ${admin.email}`;
  // You can also fetch other things based on admin.id
}

// document.addEventListener("DOMContentLoaded", function () {
//   let db;
//   let queries = [];
//   let editId = null;
//   const scrollPositionKey = "scrollPosition";

//   // Open IndexedDB database
//   const request = indexedDB.open("QueriesDB", 1);

//   request.onupgradeneeded = function (event) {
//     db = event.target.result;
//     if (!db.objectStoreNames.contains("queries")) {
//       const objectStore = db.createObjectStore("queries", {
//         keyPath: "id",
//         autoIncrement: true,
//       });
//       objectStore.createIndex("agent", "agent", { unique: false });
//       objectStore.createIndex("query", "query", { unique: false });
//       objectStore.createIndex("phone", "phone", { unique: false });
//       objectStore.createIndex("additionalInfo", "additionalInfo", {
//         unique: false,
//       });
//       objectStore.createIndex("date", "date", { unique: false });
//       objectStore.createIndex("time", "time", { unique: false });
//     }
//   };

//   request.onsuccess = function (event) {
//     db = event.target.result;
//     loadQueries();
//     loadAgents();
//     restoreScrollPosition();
//   };

//   request.onerror = function (event) {
//     console.error("Error opening IndexedDB:", event.target.errorCode);
//     alert("Error opening IndexedDB: " + event.target.errorCode);
//   };

//   // Export to JSON
//   document
//     .getElementById("exportBackup")
//     .addEventListener("click", exportDataToJSON);

//   function exportDataToJSON() {
//     if (!db) {
//       alert("Database not initialized.");
//       return;
//     }

//     const transaction = db.transaction("queries", "readonly");
//     const objectStore = transaction.objectStore("queries");
//     const request = objectStore.getAll();

//     request.onsuccess = function () {
//       const data = request.result;
//       const blob = new Blob([JSON.stringify(data, null, 2)], {
//         type: "application/json",
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "backup.json";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     };

//     request.onerror = function () {
//       alert("Error exporting data.");
//     };
//   }

//   // Import from JSON
//   document
//     .getElementById("importBackup")
//     .addEventListener("change", function (event) {
//       const file = event.target.files[0];
//       if (file) {
//         importDataFromJSON(file);
//       }
//     });

//   function importDataFromJSON(file) {
//     const reader = new FileReader();

//     reader.onload = function (event) {
//       try {
//         const data = JSON.parse(event.target.result);
//         const transaction = db.transaction("queries", "readwrite");
//         const objectStore = transaction.objectStore("queries");

//         data.forEach((item) => {
//           objectStore.put(item);
//         });

//         transaction.oncomplete = function () {
//           alert("Data imported successfully.");
//           loadQueries();
//         };

//         transaction.onerror = function () {
//           alert("Error importing data.");
//         };
//       } catch (e) {
//         alert("Error parsing JSON file: " + e.message);
//       }
//     };

//     reader.readAsText(file);
//   }

//   // Update Backup
//   document
//     .getElementById("updateBackup")
//     .addEventListener("click", updateBackupHandler);

//   async function updateBackupHandler() {
//     const fileInput = document.getElementById("existingBackup");
//     if (fileInput.files.length === 0) {
//       alert("Please select a backup file to update.");
//       return;
//     }

//     const file = fileInput.files[0];
//     const reader = new FileReader();

//     reader.onload = async function (event) {
//       try {
//         const existingData = JSON.parse(event.target.result);
//         const newData = await fetchQueriesFromIndexedDB();
//         updateBackupFile(existingData, newData);
//       } catch (error) {
//         alert("Error updating backup: " + error);
//       }
//     };

//     reader.readAsText(file);
//   }

//   function updateBackupFile(existingData, newData) {
//     const combinedData = [...existingData, ...newData];
//     const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "backup.json";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   }

//   function fetchQueriesFromIndexedDB() {
//     return new Promise((resolve, reject) => {
//       const transaction = db.transaction("queries", "readonly");
//       const objectStore = transaction.objectStore("queries");
//       const request = objectStore.getAll();

//       request.onsuccess = function () {
//         resolve(request.result);
//       };

//       request.onerror = function () {
//         reject("Error fetching queries from IndexedDB.");
//       };
//     });
//   }

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

//   // Agent management
//   function loadAgents() {
//     const agents = JSON.parse(localStorage.getItem("agents")) || [
//       "Agent 1",
//       "Agent 2",
//       "Agent 3",
//     ];
//     const filterAgent = document.getElementById("filterAgent");
//     const agentSelect = document.getElementById("agent");
//     const removeAgentSelect = document.getElementById("removeAgentSelect");

//     clearSelect(filterAgent);
//     clearSelect(agentSelect);
//     clearSelect(removeAgentSelect);

//     addOption(filterAgent, "All", "All");
//     addOption(agentSelect, "Choose...", "", true);
//     addOption(removeAgentSelect, "Choose...", "", true);

//     agents.forEach((agent) => {
//       addOption(filterAgent, agent, agent);
//       addOption(agentSelect, agent, agent);
//       addOption(removeAgentSelect, agent, agent);
//     });
//   }

//   function clearSelect(selectElement) {
//     while (selectElement.options.length > 0) {
//       selectElement.remove(0);
//     }
//   }

//   function addOption(selectElement, text, value, selected = false) {
//     const option = document.createElement("option");
//     option.text = text;
//     option.value = value;
//     option.selected = selected;
//     selectElement.appendChild(option);
//   }

//   function saveAgent(agent) {
//     let agents = JSON.parse(localStorage.getItem("agents")) || [];
//     if (!agents.includes(agent)) {
//       agents.push(agent);
//       localStorage.setItem("agents", JSON.stringify(agents));
//       loadAgents();
//     }
//   }

//   function removeAgent(agent) {
//     let agents = JSON.parse(localStorage.getItem("agents")) || [];
//     agents = agents.filter((existingAgent) => existingAgent !== agent);
//     localStorage.setItem("agents", JSON.stringify(agents));
//     loadAgents();
//   }

//   // Query handling
//   function loadQueries() {
//     const transaction = db.transaction("queries", "readonly");
//     const objectStore = transaction.objectStore("queries");
//     const request = objectStore.getAll();

//     request.onsuccess = function (event) {
//       queries = event.target.result;
//       displayQueries(queries);
//     };

//     request.onerror = function (event) {
//       console.error("Error fetching queries:", event.target.errorCode);
//       alert("Error fetching queries: " + event.target.errorCode);
//     };
//   }

//   function displayQueries(queries) {
//     const tableBody = document.querySelector("#queryTable tbody");
//     tableBody.innerHTML = "";

//     queries.forEach((query, index) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//                 <th scope="row">${index + 1}</th>
//                 <td>${query.agent}</td>
//                 <td>${query.query}</td>
//                 <td>${query.phone || ""}</td>
//                 <td>${query.additionalInfo || ""}</td>
//                 <td>${query.date || ""}</td>
//                 <td>${query.time}</td>
//                 <td>
//                     <button class="btn btn-warning btn-sm edit-btn" data-id="${
//                       query.id
//                     }">Edit</button>
//                     <button class="btn btn-danger btn-sm delete-btn" data-id="${
//                       query.id
//                     }">Delete</button>
//                 </td>
//             `;
//       tableBody.appendChild(row);
//     });

//     if (editId === null) {
//       scrollToElement(document.getElementById("queryTable"));
//     }

//     // Attach event listeners to new buttons
//     document.querySelectorAll(".edit-btn").forEach((btn) => {
//       btn.addEventListener("click", editQueryHandler);
//     });
//     document.querySelectorAll(".delete-btn").forEach((btn) => {
//       btn.addEventListener("click", deleteQueryHandler);
//     });
//   }

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

//   // Filter handling
//   document
//     .getElementById("applyFilters")
//     .addEventListener("click", applyFilters);
//   document
//     .getElementById("clearFilters")
//     .addEventListener("click", clearFilters);

//   function applyFilters() {
//     const agent = document.getElementById("filterAgent").value;
//     const startDate = document.getElementById("filterStartDate").value;
//     const endDate = document.getElementById("filterEndDate").value;

//     let filteredQueries = queries;

//     if (agent && agent !== "All") {
//       filteredQueries = filteredQueries.filter((q) => q.agent === agent);
//     }
//     if (startDate) {
//       filteredQueries = filteredQueries.filter(
//         (q) => new Date(q.date) >= new Date(startDate)
//       );
//     }
//     if (endDate) {
//       filteredQueries = filteredQueries.filter(
//         (q) => new Date(q.date) <= new Date(endDate)
//       );
//     }

//     displayQueries(filteredQueries);
//   }

//   function clearFilters() {
//     document.getElementById("filterAgent").value = "All";
//     document.getElementById("filterStartDate").value = "";
//     document.getElementById("filterEndDate").value = "";
//     displayQueries(queries);
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

//   // Agent management handlers
//   document
//     .getElementById("addAgent")
//     .addEventListener("click", addAgentHandler);
//   document
//     .getElementById("removeAgent")
//     .addEventListener("click", removeAgentHandler);

//   function addAgentHandler() {
//     const agent = document.getElementById("newAgent").value;
//     if (agent) {
//       saveAgent(agent);
//       document.getElementById("newAgent").value = "";
//     }
//   }

//   function removeAgentHandler() {
//     const agent = document.getElementById("removeAgentSelect").value;
//     if (agent && agent !== "Choose...") {
//       removeAgent(agent);
//     }
//   }

//   // Utility functions
//   function scrollToElement(element) {
//     element.scrollIntoView({ behavior: "smooth" });
//   }

//   // Save scroll position on page unload
//   window.addEventListener("beforeunload", saveScrollPosition);
// });
