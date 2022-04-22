import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const history = useHistory();
  const changeInputPwd = useRef();
  const ctx = useContext(AuthContext);

  const summitPwdChangeHandler = (event) => {
    event.preventDefault();
    const changePwd = changeInputPwd.current.value;
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDe3GEQtw4pXd0YavxCb9QTKd4lgb2iC_I";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: ctx.token,
        password: changePwd,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      history.replace("/");
    });
  };

  return (
    <form className={classes.form} onSubmit={summitPwdChangeHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={changeInputPwd} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
