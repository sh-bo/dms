import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeRole = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const token = localStorage.getItem("tokenKey");

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/employee/role-is-null`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/RoleMaster/findActiveRole`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setSelectedUser(userId);
    setSelectedRole(newRole);
    setModalVisible(true); // Show the confirmation modal
  };

  const confirmRoleAssignment = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/employee/employee/${selectedUser}/role`, // Use selectedUser ID
        { roleName: selectedRole }, // Send roleName in the request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Role updated successfully:", response.data);
      fetchUsers(); // Refresh user list after role update
      setModalVisible(false);
      setSelectedUser(null);
      setSelectedRole("");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-2 text-left">SR.</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Mobile No.</th>
              <th className="border p-2 text-left">Branch</th>
              <th className="border p-2 text-left">Department</th>
              <th className="border p-2 text-left">Created Date</th>
              <th className="border p-2 text-left">Created By</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Assign Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.mobile}</td>
                  <td className="border p-2">{user.branch?.name || "N/A"}</td>
                  <td className="border p-2">
                    {user.department?.name || "N/A"}
                  </td>
                  <td className="border p-2">{formatDate(user.createdOn)}</td>
                  <td className="border p-2">
                    {user.createdBy.name || " "}
                  </td>
                  <td className="border p-2">
                    {user.employeeType || "No Role"}
                  </td>
                  <td className="border p-2">
                    <select
                      value={selectedUser === user.id ? selectedRole : ""}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.role}>
                          {role.role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border p-2 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Role Assignment
            </h2>
            <p className="mb-4">
              Are you sure you want to assign the role{" "}
              <strong>{selectedRole}</strong> to{" "}
              <strong>
                {users.find((user) => user.id === selectedUser)?.name}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-300 p-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleAssignment}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRole;