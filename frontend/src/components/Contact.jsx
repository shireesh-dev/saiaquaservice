import React, { useState } from "react";
import axios from "axios";
import { server } from "../server"; // adjust path if needed
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${server}/contact/create-contact`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(data.message || "Request sent successfully");

      // ✅ reset form
      setForm({
        name: "",
        phoneNumber: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contactus" className="container-xxl bg-light py-5">
      <div className="container">
        <div className="row g-5">
          {/* LEFT SIDE */}
          <div className="col-lg-6">
            <p className="fw-medium text-uppercase text-primary mb-2">
              Contact Us
            </p>
            <h1 className="display-5 mb-4">
              Need a Quick Delivery? Contact Us Today
            </h1>

            <div className="d-flex mb-3">
              <i className="fa fa-phone-alt text-primary me-3"></i>
              <span>+91 9552989143 / +91 9630969994</span>
            </div>

            <div className="d-flex mb-3">
              <i className="fa fa-map-marker-alt text-primary me-3"></i>
              <span>Anand Park, Dhanori Road, Vishrantwadi, Pune – 411015</span>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="col-lg-6">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* NAME */}
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control p-3"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* PHONE */}
                <div className="col-md-6">
                  <input
                    type="tel"
                    className="form-control p-3"
                    placeholder="Your Phone Number"
                    required
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                  />
                </div>

                {/* MESSAGE */}
                <div className="col-12">
                  <textarea
                    className="form-control p-3"
                    placeholder="Message"
                    rows="5"
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  ></textarea>
                </div>

                {/* BUTTON */}
                <div className="col-12">
                  <button
                    className="btn btn-primary py-3 px-5 w-100"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
