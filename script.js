// Utility: calculate age from dob string
function calculateAge(dobStr) {
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Categorize participant
function getCategory(age) {
  if (age < 8) return 'Mini Sub Junior';
  if (age >= 8 && age < 14) return 'Sub Junior';
  if (age >= 14 && age < 18) return 'Junior';
  if (age >= 18 && age <= 35) return 'Senior';
  return 'Veteran';
}

// Weight categories
const weightCategories = [
  { min: 25, max: 30 },
  { min: 30, max: 35 },
  { min: 35, max: 40 },
  { min: 40, max: 45 },
  { min: 45, max: 50 },
  { min: 50, max: 55 },
];

// Shuffle function
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const form = document.getElementById('add-form');
const matchesContainer = document.getElementById('matches-container');

let participants = JSON.parse(localStorage.getItem('participants')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const weight = parseFloat(document.getElementById('weight').value);

  if (!name || !dob || !gender || isNaN(weight)) {
    alert('Please fill all fields correctly');
    return;
  }

  participants.push({ name, dob, gender, weight });
  localStorage.setItem('participants', JSON.stringify(participants));
  form.reset();
  renderMatches();
});

function renderMatches() {
  if (participants.length === 0) {
    matchesContainer.innerHTML = '<p>No participants added yet.</p>';
    return;
  }

  // Group participants by Category -> Weight Category -> Gender
  const groups = {};

  participants.forEach(p => {
    const age = calculateAge(p.dob);
    const category = getCategory(age);

    // Find weight category bucket
    const weightCat = weightCategories.find(wc => p.weight >= wc.min && p.weight < wc.max);

    const weightLabel = weightCat ? `${weightCat.min} to ${weightCat.max} kg` : 'Other Weight';

    if (!groups[category]) groups[category] = {};
    if (!groups[category][weightLabel]) groups[category][weightLabel] = { Male: [], Female: [] };

    groups[category][weightLabel][p.gender].push(p);
  });

  // Build HTML
  let html = '';
  for (const category in groups) {
    html += `<h3>${category} Category</h3>`;

    for (const weightLabel in groups[category]) {
      html += `<h4>Weight: ${weightLabel}</h4>`;

      ['Male', 'Female'].forEach(gender => {
        const group = groups[category][weightLabel][gender];
        if (group.length === 0) return;

        html += `<h5>${gender}s (${group.length} participant${group.length > 1 ? 's' : ''})</h5>`;
        shuffleArray(group);

        html += `<table><thead><tr><th>Fighter 1</th><th>vs</th><th>Fighter 2</th></tr></thead><tbody>`;

        // Generate matches pairwise
        for (let i = 0; i < group.length; i += 2) {
          if (i + 1 < group.length) {
            html += `<tr><td>${group[i].name}</td><td>vs</td><td>${group[i + 1].name}</td></tr>`;
          } else {
            html += `<tr><td colspan="3">${group[i].name} has no opponent</td></tr>`;
          }
        }

        html += `</tbody></table>`;
      });
    }
  }

  matchesContainer.innerHTML = html;
}

// Initial render matches on page load
renderMatches();
