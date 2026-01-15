import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <div className="w-full">
      {/* profile */}

      <>
        <div className="w-full px-5">
          <div className="w-full 800px:flex block pb-3">
            <div className=" w-[100%] 800px:w-[50%]">
              <label className="block pb-2">Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className=" w-[100%] 800px:w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="text"
              className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full 800px:flex block pb-3">
            <div className=" w-[100%] 800px:w-[50%]">
              <label className="block pb-2">Phone Number</label>
              <input
                type="number"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          className="single_item flex items-center cursor-pointer w-full mb-8"
          onClick={logoutHandler}
        >
          <span
            className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
          >
            Log out
          </span>
        </div>
      </>
    </div>
  );
};

export default ProfileContent;
