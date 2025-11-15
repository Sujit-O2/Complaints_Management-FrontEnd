import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regNo, setRegNo] = useState("");

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setMessage("");
  };

  // Helper function to read cookie by name
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = isSignup
        ? "http://localhost:8080/user/signup"
        : "http://localhost:8080/user/login";

      const body = isSignup
        ? { username: fullName, email: email.trim(), password: password.trim(), regiNo: regNo.trim(), role: "student" }
        : { mail: email.trim(), password: password.trim() };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include", 
      });

      if (!res.ok) throw new Error(await res.text());

      if (isSignup) {
        setMessage("✅ Account created successfully!");
        setTimeout(() => setIsSignup(false), 1500);
      } else {
        setMessage("✅ Login successful!");

        const role = getCookie("role");
        console.log(role);



        setTimeout(() => {
          if (role === "admin") {
            navigate("/admindashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1200);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Request failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-8 transition-all">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-1">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isSignup
            ? "Join as a student to continue"
            : "Login to your existing account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="text"
                placeholder="Registration Number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 font-semibold rounded-xl text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
            }`}
          >
            {loading
              ? isSignup
                ? "Creating..."
                : "Logging in..."
              : isSignup
              ? "Sign Up"
              : "Login"}
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

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {isSignup ? "Already have an account?" : "Don’t have an account yet?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-blue-600 font-medium hover:underline"
            >
              {isSignup ? "Login here" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
