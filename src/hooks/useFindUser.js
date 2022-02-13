import { useState, useEffect } from "react";
import axios from "axios";

export default function useFindUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function findUser() {
      if (localStorage.getItem("token")) {
        axios.interceptors.request.use(function (config) {
          const token = localStorage.getItem("token");
          config.headers.Authorization = token;
          return config;
        });
      }
      await axios
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((err) => {
          //console.log(err);
          setLoading(false);
        });
    }
    findUser();
  }, []);

  return {
    user,
    setUser,
    isLoading,
  };
}
