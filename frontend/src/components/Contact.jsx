import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${form.name}! We will contact you soon.`);
    // Plug in your .NET API or Email service here
  };

  return (
    <div id="contactus" className="container-xxl bg-light py-5">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6 wow fadeInUp">
            <p className="fw-medium text-uppercase text-primary mb-2">Contact Us</p>
            <h1 className="display-5 mb-4">Need a Quick Delivery? Contact Us Today</h1>
            <div className="d-flex mb-3">
              <i className="fa fa-phone-alt text-primary me-3"></i>
              <span>+91 955 2989 143 / +91 963 0969 994</span>
            </div>
            <div className="d-flex mb-3">
              <i className="fa fa-map-marker-alt text-primary me-3"></i>
              <span>Anand Park, Dhanori Road, Vishrantwadi, Pune – 411015</span>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control p-3" placeholder="Your Name" required
                    onChange={(e) => setForm({...form, name: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <input type="email" className="form-control p-3" placeholder="Your Email" required
                    onChange={(e) => setForm({...form, email: e.target.value})} />
                </div>
                <div className="col-12">
                  <textarea className="form-control p-3" placeholder="Message" rows="5" required
                    onChange={(e) => setForm({...form, message: e.target.value})}></textarea>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary py-3 px-5 w-100" type="submit">Send Request</button>
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