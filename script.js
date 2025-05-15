const form = document.getElementById("participant-form");
const matchesTableBody = document.querySelector("#matches-table tbody");

let participants = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const dob = new Date(document.getElementById("dob").value);
  const gender = document.getElementById("gender").value;
  const weight = parseFloat(document.getElementById("weight").value);

  const age = calculateAge(dob);
  const category = getAgeCategory(age);
  const weightGroup = getWeightGroup(category, gender, weight);

  if (!category || !weightGroup) {
    alert("No matching weight group found!");
    return;
  }

  participants.push({ name, category, gender, weightGroup });

  displayMatches();
  form.reset();
});

function calculateAge(dob) {
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getAgeCategory(age) {
  if (age < 8) return "Mini Sub Junior";
  if (age >= 8 && age < 14) return "Sub Junior";
  if (age >= 14 && age < 18) return "Junior";
  if (age >= 18 && age <= 35) return "Senior";
  return null;
}

function getWeightGroup(category, gender, weight) {
  const weightGroups = {
    "Mini Sub Junior": {
      Male: [
        [0, 15], [15, 18], [18, 21], [21, 24], [24, 27],
        [27, 30], [30, 33], [33, Infinity]
      ],
      Female: [
        [0, 13], [13, 16], [16, 19], [19, 22], [22, 25],
        [25, 28], [28, 31], [31, Infinity]
      ]
    },
    "Sub Junior": {
      Male: [
        [0, 20], [20, 24], [24, 28], [28, 32], [32, 36],
        [36, 40], [40, 45], [45, 52], [52, Infinity]
      ],
      Female: [
        [0, 18], [18, 21], [21, 24], [24, 28], [28, 32],
        [32, 36], [36, 40], [40, 46], [46, Infinity]
      ]
    },
    "Junior": {
      Male: [
        [0, 38], [38, 42], [42, 46], [46, 50], [50, 55],
        [55, 60], [60, 66], [66, 73], [73, Infinity]
      ],
      Female: [
        [0, 36], [36, 40], [40, 44], [44, 48], [48, 52],
        [52, 56], [56, 62], [62, Infinity]
      ]
    },
    "Senior": {
      Male: [
        [0, 50], [50, 55], [55, 60], [60, 65], [65, 70],
        [70, 76], [76, 83], [83, 90], [90, Infinity]
      ],
      Female: [
        [0, 44], [44, 48], [48, 52], [52, 56], [56, 60],
        [60, 66], [66, 72], [72, Infinity]
      ]
    }
  };

  const group = weightGroups[category]?.[gender];
  if (!group) return null;

  for (let range of group) {
    if (weight > range[0] && weight <= range[1]) {
      return `${range[0] === 0 ? '<=' : `> ${range[0]}`}–${range[1]} Kg`;
    }
  }

  return null;
}

function displayMatches() {
  const grouped = {};

  participants.forEach(p => {
    const key = `${p.category}-${p.gender}-${p.weightGroup}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p.name);
  });

  matchesTableBody.innerHTML = "";

  Object.entries(grouped).forEach(([group, names]) => {
    const [category, gender, weightGroup] = group.split("-");
    for (let i = 0; i < names.length; i += 2) {
      const player1 = names[i];
      const player2 = names[i + 1] || "(no opponent)";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${category}</td>
        <td>${gender}</td>
        <td>${weightGroup}</td>
        <td>${player1} vs ${player2}</td>
      `;
      matchesTableBody.appendChild(row);
    }
  });
}
