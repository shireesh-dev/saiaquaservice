import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers, deleteCustomer } from "../../redux/actions/customer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllCustomers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const { customers, loading, error, successMessage } = useSelector(
    (state) => state.customer
  );

  // Fetch all customers on mount
  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Show success toast
  useEffect(() => {
    if (successMessage) toast.success(successMessage);
  }, [successMessage]);

  // Filter customers whenever search term or customers change
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCustomers(customers);
    } else {
      const term = search.toLowerCase();
      setFilteredCustomers(
        customers.filter(
          (c) =>
            (c.name && c.name.toLowerCase().includes(term)) ||
            (c.phoneNumber && c.phoneNumber.includes(term))
        )
      );
    }
  }, [search, customers]);

  // Delete customer
  const handleDelete = (customerId, customerName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${customerName}?`
    );
    if (!confirmDelete) return;

    dispatch(deleteCustomer(customerId));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">
          All Customers
        </h2>

        {/* Search & Cancel */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-80 flex-1"
          />
          <button
            onClick={() => setSearch("")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Clear
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>

        {/* Customers Table */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No customers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Address
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Customer Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Products
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((c) => (
                  <tr
                    key={c._id}
                    className="bg-white sm:bg-white mb-4 sm:mb-0 block sm:table-row"
                  >
                    <td className="px-4 py-2 block sm:table-cell text-sm font-medium text-gray-800">
                      {c.name}
                    </td>
                    <td className="px-4 py-2 block sm:table-cell text-sm text-gray-600">
                      {c.phoneNumber}
                    </td>
                    <td className="px-4 py-2 block sm:table-cell text-sm text-gray-600">
                      {c.address || "-"}
                    </td>
                    <td className="px-4 py-2 block sm:table-cell text-sm text-gray-600">
                      {c.customerType || "-"}
                    </td>
                    {/* Products Column */}
                    <td className="px-4 py-2 block sm:table-cell text-sm text-gray-600">
                      {Array.isArray(c.products) && c.products.length > 0 ? (
                        <ul className="list-disc ml-4 space-y-1">
                          {c.products.map((p, index) => (
                            <li key={index}>
                              {p.productName} - Qty: {p.quantity} -{" "}
                              <span className="font-bold">₹{p.price}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(c._id, c.name)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
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

export default AllCustomers;
