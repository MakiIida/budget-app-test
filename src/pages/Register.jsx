import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setIsAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rekisteröinti epäonnistui.");
      }

      localStorage.setItem("token", data.token);
      setIsAuthenticated(true); // ✅ Päivitetään tila heti
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Rekisteröidy</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nimi" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Sähköposti" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Rekisteröidy</button>
      </form>
    </div>
  );
};

export default Register;
