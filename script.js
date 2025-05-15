const form = document.getElementById('participantForm');
const matchupsDiv = document.getElementById('matchups');

const participants = [];

const categories = [
  { name: 'Sub Junior (4-8)', minAge: 4, maxAge: 8 },
  { name: 'Sub Junior (8-14)', minAge: 9, maxAge: 14 },
  { name: 'Junior (14-18)', minAge: 15, maxAge: 18 },
  { name: 'Senior (18-35)', minAge: 19, maxAge: 35 },
];

const weightRanges = [
  { min: 0, max: 15, label: 'Below & Upto 15 Kg' },
  { min: 15, max: 18, label: 'Above 15 Kg to 18 Kg' },
  { min: 18, max: 21, label: 'Above 18 Kg to 21 Kg' },
  { min: 21, max: 24, label: 'Above 21 Kg to 24 Kg' },
  { min: 24, max: 27, label: 'Above 24 Kg to 27 Kg' },
  { min: 27, max: 30, label: 'Above 27 Kg to 30 Kg' },
  { min: 30, max: 33, label: 'Above 30 Kg to 33 Kg' },
  { min: 33, max: 9999, label: 'Above 33 Kg' },
];

// Use age category based on your full table if needed — simplified here for demo

function calculateAge(dob) {
  const diff = Date.now() - new Date(dob).getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

function getCategory(age) {
  for (let cat of categories) {
    if (age >= cat.minAge && age <= cat.maxAge) {
      return cat.name;
    }
  }
  return 'Unknown';
}

function getWeightRange(weight) {
  for (let range of weightRanges) {
    if (weight > range.min && weight <= range.max) {
      return range.label;
    }
  }
  return 'Unknown';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const weight = parseFloat(document.getElementById('weight').value);

  if (!name || !dob || !gender || !weight) {
    alert('Please fill all fields!');
    return;
  }

  const age = calculateAge(dob);
  const category = getCategory(age);
  const weightRange = getWeightRange(weight);

  participants.push({ name, age, dob, gender, weight, category, weightRange });

  form.reset();
  renderMatchups();
});

function renderMatchups() {
  matchupsDiv.innerHTML = '';

  // Group participants by category, gender, weightRange
  const groups = {};

  participants.forEach((p) => {
    const key = `${p.category}-${p.gender}-${p.weightRange}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  // For each group, shuffle and show pairs
  for (let groupKey in groups) {
    const group = groups[groupKey];
    shuffleArray(group);

    // Extract category, gender, weightRange from key
    const [category, gender, ...weightParts] = groupKey.split('-');
    const weightRange = weightParts.join('-');

    const heading = document.createElement('h3');
    heading.textContent = `${category} - ${capitalize(gender)} (${weightRange})`;
    matchupsDiv.appendChild(heading);

    for (let i = 0; i < group.length; i += 2) {
      const p1 = group[i];
      const p2 = group[i + 1];
      const matchup = document.createElement('p');
      if (p2) {
        matchup.textContent = `${p1.name} vs ${p2.name}`;
      } else {
        matchup.textContent = `${p1.name} has no match`;
      }
      matchupsDiv.appendChild(matchup);
    }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
