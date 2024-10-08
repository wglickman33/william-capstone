import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import Button from "../../components/Button/Button";
import loginIcon from "../../assets/icons/login.svg";
import emailIcon from "../../assets/icons/mail.svg";
import lockIcon from "../../assets/icons/lock.svg";
import unlockIcon from "../../assets/icons/unlock.svg";
import "./LoginForm.scss";

const LoginForm = () => {
  const { loginUser, currentUser, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
    } catch (err) {
      setFormError(error || "Failed to log in. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/items");
    }
  }, [currentUser, navigate]);

  return (
    <section className="login">
      <div className="login__content">
        <div className="login__header-container">
          <h1 className="login__header">LOGIN</h1>
        </div>
        <div className="login__form-container">
          <form className="login__form" id="loginForm" onSubmit={handleSubmit}>
            {formError && <p className="login__error">{formError}</p>}
            <label className="login__form-label" htmlFor="email">
              Enter Email
              <input
                className="login__form-input"
                type="email"
                id="email"
                name="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <img
                className="login__mail-icon"
                src={emailIcon}
                alt="email icon"
              />
            </label>
            <label className="login__form-label" htmlFor="password">
              Enter Password
              <input
                className="login__form-input"
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                className={`login__lock-icon ${
                  isPasswordVisible ? "unlock" : ""
                }`}
                src={isPasswordVisible ? unlockIcon : lockIcon}
                alt={isPasswordVisible ? "unlock icon" : "lock icon"}
                onClick={togglePasswordVisibility}
              />
            </label>
            <div className="login__forgot-container">
              <label className="login__save-login" htmlFor="saveLogin">
                <input
                  className="login__save-login-checkbox"
                  type="checkbox"
                  id="saveLogin"
                  name="saveLogin"
                />{" "}
                Save Login Information{" "}
              </label>
              <Link className="login__forgot-link">Forgot Password?</Link>
            </div>
            <div className="login__button-container">
              <Button className="button--login" type="submit">
                <img
                  className="login__login-icon hover-invert"
                  src={loginIcon}
                  alt="login icon"
                />
                LOGIN
              </Button>
            </div>
            <p className="login__create-account">
              Don't have an account?{" "}
              <Link to="/create-account" className="login__create-account-link">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
