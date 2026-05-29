import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router";

const useQuery = ({
  url,
  method = "GET",
  params = {},
  guard = false,
  immediate = true,
  onSuccess = null,
  onError = null,
  doingOnce = false,
  mustLogin = false,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUnauthorized = useCallback(() => {
    if (guard) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (axios.defaults.headers.common["Authorization"]) {
        delete axios.defaults.headers.common["Authorization"];
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    }
  }, [guard, navigate]);

  const execute = useCallback(
    async (customParams = {}) => {
      try {
        if (mustLogin) {
          if (!axios.defaults.headers.common["Authorization"]) {
            return;
          }
        }

        setLoading(true);
        setError(null);


        const queryParams = { ...params, ...customParams };
        let response;

        switch (method.toUpperCase()) {
          case "GET":
            response = await axios.get(url, { params: queryParams });
            break;
          case "POST":
            response = await axios.post(url, queryParams);
            break;
          case "PUT":
            response = await axios.put(url, queryParams);
            break;
          case "DELETE":
            response = await axios.delete(url, { data: queryParams });
            break;
          case "PATCH":
            response = await axios.patch(url, queryParams);
            break;
          default:
            response = await axios.get(url, { params: queryParams });
        }

        setData(response.data?.data);
        if (onSuccess) onSuccess(response.data?.data);
        return response.data?.data;
      } catch (err) {
        if (err.response?.status === 401) {
          handleUnauthorized();
        }

        setError(err);
        if (onError) onError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, params, guard, handleUnauthorized, onSuccess, onError, mustLogin]
  );

  const doing = useRef(false);
  useEffect(() => {
    if (immediate) {
      if (doing.current && doingOnce) {
        return;
      }

      execute();
      doing.current = true;
    }
  }, [url, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

export default useQuery;
