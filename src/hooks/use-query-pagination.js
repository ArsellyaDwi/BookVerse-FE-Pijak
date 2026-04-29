import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const useQueryPagination = ({
  url,
  method = "GET",
  params = {},
  guard = false,
  immediate = true,
  onSuccess = null,
  onError = null,
  paginated = false,
  pageParam = "page",
  perPageParam = "per_page",
  defaultPerPage = 10,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: defaultPerPage,
    total: 0,
    from: 0,
    to: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [allData, setAllData] = useState([]);
  
  const navigate = useNavigate();
  const isFetchingRef = useRef(false);
  const currentPageRef = useRef(1);
  const currentPerPageRef = useRef(defaultPerPage);

  const handleUnauthorized = useCallback(() => {
    if (guard) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [guard, navigate]);

  const fetchData = useCallback(async (pageNum, perPageNum, append = false, extraParams = {}) => {
    if (isFetchingRef.current) {
      console.log("Request already in progress");
      return null;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const queryParams = {
        ...params,
        ...extraParams,
      };

      if (paginated) {
        queryParams[pageParam] = pageNum;
        queryParams[perPageParam] = perPageNum;
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

      let responseData = response.data?.data;
      let paginationInfo = null;

      if (paginated && response.data?.data && typeof response.data.data === 'object') {
        if ('current_page' in response.data.data && 'data' in response.data.data) {
          responseData = response.data.data.data;
          paginationInfo = {
            currentPage: response.data.data.current_page,
            lastPage: response.data.data.last_page,
            perPage: response.data.data.per_page,
            total: response.data.data.total,
            from: response.data.data.from,
            to: response.data.data.to,
            hasNextPage: response.data.data.current_page < response.data.data.last_page,
            hasPrevPage: response.data.data.current_page > 1,
          };
        }
      }

      if (paginationInfo) {
        setPagination({
          currentPage: paginationInfo.currentPage,
          lastPage: paginationInfo.lastPage,
          perPage: paginationInfo.perPage,
          total: paginationInfo.total,
          from: paginationInfo.from,
          to: paginationInfo.to,
          hasNextPage: paginationInfo.hasNextPage,
          hasPrevPage: paginationInfo.hasPrevPage,
        });
        currentPageRef.current = paginationInfo.currentPage;
        currentPerPageRef.current = paginationInfo.perPage;

        if (append) {
          setAllData(prev => [...prev, ...responseData]);
          setData(prev => [...(prev || []), ...responseData]);
        } else {
          setAllData(responseData);
          setData(responseData);
        }
      } else {
        if (append && Array.isArray(allData)) {
          setAllData(prev => [...prev, ...responseData]);
          setData(prev => [...(prev || []), ...responseData]);
        } else {
          setAllData(responseData);
          setData(responseData);
        }
      }

      if (onSuccess) onSuccess(responseData, paginationInfo);
      return { data: responseData, pagination: paginationInfo };
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      if (err.response?.status === 401) {
        handleUnauthorized();
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error(errorMessage);
      }
      setError(err);
      if (onError) onError(err);
      return null;
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [url, method, params, guard, paginated, pageParam, perPageParam, handleUnauthorized, onSuccess, onError, allData]);

  const loadMore = useCallback(() => {
    if (!loading && pagination.hasNextPage) {
      const nextPage = currentPageRef.current + 1;
      const perPageNum = currentPerPageRef.current;
      fetchData(nextPage, perPageNum, true);
    }
  }, [loading, pagination.hasNextPage]);

  const goToPage = useCallback((pageNum) => {
    if (!loading && pageNum !== currentPageRef.current && pageNum >= 1 && pageNum <= pagination.lastPage) {
      const perPageNum = currentPerPageRef.current;
      fetchData(pageNum, perPageNum, false);
    }
  }, [loading, pagination.lastPage]);

  const changePerPage = useCallback((newPerPage) => {
    if (!loading && newPerPage !== currentPerPageRef.current) {
      fetchData(1, newPerPage, false);
    }
  }, [loading]);

  const refetch = useCallback((newParams = {}) => {
    const perPageNum = currentPerPageRef.current;
    fetchData(1, perPageNum, false, newParams);
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData(currentPageRef.current, currentPerPageRef.current, false);
    }
  }, [immediate]);

  return {
    data,
    loading,
    error,
    pagination,
    allData,
    loadMore,
    goToPage,
    changePerPage,
    refetch,
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPrevPage,
    currentPage: pagination.currentPage,
    totalPages: pagination.lastPage,
    totalItems: pagination.total,
  };
};

export default useQueryPagination;