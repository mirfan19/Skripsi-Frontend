import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">TOKO ILHAM</h1>
      <p className="text-center mb-4 font-semibold text-lg">Login</p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email Address</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="********"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember Me
          </label>
          <a href="#" className="text-sm text-blue-600">
            Forgot Password?
          </a>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default Login;
