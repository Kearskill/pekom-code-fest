export async function getQuickRecommendations() {
  const res = await fetch("http://localhost:8000/api/recommendations/quick"); // full URL
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}