import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "../../redux/actions/customer";
import { createDeposit } from "../../redux/actions/deposit";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";

const AllDeposits = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [depositData, setDepositData] = useState({}); // store per customer input
  const [balances, setBalances] = useState({});
  const [lastDeposits, setLastDeposits] = useState({});

  const { customers, loading } = useSelector((state) => state.customer);
  const { error, successMessage } = useSelector((state) => state.deposit);

  // fetch customers
  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  // toast handling
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      // ✅ CLEAR after showing toast
      dispatch({ type: "CLEAR_MESSAGES" });
    }
  }, [successMessage, dispatch]);

  // search filter
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

  useEffect(() => {
    const fetchDepositData = async () => {
      try {
        const balanceObj = {};
        const lastDepositObj = {};

        await Promise.all(
          customers.map(async (c) => {
            // balance
            const balanceRes = await axios.get(
              `${server}/deposit/balance/${c._id}`,
              { withCredentials: true }
            );
            balanceObj[c._id] = balanceRes.data.balance;

            // deposits list (for last date)
            const depositsRes = await axios.get(
              `${server}/deposit/customer/${c._id}`,
              { withCredentials: true }
            );

            if (depositsRes.data.deposits.length > 0) {
              lastDepositObj[c._id] = depositsRes.data.deposits[0].createdAt;
            }
          })
        );

        setBalances(balanceObj);
        setLastDeposits(lastDepositObj);
      } catch (err) {
        console.error(err);
      }
    };

    if (customers.length > 0) {
      fetchDepositData();
    }
  }, [customers]);

  // handle input change per row
  const handleInputChange = (id, field, value) => {
    setDepositData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // submit deposit
  const handleAddDeposit = async (customerId) => {
    const data = depositData[customerId];

    if (!data || !data.amount) {
      toast.error("Enter amount");
      return;
    }

    try {
      await dispatch(
        createDeposit({
          customer: customerId,
          amount: Number(data.amount),
          note: data.note || "",
        })
      );

      // ✅ fetch updated balance
      const balanceRes = await axios.get(
        `${server}/deposit/balance/${customerId}`,
        { withCredentials: true }
      );

      const depositsRes = await axios.get(
        `${server}/deposit/customer/${customerId}`,
        { withCredentials: true }
      );

      // ✅ update UI instantly
      setBalances((prev) => ({
        ...prev,
        [customerId]: balanceRes.data.balance,
      }));

      setLastDeposits((prev) => ({
        ...prev,
        [customerId]: depositsRes.data.deposits[0]?.createdAt || null,
      }));

      // reset input
      setDepositData((prev) => ({
        ...prev,
        [customerId]: { amount: "", note: "" },
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">
          Customer Deposits
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
            Back
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No customers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full border divide-y text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Balance</th>{" "}
                  {/* ✅ NEW */}
                  <th className="px-4 py-2 text-left">Last Deposit</th>{" "}
                  {/* ✅ NEW */}
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Note</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="px-4 py-2 font-medium">{c.name}</td>

                    <td className="px-4 py-2">{c.phoneNumber}</td>

                    {/* ✅ Balance */}
                    <td className="px-4 py-2 font-semibold text-green-600">
                      ₹ {balances[c._id] || 0}
                    </td>

                    {/* ✅ Last Deposit Date */}
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {lastDeposits[c._id]
                        ? new Date(lastDeposits[c._id]).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>

                    {/* ✅ Amount Input */}
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={depositData[c._id]?.amount || ""}
                        onChange={(e) =>
                          handleInputChange(c._id, "amount", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-28"
                      />
                    </td>

                    {/* ✅ Note Input */}
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Note"
                        value={depositData[c._id]?.note || ""}
                        onChange={(e) =>
                          handleInputChange(c._id, "note", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>

                    {/* ✅ Action */}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleAddDeposit(c._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Add
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

export default AllDeposits;
