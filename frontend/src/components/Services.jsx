import React from "react";

import img1 from "../Assests/images/TimeBoundService.jpg";
import img2 from "../Assests/images/full-loadpart.jpg";
import img3 from "../Assests/images/flatbed-trailers.jpg";

const Services = () => {
  const services = [
    {
      title: "Home Drinking Water Delivery",
      desc: "Fast and reliable 20 litre water can delivery for homes in Vishrantwadi Pune (411015). Safe and hygienic alkaline RO drinking water at your doorstep.",
      img: img1,
    },
    {
      title: "Water Supply for Events & Functions",
      desc: "Bulk drinking water supply for functions, parties, and events in Pune. Affordable and timely delivery of purified water.",
      img: img2,
    },
    {
      title: "Office & Commercial Water Supply",
      desc: "Regular water delivery service for offices, shops, and businesses in Vishrantwadi Pune with consistent and on-time supply.",
      img: img3,
    },
  ];

  return (
    <div id="service" className="container-xxl py-5">
      <div className="container">
        {/* Heading */}
        <div className="text-center mx-auto pb-4" style={{ maxWidth: "700px" }}>
          <p className="fw-medium text-uppercase text-primary mb-2">
            Our Water Delivery Services in Pune
          </p>

          <h1 className="display-5 mb-3">
            20 Litre Drinking Water Delivery in Vishrantwadi Pune (411015)
          </h1>

          <p className="text-muted">
            Om Sai Aqua offers alkaline RO drinking water delivery for homes,
            offices, and events. Looking for a water supplier near you? We
            provide fast, hygienic, and affordable water delivery service in
            Vishrantwadi and nearby areas.
          </p>
        </div>

        {/* Services */}
        <div className="row gy-5 gx-4">
          {services.map((s, i) => (
            <div key={i} className="col-md-6 col-lg-4 wow fadeInUp">
              <div className="service-item bg-light p-4 rounded text-center shadow-sm h-100">
                {/* Image */}
                <img
                  className="img-fluid mb-4 rounded"
                  src={s.img}
                  alt={`${s.title} Vishrantwadi Pune Water Delivery`}
                />

                {/* Title */}
                <h3 className="mb-3">{s.title}</h3>

                {/* Description */}
                <p className="text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
