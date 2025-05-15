const participants = [];

document.getElementById('participant-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const dob = new Date(document.getElementById('dob').value);
  const gender = document.getElementById('gender').value;
  const weight = parseFloat(document.getElementById('weight').value);

  const age = getAge(dob);
  const category = getCategory(age);
  const weightCategory = getWeightCategory(category, gender, weight);

  if (!weightCategory) {
    alert('No matching weight category found.');
    return;
  }

  participants.push({ name, age, gender, weight, category, weightCategory });
  displayMatches();
  this.reset();
});

function getAge(dob) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function getCategory(age) {
  if (age < 8) return 'Mini Sub Junior';
  if (age < 14) return 'Sub Junior';
  if (age < 18) return 'Junior';
  return 'Senior';
}

function getWeightCategory(category, gender, weight) {
  const categories = {
    'Mini Sub Junior': {
      Male: [15, 18, 21, 24, 27, 30, 33, Infinity],
      Female: [13, 16, 19, 22, 25, 28, 31, Infinity]
    },
    'Sub Junior': {
      Male: [20, 24, 28, 32, 36, 40, 45, 52, Infinity],
      Female: [18, 21, 24, 28, 32, 36, 40, 46, Infinity]
    },
    'Junior': {
      Male: [38, 42, 46, 50, 55, 60, 66, 73, Infinity],
      Female: [36, 40, 44, 48, 52, 56, 62, Infinity]
    },
    'Senior': {
      Male: [50, 55, 60, 65, 70, 76, 83, 90, Infinity],
      Female: [44, 48, 52, 56, 60, 66, 72, Infinity]
    }
  };

  const limits = categories[category]?.[gender];
  if (!limits) return null;

  for (let i = 0; i < limits.length; i++) {
    if (weight <= limits[i]) {
      return `${i === 0 ? '≤' : limits[i - 1] + '–'}${limits[i]} Kg`;
    }
  }
  return null;
}

function displayMatches() {
  const matchContainer = document.getElementById('matches');
  matchContainer.innerHTML = '';

  const grouped = {};

  for (const p of participants) {
    const key = `${p.category} - ${p.gender} - ${p.weightCategory}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p.name);
  }

  for (const key in grouped) {
    const names = grouped[key];
    shuffleArray(names);
    const matches = [];

    for (let i = 0; i < names.length; i += 2) {
      if (i + 1 < names.length) {
        matches.push(`${names[i]} vs ${names[i + 1]}`);
      } else {
        matches.push(`${names[i]} (no opponent)`);
      }
    }

    const div = document.createElement('div');
    div.classList.add('match-group');
    div.innerHTML = `<h3>${key}</h3><ul>${matches.map(m => `<li>${m}</li>`).join('')}</ul>`;
    matchContainer.appendChild(div);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
