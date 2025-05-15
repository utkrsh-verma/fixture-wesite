document.getElementById("participantForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const weight = parseFloat(document.getElementById("weight").value);

  const age = calculateAge(dob);
  const ageGroup = getAgeGroup(age);
  const weightCategory = getWeightCategory(ageGroup, gender, weight);

  const result = document.createElement("p");
  result.textContent = `${name} (${gender}, Age: ${age}) → Age Group: ${ageGroup}, Weight Group: ${weightCategory || "N/A"}`;

  document.getElementById("fights").appendChild(result);

  this.reset();
});

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getAgeGroup(age) {
  if (age < 8) return "Mini Sub Junior";
  if (age >= 8 && age < 14) return "Sub Junior";
  if (age >= 14 && age < 18) return "Junior";
  if (age >= 18 && age <= 35) return "Senior";
  return "Unknown";
}

function getWeightCategory(ageGroup, gender, weight) {
  const categories = {
    "Mini Sub Junior": { male: [0, 15, 18, 21], female: [0, 13, 16, 19] },
    "Sub Junior": { male: [0, 24, 28, 32], female: [0, 21, 24, 28] },
    Junior: { male: [0, 42, 46, 50], female: [0, 40, 44, 48] },
    Senior: { male: [0, 55, 60, 65], female: [0, 48, 52, 56] },
  };

  const group = categories[ageGroup];
  if (!group) return null;

  const limits = group[gender];
  if (!limits) return null;

  for (let i = 0; i < limits.length - 1; i++) {
    if (weight > limits[i] && weight <= limits[i + 1]) {
      return `Above ${limits[i]} Kg to ${limits[i + 1]} Kg`;
    }
  }

  if (weight <= limits[0]) {
    return `Below & Upto ${limits[0]} Kg`;
  }

  if (weight > limits[limits.length - 1]) {
    return `Above ${limits[limits.length - 1]} Kg`;
  }

  return null;
}
