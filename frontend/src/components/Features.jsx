import React from "react";
import deliveryImg from "../Assests/images/delivery-man-delivering-bottles-water.jpg";

const Features = () => {
  const features = [
    {
      title: "Alkaline RO + UV Tech",
      desc: "Balances pH levels and removes 99.9% of bacteria.",
    },
    {
      title: "Mineral-Rich Hydration",
      desc: "Retains essential minerals for better immunity.",
    },
    {
      title: "100% Hygienic Jars",
      desc: "Multi-stage sanitization before every refill.",
    },
    {
      title: "Timely Delivery",
      desc: "Guaranteed on-time service across Vishrantwadi area.",
    },
  ];

  return (
    <div id="whychoose" className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <img
              className="img-fluid w-100 rounded"
              src={deliveryImg}
              alt="Water Delivery Service"
            />
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
            <p className="fw-medium text-uppercase text-primary mb-2">
              Why Choose Om Sai Aqua?
            </p>
            <h1 className="display-5 mb-4">Pure Water, Better Life!</h1>
            <div className="row gy-4">
              {features.map((f, i) => (
                <div key={i} className="col-12">
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary text-white">
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="ms-4">
                      <h4>{f.title}</h4>
                      <span>{f.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
