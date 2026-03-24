import React from "react";
import logo from "../Assests/images/water-delivery-om-sai-aqua-vishrantwadi-pune.jpg";

const About = () => {
  return (
    <div id="aboutus" className="container-xxl py-5">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="row gx-3 h-100">
              <div className="col-12 align-self-start">
                <img
                  className="img-fluid rounded"
                  alt="Alkaline Water Delivery Om Sai Aqua Vishrantwadi Pune"
                  src={logo}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
            <p className="fw-medium text-uppercase text-primary mb-2">
              About Us
            </p>
            <h1 className="display-5 mb-4">
              Premium Alkaline RO + UV Drinking Water in Vishrantwadi
            </h1>
            <p className="mb-4">
              At Om Sai Aqua, we believe pure drinking water is the foundation
              of a healthy life. Located in 411015, Pune, we specialize in
              providing safe, hygienic, and mineral-enriched water for homes and
              offices. Our advanced technology removes contaminants while
              retaining essential minerals and maintaining an ideal pH balance.
            </p>
            <div className="d-flex align-items-center mb-4">
              <div className="flex-shrink-0 bg-primary p-4">
                <h1 className="display-2 text-white">We</h1>
                <h5 className="text-white">Deliver Pure</h5>
                <h5 className="text-white">RO Water</h5>
              </div>
              <div className="ms-4">
                <p>
                  <i className="fa fa-check text-primary me-2"></i>Home Delivery
                </p>
                <p>
                  <i className="fa fa-check text-primary me-2"></i>Corporate
                  Offices
                </p>
                <p>
                  <i className="fa fa-check text-primary me-2"></i>Commercial
                  Hubs
                </p>
                <p className="mb-0">
                  <i className="fa fa-check text-primary me-2"></i>Serving Pune
                  411015
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
