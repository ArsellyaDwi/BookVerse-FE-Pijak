import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useLoading } from "@/context/loading-context";

/**
 * @typedef {Object} UseMutationOptions
 * @property {string} url - The API endpoint URL
 * @property {string} [method="POST"] - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @property {boolean} [guard=false] - Whether to require authentication token
 * @property {Function} [onSuccess] - Callback function on successful mutation
 * @property {Function} [onError] - Callback function on error
 */

/**
 * Custom hook for handling API mutations with global loading state
 * @param {UseMutationOptions} options - Configuration options for the mutation
 * @returns {Object} Mutation state and methods
 */
const useMutation = ({
  url,
  method = "POST",
  guard = false,
  onSuccess = null,
  onError = null,
  withLoading = true,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const handleUnauthorized = useCallback(() => {
    if (guard) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/login");
    }
  }, [guard, navigate]);

  /**
   * Execute the mutation
   * @param {Object} [payload={}] - Request payload
   * @returns {Promise<any>} Response data or null
   */
  const mutate = useCallback(
    async (payload = {}, urlParams = "") => {
      try {
        setLoading(true);
        setError(null);
        if (withLoading) {

          showLoading();
        }

        if (guard) {
          const token = localStorage.getItem("token");
          if (!token) {
            handleUnauthorized();
            return null;
          }

          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        let response;

        switch (method.toUpperCase()) {
          case "POST":
            response = await axios.post(url + urlParams, payload);
            break;
          case "PUT":
            response = await axios.put(url + urlParams, payload);
            break;
          case "DELETE":
            response = await axios.delete(url + urlParams, { data: payload });
            break;
          case "PATCH":
            response = await axios.patch(url + urlParams, payload);
            break;
          default:
            response = await axios.post(url + urlParams, payload);
        }

        setData(response?.data);

        if (onSuccess) onSuccess(response.data);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";

        if (err.response?.status === 401) {
          handleUnauthorized();
        }

        setError(err);
        if (onError) onError(err);
        return null;
      } finally {
        setLoading(false);
        if (withLoading) {
          hideLoading();
        }
      }
    },
    [
      url,
      method,
      guard,
      handleUnauthorized,
      onSuccess,
      onError,
      showLoading,
      hideLoading,
    ]
  );

  return {
    /** Response data from the API */
    data,
    /** Local loading state */
    loading,
    /** Error object if request failed */
    error,
    /** Execute the mutation function */
    mutate,
    /** Reset data and error states */
    reset: () => {
      setData(null);
      setError(null);
    },
  };
};

export default useMutation;
