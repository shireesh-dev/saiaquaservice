import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllContacts,
  deleteContact,
  updateContactStatus,
} from "../../redux/actions/contact";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllContacts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  const { contacts, loading, error, successMessage } = useSelector(
    (state) => state.contact
  );

  // Fetch all contacts
  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  // Error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Success toast
  useEffect(() => {
    if (successMessage) toast.success(successMessage);
  }, [successMessage]);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredContacts(contacts);
    } else {
      const term = search.toLowerCase();
      setFilteredContacts(
        contacts.filter(
          (c) =>
            (c.name && c.name.toLowerCase().includes(term)) ||
            (c.phoneNumber && c.phoneNumber.includes(term))
        )
      );
    }
  }, [search, contacts]);

  // Delete contact
  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
    if (!confirmDelete) return;

    dispatch(deleteContact(id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">
          All Contacts
        </h2>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-80"
          />

          <button
            onClick={() => setSearch("")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Clear
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredContacts.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No contacts found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-2 font-medium">{c.name}</td>

                    <td className="px-4 py-2">{c.phoneNumber}</td>

                    <td className="px-4 py-2 max-w-xs truncate">{c.message}</td>

                    <td className="px-4 py-2">
                      <select
                        value={c.status || "new"}
                        onChange={(e) =>
                          dispatch(updateContactStatus(c._id, e.target.value))
                        }
                        className={`px-2 py-1 rounded text-xs border ${
                          c.status === "new"
                            ? "bg-yellow-100 text-yellow-700"
                            : c.status === "contacted"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(c._id, c.name)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllContacts;
