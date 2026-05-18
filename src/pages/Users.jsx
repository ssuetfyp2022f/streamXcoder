import React, { useState } from "react";
import { getUsers } from "../api/users.api";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
      users.map((user, index) =>
        console.log(user.role)
    )
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-14 m-14">
      <button
        onClick={fetchUsers}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        View Users
      </button>

      <div className="mt-6">
        {users.map((user, index) => (
          <div
            key={index}
            className="p-3 border rounded mb-2"
          >
            {user.displayName}
            {user.role}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;