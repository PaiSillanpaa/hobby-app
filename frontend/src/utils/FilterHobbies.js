function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function filterHobbies(hobbies, filters) {
  const { location = [], age = [], category = [] } = filters;

  const locations = Array.isArray(location) ? location : [location];
  const ages = Array.isArray(age) ? age : [age];
  const categories = Array.isArray(category) ? category : [category];

  const bestMatchScores = hobbies.map(hobby => {
    let score = 0;
    if (locations.some(loc => hobby.location.some(locObj => locObj.city === loc))) score++;
    if (ages.some(a => hobby.age.includes(a))) score++;
    if (categories.some(c => hobby.category.includes(c))) score++;
    return { hobby, score };
  });

  bestMatchScores.sort((a, b) => b.score - a.score);

  const mainHobby = bestMatchScores[0]?.hobby || hobbies[0];

  const topMatches = bestMatchScores.filter(b => b.score > 0).map(b => b.hobby);

  const carousels = [];

  locations.forEach(loc => {
    const items = hobbies.filter(h => h.location.some(locObj => locObj.city === loc));
    if (items.length) carousels.push({ title: loc, items });
  });

  ages.forEach(a => {
    const items = hobbies.filter(h => h.age.includes(a));
    if (items.length) carousels.push({ title: a, items });
  });

  categories.forEach(c => {
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
export function createFilterTitle(filterLocation, filterAge, filterCategory) {
  const locationTitle = filterLocation.length > 0 ? capitalizeFirstLetter(filterLocation.join(" - ")) : "";
  const ageTitle = filterAge.length > 0 ? capitalizeFirstLetter(filterAge.join(" - ")) : "";
  const categoryTitle = filterCategory.length > 0 ? capitalizeFirstLetter(filterCategory.join(" - ")) : "";

  const titles = [];
  
  if (locationTitle) titles.push(locationTitle);
  if (ageTitle) titles.push(ageTitle);
  if (categoryTitle) titles.push(categoryTitle);

  return titles;
}

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Maapallon säde kilometreinä
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Etäisyys kilometreinä
};

export function useFilteredHobbiesByLocation(userLocation, displayedHobbies) {
  if (!userLocation || !displayedHobbies || displayedHobbies.length === 0) return [];

  const filteredHobbies = displayedHobbies.map((hobby) => ({
    ...hobby,
    distance: getDistance(
      userLocation.lat,
      userLocation.lon,
      hobby.location.coordinates[0],
      hobby.location.coordinates[1]
    ),
  }));

  filteredHobbies.sort((a, b) => a.distance - b.distance);
  return filteredHobbies.slice(0, 5);
}