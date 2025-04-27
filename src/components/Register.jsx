import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">TOKO ILHAM</h1>
      <p className="text-center mb-4 font-semibold text-lg">Daftar Akunmu</p>

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
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="your username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">No. Phone</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="08xxxxxx"
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

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="********"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600 font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;
