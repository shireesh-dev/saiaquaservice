import React from "react";

import img1 from "../Assests/images/TimeBoundService.jpg";
import img2 from "../Assests/images/full-loadpart.jpg";
import img3 from "../Assests/images/flatbed-trailers.jpg";
const Services = () => {
  const services = [
    { title: "Homes Delivery", img: img1 },
    { title: "Functional Program", img: img2 },
    { title: "Offices Delivery", img: img3 },
  ];

  return (
    <div id="service" className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto pb-4" style={{ maxWidth: "600px" }}>
          <p className="fw-medium text-uppercase text-primary mb-2">
            Our Services
          </p>
          <h1 className="display-5 mb-4">Water Solutions for Every Need</h1>
        </div>

        <div className="row gy-5 gx-4">
          {services.map((s, i) => (
            <div key={i} className="col-md-6 col-lg-4 wow fadeInUp">
              <div className="service-item bg-light p-4 rounded text-center">
                <img
                  className="img-fluid mb-4 rounded"
                  src={s.img}
                  alt={s.title}
                />
                <h3 className="mb-3">{s.title}</h3>
                <p>Reliable 20L jar supply for the Vishrantwadi area.</p>
                <a className="btn btn-primary" href="#contactus">
                  Order Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
