import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function useAuth() {
  let history = useHistory();
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState(null);

  //set user
  const setUserContext = async () => {
    return await axios
      .get("/me")
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
        history.push("/home");
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  //register user
  const registerUser = async (data) => {
    console.log(data);
    const { username, email, password, passwordConfirm } = data;
    return axios
      .post(`auth/register`, {
        username,
        email,
        password,
        passwordConfirm,
      })
      .then(async () => {
        await setUserContext();
      })
      .catch((err) => {
        return setError(err.response.data);
      });
  };

  //login user
  const loginUser = async (data) => {
    const { username, password } = data;
    return axios
      .post("auth/", {
        username,
        password,
      })
      .then(async (res) => {
        localStorage.setItem("token", res.data.token);
        axios.interceptors.request.use(function (config) {
          const token = store.getState().session.token;
          config.headers.Authorization = token;
          return config;
        });
        await setUserContext();
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  return {
    registerUser,
    loginUser,
    error,
  };
}
