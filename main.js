function openModal() {
  document.getElementById("modal").classList.add("active");
}

function closeModal() {
  clearFields();
  document.getElementById("modal").classList.remove("active");
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("db_client")) ?? [];
}

function setLocalStorage(dbClient) {
  return localStorage.setItem("db_client", JSON.stringify(dbClient));
}

// CRUD

function creatClient(client) {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
}

function readClient() {
  return getLocalStorage();
}

function updateClient(index, client) {
  const dbClient = readClient();
  dbClient[index] = client;
  setLocalStorage(dbClient);
}

function deleteClient(index) {
  const dbClient = readClient();
  dbClient.splice(index, 1);
  setLocalStorage(dbClient);
}

function isValidFields() {
  return document.getElementById("form").reportValidity();
}

// Interação

function clearFields() {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
}

function saveClient() {
  if (isValidFields()) {
    const client = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      city: document.getElementById("city").value,
    };
    const index = document.getElementById("name").dataset.index;
    if (index == "new") {
      creatClient(client);
      updateTable();
      closeModal();
    } else {
      updateClient(index, client);
      updateTable();
      closeModal();
    }
  }
}

function creatRow(client, index) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${client.name}</td>
    <td>${client.email}</td>
    <td>${client.phone}</td>
    <td>${client.city}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}" >Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
  `;

  document.querySelector("#tableClient>tbody").appendChild(newRow);
}

function clearTable() {
  const rows = document.querySelectorAll("#tableClient>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
}

function updateTable() {
  const dbClient = readClient();
  clearTable();
  dbClient.forEach(creatRow);
}

function fillFields(client) {
  document.getElementById("name").value = client.name;
  document.getElementById("email").value = client.email;
  document.getElementById("phone").value = client.phone;
  document.getElementById("city").value = client.city;
  document.getElementById("name").dataset.index = client.index;
}

function editClient(index) {
  const client = readClient()[index];
  client.index = index;
  fillFields(client);
  openModal();
}

function editDelete(event) {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");
    if (action == "edit") {
      editClient(index);
    } else {
      const client = readClient()[index];
      const response = confirm(
        `Deseja realmente exclir o cliente ${client.name}`
      );
      if (response) {
        deleteClient(index);
        updateTable();
      }
    }
  }
}

updateTable();

// Events
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveClient);

document
  .querySelector("#tableClient>tbody")
  .addEventListener("click", editDelete);
