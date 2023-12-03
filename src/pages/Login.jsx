import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessages] = useState([]); // New state variable
  const navigate = useNavigate();

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const addMessage = ({ message, type }) => {
    console.log("function still worked after component unmounts")
    setErrorMessages((prevErrorMessages) => {
      console.log(" setErrorMessages function still worked after component unmounts")
      const messageId = Date.now();
      const updatedErrorMessages = [...prevErrorMessages, { id: messageId, message, messageType: type }]
      // remove the elements after 5 seconds
      setTimeout(() => {
        console.log("setTimeout still worked after component unmounts")
        setErrorMessages((prevErrorMessages) => prevErrorMessages.filter(message => message.id !== messageId))

      }, 5000);
      return updatedErrorMessages
    })
  }

  const addSuccessMessage = (message) => addMessage({ message, type: "success" });
  const addErrorMessage = (message) => addMessage({ message, type: "error" });

  useEffect(() => {
    // Set the document title
    document.title = "Login Page";

    // Clean up the effect
    return () => {
      // Reset the document title when the component unmounts
      document.title = "Dhum Jam";
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const { password } = formData;
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      const response = await fetch("https://stg.dhunjam.in/account/admin/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (response.ok) {
        addSuccessMessage("success")
        const id = responseData.data.id;
        // Navigate to the AdminDashboard with the extracted data
        navigate(`/admin/dashboard/${id}`);
      }
      else {
        const errorMessage = responseData.ui_err_msg;
        throw new Error(errorMessage); // Throw an error for unsuccessful login attempts
      }
    } catch (error) {
      addErrorMessage(error.message)
    }
  }

  return (
    <>
      <div className="error-container">
        {errorMessage.map((item, index) => (
          <div className={item.messageType === "error" ? "error card" : "success card"} key={index}>
            {item.message}
          </div>
        ))}

      </div>
      <h1>Venue Admin Login</h1>
      <form className="login-form">
        <input
          className="login-form-inputs"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <div className="wrapper">

          <input
            className="login-form-inputs"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <FontAwesomeIcon
            className="see-password"
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
          />
        </div>
        <button className="signIn-btn" type="submit" onClick={handleSubmit}>Sign in</button>
      </form>
      <p>New Register ?</p>
    </>
  );
}

