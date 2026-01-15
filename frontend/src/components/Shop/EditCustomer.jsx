import React, { useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const EditCustomer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [customerType, setCustomerType] = useState("regular");
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  // Search for customers by name or phone number
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return toast.error("Enter a name or phone number");
    }

    try {
      setLoading(true);
      const isNumber = /^\d+$/.test(searchTerm.trim());
      const params = isNumber
        ? { phoneNumber: searchTerm.trim() }
        : { name: searchTerm.trim() };

      const { data } = await axios.get(`${server}/customer/search-customer`, {
        params,
        withCredentials: true,
      });

      if (!data.customers || data.customers.length === 0) {
        setCustomers([]);
        toast.error("No customers found");
        return;
      }

      setCustomers(data.customers);
    } catch (error) {
      setCustomers([]);
      toast.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Select a customer from search results
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setName(customer.name || "");
    setPhoneNumber(customer.phoneNumber || "");
    setAddress(customer.address || "");
    setCustomerType(customer.customerType || "regular");

    const mappedProducts =
      Array.isArray(customer.products) && customer.products.length > 0
        ? customer.products.map((p) => ({
            productName: p.productName || "",
            quantity: p.quantity || 0,
            price: p.price || "",
          }))
        : [{ productName: "", quantity: 0, price: "" }];

    setProducts(mappedProducts);

    setCustomers([]);
  };

  // Update product info
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];

    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]:
        field === "quantity" || field === "price" ? Number(value) : value,
    };

    setProducts(updatedProducts);
  };

  // Update customer details
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !phoneNumber || !address) {
      return toast.error("Name, phone number and address are required");
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${server}/customer/edit-customer`,
        {
          name,
          phoneNumber,
          address,
          customerType,
          products, // send at least one product
          id: selectedCustomer._id,
        },
        { withCredentials: true }
      );

      setSelectedCustomer(data.customer);
      toast.success("Customer updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-cyan-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-center text-2xl font-extrabold text-sky-700">
          Search & Edit Customer
        </h2>

        {/* SEARCH */}
        {!selectedCustomer && (
          <>
            <div className="flex gap-2 mt-6">
              <input
                type="text"
                placeholder="Search by name or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {customers.length > 0 && (
              <div className="mt-4 border rounded-lg divide-y">
                {customers.map((cust) => (
                  <div
                    key={cust._id}
                    onClick={() => handleSelectCustomer(cust)}
                    className="p-3 cursor-pointer hover:bg-sky-50"
                  >
                    <p className="font-medium">{cust.name}</p>
                    <p className="text-sm text-gray-500">{cust.phoneNumber}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* EDIT FORM */}
        {selectedCustomer && (
          <form className="space-y-5 mt-6" onSubmit={handleUpdate}>
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full border rounded-lg px-4 py-3 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Customer Type</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 text-sm"
              >
                <option value="regular">Regular</option>
                <option value="non-regular">Non-Regular</option>
              </select>
            </div>
            {/* PRODUCTS */}
            <div>
              <label className="text-sm font-medium">Products</label>
              {products.map((product, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 mb-4 p-3 border rounded-lg items-end"
                >
                  {/* Product Name Dropdown - wider */}
                  <select
                    value={product.productName}
                    onChange={(e) =>
                      handleProductChange(index, "productName", e.target.value)
                    }
                    className="col-span-6 border rounded-lg px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select Product</option>
                    <option value="20 liter water bottle">
                      20 liter water bottle
                    </option>
                    <option value="chilled water jar">Chilled water jar</option>
                  </select>

                  {/* Quantity - narrower */}
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                    placeholder="Quantity"
                    className="col-span-3 border rounded-lg px-3 py-2 text-sm"
                    required
                  />

                  {/* Price - narrower */}
                  <input
                    type="number"
                    min="0"
                    value={product.price}
                    onChange={(e) =>
                      handleProductChange(index, "price", e.target.value)
                    }
                    placeholder="Price"
                    className="col-span-3 border rounded-lg px-3 py-2 text-sm appearance-none"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold hover:scale-105 transition"
              >
                {loading ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Back
              </button>
            </div>
          </form>
        )}

        <Link
          to="/admin"
          className="block text-center text-sm text-sky-600 mt-6 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default EditCustomer;
