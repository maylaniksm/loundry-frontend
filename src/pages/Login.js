import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import FormInput from "./../components/FormInput";
import CTA from "./../components/CTA";
import Prompt from "./../components/Prompt";
import Error from "./../components/Error";
import useForm from "./../hooks/useForm";
import useAuth from "./../hooks/useAuth";

export default function Login() {
  const { values, handleChange } = useForm({ 
    //handechange menyimpan variable yg ada di form //diambil dari hooks/UseForm
    initialValues: {
      username: "",
      password: "",
    },
  });
  const [navigateHome, setNavigateHome] = useState(<></>);
  const { loginUser, error } = useAuth();

  const handleLogin = async (e) => { //handle login proses masuk
    e.preventDefault();
    let loggedin = await loginUser(values);
    if (loggedin) {
      setNavigateHome(<Navigate to="/home"></Navigate>); //kalo login true masuknya di halaman home
    }
  };

  return (
    <div className="container-fuid vh-100">
      <div className="row w-100 h-100">
        <div className="col-md-4">
          <div className="d-flex h-100 align-items-center">
            <div className="text-center p-5">
              <h3>L O U N D R Y</h3>
              <div className="inlineForm__notif">
                {error && (
                  <Error
                    error={error.data.message ?? "Terjadi Kesalahan Server"}
                  />
                )}
              </div>
              <form onSubmit={handleLogin}>
                <FormInput
                  type={"text"}
                  placeholder={"Username"}
                  name={"username"}
                  value={values.username}
                  handleChange={handleChange}
                />
                <FormInput
                  type={"password"}
                  placeholder={"Password"}
                  name={"password"}
                  value={values.password}
                  handleChange={handleChange}
                />
                <div>
                  <CTA name={"login"} type={"submit"} />
                  <Link to="/register" className="text-dark">
                    {/* <Prompt prompt={" Create one."} /> */}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <img className="w-100" src="https://webadmin.yourpay.co/wp-content/uploads/2021/06/cropped-unrecognizable-woman-doing-laundry-holding-linen-basket.jpg"></img>
        </div>
      </div>
      {navigateHome}
    </div>
  );
}
