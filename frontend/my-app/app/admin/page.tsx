"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        console.log(secureLocalStorage.getItem("token"));
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${secureLocalStorage.getItem("token")}`,
          },
        });

        const userList: any[] = [];
        const agentList: any[] = [];

        response.data.users_agents.forEach((user: any) => {
          if (user.role === "student") userList.push(user);
          if (user.role === "agent") agentList.push(user);
        });

        setUsers(userList);
        setAgents(agentList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  async function handleDelete(user_id: string) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin`, {
        user_id,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${secureLocalStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((user) => user._id !== user_id));
        setAgents((prev) => prev.filter((agent) => agent._id !== user_id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    }
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAgents = agents.filter((agent) =>
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-8 w-full">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Admin Panel</h1>

      <input
        type="text"
        placeholder="Search users and agents..."
        className="mb-6 p-3 border border-gray-300 rounded-lg w-3/4 md:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Students</h2>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center p-4 border-b last:border-none hover:bg-gray-100 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-700">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                  <p className="text-sm text-gray-500">
                    Interests: {user.interestedtags?.join(", ") || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No students found</p>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Agents</h2>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <div
                key={agent._id}
                className="flex justify-between items-center p-4 border-b last:border-none hover:bg-gray-100 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-700">{agent.email}</p>
                  <p className="text-sm text-gray-500">{agent.role}</p>
                  <p className="text-sm text-gray-500">
                    Interests: {agent.interestedtags?.join(", ") || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(agent._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No agents found</p>
          )}
        </div>
      </div>
    </div>
  );
}
