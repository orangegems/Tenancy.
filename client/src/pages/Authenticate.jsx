import React, { useState } from "react";
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";

export function Authenticate(props) {
  const { setAuthDisplay, setUserData, position } = props;
  const [displayLogin, setDisplayLogin] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const handleSubmit = async function (source, data) {
    event.preventDefault();
    console.log(data);
    await fetch(`/auth/${source}`, {
      method: "POST",
      body: JSON.stringify(data),
      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (res.status === 401 && source === "login") {
          setLoginError(true);
          setLoginErrorMessage("Username or password is not correct.");
        } else if (res.status === 200) {
          setAuthDisplay(false);
          return res.json();
        } else {
          console.log("status not 200 in handle submit --> ", res);
        }
      })
      .then((json) => {
        setUserData(json);
        console.log(json);
      })
      .catch((err) => {
        console.log("Error from hadleSubmit --> ", err);
      });
  }

  return (
    <div id="loginSignup" style={position}>
      {displayLogin && (
        <Login
          userData={props.userData}
          loginErrorMessage={loginErrorMessage}
          loginError={loginError}
          handleSubmit={handleSubmit}
          setAuthDisplay={setAuthDisplay}
          setDisplayLogin={setDisplayLogin}
        />
      )}
      {!displayLogin && (
        <Signup
          handleSubmit={handleSubmit}
          setAuthDisplay={setAuthDisplay}
          setDisplayLogin={setDisplayLogin}
        />
      )}
    </div>
  );
}
