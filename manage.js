const participantsTableBody = document.querySelector("#participants-table tbody");
const editFormContainer = document.getElementById("edit-form-container");
const editForm = document.getElementById("edit-form");

let participants = JSON.parse(localStorage.getItem("participants")) || [];
let editIndex = null;

function renderParticipants() {
  participantsTableBody.innerHTML = "";
  participants.forEach((p, index) => {
    const dobFormatted = new Date(p.dob).toLocaleDateString();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Name">${p.name}</td>
      <td data-label="DOB">${dobFormatted}</td>
      <td data-label="Gender">${p.gender}</td>
      <td data-label="Weight">${p.weight}</td>
      <td data-label="Actions">
        <button class="action-btn" onclick="startEdit(${index})">Edit</button>
        <button class="action-btn" onclick="deleteParticipant(${index})">Delete</button>
      </td>
    `;
    participantsTableBody.appendChild(row);
  });
}

function startEdit(index) {
  editIndex = index;
  const p = participants[index];
  document.getElementById("edit-name").value = p.name;
  document.getElementById("edit-dob").value = p.dob;
  document.getElementById("edit-gender").value = p.gender;
  document.getElementById("edit-weight").value = p.weight;
  editFormContainer.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteParticipant(index) {
  if (confirm("Are you sure you want to delete this participant?")) {
    participants.splice(index, 1);
    saveAndRender();
  }
}

editForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (editIndex === null) return;

  const name = document.getElementById("edit-name").value.trim();
  const dob = document.getElementById("edit-dob").value;
  const gender = document.getElementById("edit-gender").value;
  const weight = parseFloat(document.getElementById("edit-weight").value);

  if (!name || !dob || !gender || isNaN(weight)) {
    alert("Please fill all fields correctly.");
    return;
  }

  participants[editIndex] = { name, dob, gender, weight };
  saveAndRender();
  editFormContainer.style.display = "none";
  editIndex = null;
});

document.getElementById("cancel-edit").addEventListener("click", () => {
  editFormContainer.style.display = "none";
  editIndex = null;
});

function saveAndRender() {
  localStorage.setItem("participants", JSON.stringify(participants));
  renderParticipants();
}

// Initial render
renderParticipants();

// For buttons called from HTML:
window.startEdit = startEdit;
window.deleteParticipant = deleteParticipant;
