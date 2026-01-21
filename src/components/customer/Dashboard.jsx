import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Produk Section Header with See More */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Produk</h2>
          <a
            href="/products"
            className="text-white bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-1 rounded transition-colors duration-150"
            style={{ textDecoration: "none" }}
          >
            See more
          </a>
        </div>

        {/* Produk Cards Example */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Contoh produk, ganti dengan map data produk jika sudah ada */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
              alt="Buku Tulis"
              className="w-24 h-24 object-cover mb-2 rounded"
            />
            <div className="font-bold text-lg">Buku Tulis</div>
            <div className="text-gray-500 text-sm mb-1">Buku untuk catatan</div>
            <div className="font-bold text-blue-700 mb-2">Rp 5000.00</div>
            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308"
              alt="Gunting"
              className="w-24 h-24 object-cover mb-2 rounded"
            />
            <div className="font-bold text-lg">Gunting</div>
            <div className="text-gray-500 text-sm mb-1">
              Alat Memotong Kertas
            </div>
            <div className="font-bold text-blue-700 mb-2">Rp 10000.00</div>
            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
              alt="Pensil 2B"
              className="w-24 h-24 object-cover mb-2 rounded"
            />
            <div className="font-bold text-lg">Pensil 2B</div>
            <div className="text-gray-500 text-sm mb-1">
              Pensil untuk menulis dan menggambar
            </div>
            <div className="font-bold text-blue-700 mb-2">Rp 2500.00</div>
            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca"
              alt="Pulpen Hitam"
              className="w-24 h-24 object-cover mb-2 rounded"
            />
            <div className="font-bold text-lg">Pulpen Hitam</div>
            <div className="text-gray-500 text-sm mb-1">
              Pulpen untuk menulis
            </div>
            <div className="font-bold text-blue-700 mb-2">Rp 3000.00</div>
            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        </div>

        {userData ? (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {userData.username}
            </h2>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
