import React from "react";
import deliveryImg from "../Assests/images/delivery-man-delivering-bottles-water.jpg";

const Features = () => {
  const features = [
    {
      title: "Alkaline RO + UV Water Purification",
      desc: "Advanced RO + UV technology removes 99.9% bacteria and provides safe alkaline drinking water in Vishrantwadi Pune.",
    },
    {
      title: "Mineral-Rich & Balanced pH Water",
      desc: "Our alkaline water retains essential minerals and maintains ideal pH levels for healthy daily hydration.",
    },
    {
      title: "100% Hygienic 20L Water Cans",
      desc: "We follow multi-stage cleaning and sanitization for every jar to ensure safe drinking water delivery in Pune.",
    },
    {
      title: "Fast Home & Office Delivery",
      desc: "Reliable drinking water delivery service in Vishrantwadi (411015) for homes, offices, and commercial spaces.",
    },
  ];

  return (
    <div id="whychoose" className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Image */}
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <img
              className="img-fluid w-100 rounded"
              src={deliveryImg}
              alt="Drinking Water Delivery in Vishrantwadi Pune 20 Litre Water Can Service Om Sai Aqua"
            />
          </div>

          {/* Content */}
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
            <p className="fw-medium text-uppercase text-primary mb-2">
              Why Choose Om Sai Aqua – Best Water Supplier in Pune?
            </p>

            <h1 className="display-5 mb-3">
              Alkaline RO Drinking Water Delivery in Vishrantwadi Pune (411015)
            </h1>

            {/* ✅ SEO Paragraph */}
            <p className="mb-4">
              Looking for a <strong>drinking water delivery near you</strong>?
              Om Sai Aqua provides{" "}
              <strong>
                alkaline RO + UV purified water in Vishrantwadi Pune
              </strong>
              with fast home delivery of <strong>20 litre water cans</strong>{" "}
              for homes, offices, and shops. We ensure safe, hygienic, and
              mineral-rich drinking water for daily use.
            </p>

            {/* Features */}
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
