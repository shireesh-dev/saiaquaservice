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
              About Om Sai Aqua
            </p>

            <h1 className="display-5 mb-4">
              Best Alkaline RO + UV Drinking Water Supplier in Vishrantwadi,
              Pune (411015)
            </h1>

            <p className="mb-4">
              At <strong>Om Sai Aqua</strong>, we provide{" "}
              <strong>
                premium alkaline RO + UV drinking water in Vishrantwadi, Pune
                (411015)
              </strong>{" "}
              for homes, offices, and commercial spaces. If you are searching
              for <strong>drinking water delivery near me</strong>,{" "}
              <strong>RO water supplier in Pune</strong>, or{" "}
              <strong>20 litre water can delivery in Vishrantwadi</strong>, we
              offer reliable and hygienic solutions.
            </p>

            <p className="mb-4">
              Our advanced <strong>RO + UV water purification system</strong>{" "}
              removes harmful contaminants, bacteria, and impurities while
              retaining essential minerals. We ensure{" "}
              <strong>safe, mineral-rich alkaline drinking water</strong> with
              balanced pH levels, making it ideal for daily consumption and
              healthy living.
            </p>

            <p className="mb-4">
              We specialize in{" "}
              <strong>fast home delivery of drinking water in Pune</strong>,
              including <strong>20L water cans</strong>, bulk supply for
              offices, and regular delivery services. As a trusted{" "}
              <strong>water supplier in Vishrantwadi</strong>, we focus on
              quality, timely service, and customer satisfaction.
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
                  <i className="fa fa-check text-primary me-2"></i>Serving
                  vishrantwadi,Dhonari 411015
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
