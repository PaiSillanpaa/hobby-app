export function filterHobbies(hobbies, filters) {
  const { location = [], age = [], category = [] } = filters;

  const bestMatchScores = hobbies.map(hobby => {
    let score = 0;
    if (location.some(loc => loc === hobby.location[0])) score++;
    if (age.some(a => hobby.age.includes(a))) score++;
    if (category.some(c => hobby.category.includes(c))) score++;
    return { hobby, score };
  });

  bestMatchScores.sort((a, b) => b.score - a.score);

  const mainHobby = bestMatchScores[0]?.hobby || hobbies[0];

  const topMatches = bestMatchScores.filter(b => b.score > 0).map(b => b.hobby);

  const carousels = [];

  location.forEach(loc => {
    const items = hobbies.filter(h => h.location[0] === loc);
    if (items.length) carousels.push({ title: loc, items });
  });

  age.forEach(a => {
    const items = hobbies.filter(h => h.age.includes(a));
    if (items.length) carousels.push({ title: a, items });
  });

  category.forEach(c => {
    const items = hobbies.filter(h => h.category.includes(c));
    if (items.length) carousels.push({ title: c, items });
  });

  if (carousels.length === 0) {
    carousels.push({ title: "Popular Hobbies", items: hobbies.slice(0, 5) });
    carousels.push({ title: "Recommended for You", items: hobbies.slice(5, 10) });
    carousels.push({ title: "Try Something New", items: hobbies.slice(10, 15) });
  }

  return { mainHobby, topMatches, carousels };
}
