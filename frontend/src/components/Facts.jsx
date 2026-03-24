import React from 'react';

const Facts = () => {
  const stats = [
    { icon: "fa-certificate", value: "08", label: "Years Experience" },
    { icon: "fa-users-cog", value: "10", label: "Team Members" },
    { icon: "fa-users", value: "100", label: "Happy Clients" },
    { icon: "fa-check-double", value: "10", label: "Projects Done" }
  ];

  return (
    <div id="facts" className="container-fluid facts my-5 p-5 bg-dark">
      <div className="row g-5">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-6 col-xl-3 wow fadeIn" data-wow-delay={`${0.1 * index}s`}>
            <div className="text-center border p-5">
              <i className={`fa ${stat.icon} fa-3x text-white mb-3`}></i>
              <h1 className="display-2 text-primary mb-0">{stat.value}</h1>
              <span className="fs-5 fw-semi-bold text-white">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facts;