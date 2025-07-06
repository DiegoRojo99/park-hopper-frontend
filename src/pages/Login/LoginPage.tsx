import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        handleRedirect();
      } 
      else {
        await createUserWithEmailAndPassword(auth, email, password);
        handleRedirect();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleRedirect();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-light-background dark:bg-dark-background p-4 mx-auto">
      <img src="/undraw/theme-park.svg" alt="Theme Park" className="w-64 mx-auto mb-6" />
      <div className="">
        <h2 className="text-2xl font-bold mb-6 text-center text-light-primary dark:text-dark-primary">{isLogin ? "Log In" : "Sign Up"}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded bg-[#f2f5ff] dark:bg-[#f2f5ff] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded bg-[#f2f5ff] dark:bg-[#f2f5ff] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg cursor-pointer shadow hover:bg-blue-600"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="my-4 text-center">or</div>

        <button
          onClick={handleGoogle}
          className="w-full bg-blue-700 text-white py-2 rounded-lg cursor-pointer shadow hover:bg-blue-600 flex items-center justify-center"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 underline">
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
