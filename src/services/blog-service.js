import axios from "axios";

const API_URL = "/blog";

export const fetchBlogPosts = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/posts`, { params });
    return {
      success: true,
      data: response.data.data || response.data,
      pagination: response.data.pagination || null,
    };
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const fetchBlogPostBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${slug}`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const searchBlogPosts = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: { q: keyword } });
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error("Failed to search posts:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};