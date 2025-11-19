import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regNo, setRegNo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
          regiNo: regNo.trim(),
          role: "admin",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage("✅ Admin account created successfully!");

      // Redirect after success
      setTimeout(() => {
        navigate("/auth");
      }, 1200);

    } catch (err: any) {
      setMessage(`❌ ${err.message || "Signup failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-8 transition-all">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-1">
          Admin Sign Up
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create a new admin account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
          />

          <input
            type="text"
            placeholder="Admin Registration Number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            required
            className="w-full px-4 py-2 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
          />

          <input
            type="email"
            placeholder="Admin Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 font-semibold rounded-xl text-white transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminSignupPage;
