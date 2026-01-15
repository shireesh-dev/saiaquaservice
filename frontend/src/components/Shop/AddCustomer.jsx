import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AddCustomer = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [customerType, setCustomerType] = useState("non-regular");
  const [products, setProducts] = useState([
    {
      productName: "20 liter water bottle",
      quantity: 1,
      price: "",
    },
  ]);

  // ✅ Update product
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  // ✅ Add product
  const addProduct = () => {
    setProducts([
      ...products,
      { productName: "20 liter water bottle", quantity: 1, price: "" },
    ]);
  };

  // ✅ Remove product
  const removeProduct = (index) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${server}/customer/create-customer`,
        {
          name,
          phoneNumber,
          address,
          customerType,
          products,
        },
        {
          withCredentials: true, // ✅ MUST be third argument
        }
      );

      toast.success(res.data.message);
      setName("");
      setPhoneNumber("");
      setAddress("");
      setCustomerType("");
      setProducts([
        {
          productName: "20 liter water bottle",
          quantity: 1,
          price: "",
        },
      ]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-cyan-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Title */}
        <h2 className="text-center text-2xl font-extrabold text-sky-700">
          Register Your Details
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          For fast & reliable water delivery 🚚
        </p>

        {/* Form */}
        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              required
              placeholder="Flat / Society / Area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Type
            </label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm 
      focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="non-regular">Non-Regular</option>
              <option value="regular">Regular</option>
            </select>
          </div>

          {/* Products Details */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Products
            </label>

            {products.map((product, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 space-y-3 bg-gray-50 relative"
              >
                {/* Remove Button */}
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="absolute top-2 right-2 text-red-500 text-xs"
                  >
                    ✕ Remove
                  </button>
                )}

                {/* Product Name */}
                <select
                  value={product.productName}
                  onChange={(e) =>
                    handleProductChange(index, "productName", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm bg-white"
                >
                  <option value="20 liter water bottle">
                    20 Liter Water Bottle
                  </option>
                  <option value="chilled water jar">Chilled Water Jar</option>
                </select>

                {/* Quantity & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Price / Unit
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={product.price}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "price",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      placeholder="Enter price"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Product Button */}
            <button
              type="button"
              onClick={addProduct}
              className="w-full py-2 rounded-lg border border-dashed border-emerald-500 text-emerald-600 font-semibold text-sm"
            >
              + Add Another Product
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-500 
               text-white font-semibold text-sm shadow-md active:scale-95 transition"
            >
              Register Now
            </button>

            {/* Cancel */}
            <Link
              to="/admin"
              className="w-full py-3 rounded-lg border border-sky-500 text-sky-600 
               font-semibold text-sm text-center hover:bg-sky-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
