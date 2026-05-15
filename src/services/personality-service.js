import axios from "axios";

const AI_API_URL = "/api-ai";

export const predictPersonality = async (answers) => {
  try {
    const response = await axios.post(`${AI_API_URL}/predict`, {
      answers: answers
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("AI Personality Prediction Error:", error);
    return {
      success: false,
      error: error.response?.data?.detail || error.message
    };
  }
};

export const getGenreRecommendations = (personality) => {
  const recommendations = [];
  
  // Openness
  if (personality.openness >= 70) {
    recommendations.push({ genre: "Fiction", slug: "fiction", score: personality.openness });
    recommendations.push({ genre: "Fantasy", slug: "fantasy", score: personality.openness });
    recommendations.push({ genre: "Science-Fiction", slug: "science-fiction", score: personality.openness });
  } else if (personality.openness >= 55) {
    recommendations.push({ genre: "Literary-Fiction", slug: "literary-fiction", score: personality.openness });
    recommendations.push({ genre: "Contemporary", slug: "contemporary", score: personality.openness });
  } else {
    recommendations.push({ genre: "Classic", slug: "classic", score: personality.openness });
    recommendations.push({ genre: "Realistic-Fiction", slug: "realistic-fiction", score: personality.openness });
  }
  
  // Conscientiousness
  if (personality.conscientiousness >= 70) {
    recommendations.push({ genre: "Self-Improvement", slug: "self-improvement", score: personality.conscientiousness });
    recommendations.push({ genre: "Business", slug: "business", score: personality.conscientiousness });
    recommendations.push({ genre: "Biography", slug: "biography", score: personality.conscientiousness });
  } else if (personality.conscientiousness >= 55) {
    recommendations.push({ genre: "Productivity", slug: "productivity", score: personality.conscientiousness });
    recommendations.push({ genre: "History", slug: "history", score: personality.conscientiousness });
  } else {
    recommendations.push({ genre: "Graphic-Novels", slug: "graphic-novels", score: personality.conscientiousness });
    recommendations.push({ genre: "Short-Stories", slug: "short-stories", score: personality.conscientiousness });
  }
  
  // Extroversion
  if (personality.extroversion >= 65) {
    recommendations.push({ genre: "Adventure", slug: "adventure", score: personality.extroversion });
    recommendations.push({ genre: "Comedy", slug: "comedy", score: personality.extroversion });
    recommendations.push({ genre: "Romance", slug: "romance", score: personality.extroversion });
  } else if (personality.extroversion >= 50) {
    recommendations.push({ genre: "Drama", slug: "drama", score: personality.extroversion });
    recommendations.push({ genre: "Mystery", slug: "mystery", score: personality.extroversion });
  } else {
    recommendations.push({ genre: "Poetry", slug: "poetry", score: personality.extroversion });
    recommendations.push({ genre: "Philosophy", slug: "philosophy", score: personality.extroversion });
  }
  
  // Agreeableness
  if (personality.agreeableness >= 70) {
    recommendations.push({ genre: "Romance", slug: "romance", score: personality.agreeableness });
    recommendations.push({ genre: "Drama", slug: "drama", score: personality.agreeableness });
    recommendations.push({ genre: "Literary-Fiction", slug: "literary-fiction", score: personality.agreeableness });
  } else if (personality.agreeableness >= 55) {
    recommendations.push({ genre: "Contemporary-Fiction", slug: "contemporary-fiction", score: personality.agreeableness });
    recommendations.push({ genre: "Family-Saga", slug: "family-saga", score: personality.agreeableness });
  } else {
    recommendations.push({ genre: "Thriller", slug: "thriller", score: personality.agreeableness });
    recommendations.push({ genre: "Crime", slug: "crime", score: personality.agreeableness });
  }
  
  // Neuroticism
  if (personality.neuroticism >= 65) {
    recommendations.push({ genre: "Philosophy", slug: "philosophy", score: personality.neuroticism });
    recommendations.push({ genre: "Mindfulness", slug: "mindfulness", score: personality.neuroticism });
    recommendations.push({ genre: "Poetry", slug: "poetry", score: personality.neuroticism });
  } else if (personality.neuroticism >= 50) {
    recommendations.push({ genre: "Psychology", slug: "psychology", score: personality.neuroticism });
    recommendations.push({ genre: "Memoir", slug: "memoir", score: personality.neuroticism });
  } else {
    recommendations.push({ genre: "Comedy", slug: "comedy", score: personality.neuroticism });
    recommendations.push({ genre: "Adventure", slug: "adventure", score: personality.neuroticism });
  }
  
  // Hapus duplikat dan urutkan
  const uniqueGenres = [...new Map(recommendations.map(item => [item.slug, item])).values()];
  return uniqueGenres.sort((a, b) => b.score - a.score).slice(0, 6);
};