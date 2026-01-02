import { useState } from "react";
import { Check } from "lucide-react";

export default function Membership() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    borough: "",
    city: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const boroughs = [
    "Manhattan",
    "Brooklyn",
    "Queens",
    "The Bronx",
    "Staten Island",
    "Outside New York",
    "Outside USA"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Clear city field if borough changes to a NYC borough
      ...(name === "borough" && value !== "Outside New York" && value !== "Outside USA" ? { city: "" } : {})
    }));
  };

  if (submitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="text-center p-5 bg-white border border-2 border-dark">
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
                style={{ width: '64px', height: '64px', backgroundColor: '#22C55E' }}
              >
                <Check className="text-white" style={{ width: '32px', height: '32px' }} />
              </div>
              <h2 className="fw-bold mb-3" style={{ color: '#1E3A8A' }}>
                Welcome to Mamdani Tracker!
              </h2>
              <p className="text-secondary mb-4">
                Thank you for joining. We'll keep you informed about updates and new developments.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-3 text-white transition-colors fw-bold text-uppercase tracking-wide text-sm-custom btn"
                style={{ backgroundColor: '#1E3A8A', letterSpacing: '0.15em' }}
              >
                Submit Another Response
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Hero Section */}
      <div 
        className="text-white py-5 px-3 px-md-4 text-center"
        style={{ backgroundColor: '#1E3A8A' }}
      >
        <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
          Become a Member
        </h1>
        <p className="mb-4 mx-auto" style={{ maxWidth: '600px', opacity: 0.9, fontSize: '1.125rem' }}>
          Be part of the exciting public interest project tracking changes in NYC.
        </p>
        <button
          onClick={() => {
            const formElement = document.getElementById('membership-form');
            if (formElement) {
              formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="px-4 py-2 bg-brand-primary hover-brand-primary text-white fw-bold text-uppercase tracking-wide text-xs transition-all btn"
          style={{ letterSpacing: '0.1em' }}
        >
          JOIN NOW
        </button>
      </div>

      {/* Why Join Section */}
      <div className="container py-5">
        <h2 className="fw-bold text-center mb-4" style={{ color: '#1E293B' }}>Why Join?</h2>
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-start gap-3 p-3 bg-white border border-2" style={{ borderColor: '#E2E8F0' }}>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: '24px', height: '24px', backgroundColor: '#22C55E', marginTop: '2px' }}
              >
                <Check className="text-white" style={{ width: '14px', height: '14px' }} />
              </div>
              <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                Track the mayor's commitments and agenda items in one place
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-start gap-3 p-3 bg-white border border-2" style={{ borderColor: '#E2E8F0' }}>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: '24px', height: '24px', backgroundColor: '#22C55E', marginTop: '2px' }}
              >
                <Check className="text-white" style={{ width: '14px', height: '14px' }} />
              </div>
              <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                See what has changed and what evidence supports it
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-start gap-3 p-3 bg-white border border-2" style={{ borderColor: '#E2E8F0' }}>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: '24px', height: '24px', backgroundColor: '#22C55E', marginTop: '2px' }}
              >
                <Check className="text-white" style={{ width: '14px', height: '14px' }} />
              </div>
              <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                Membership is free and focused on transparency
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form 
          id="membership-form" 
          onSubmit={handleSubmit} 
          className="bg-white border border-2 p-4 p-md-5"
          style={{ borderColor: '#E2E8F0' }}
        >
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control py-3"
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                Last Name (optional)
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-control py-3"
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="form-control py-3"
              style={{ borderColor: '#D1D5DB' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Where do you live? *
            </label>
            <select
              name="borough"
              value={formData.borough}
              onChange={handleChange}
              required
              className="form-select py-3"
              style={{ borderColor: '#D1D5DB' }}
            >
              <option value="">Select a borough</option>
              {boroughs.map((borough) => (
                <option key={borough} value={borough}>
                  {borough}
                </option>
              ))}
            </select>
          </div>

          {(formData.borough === "Outside New York" || formData.borough === "Outside USA") && (
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                {formData.borough === "Outside USA" ? "City/Country" : "City, State"} *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="form-control py-3"
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
          )}

          <div className="mt-4">
            <button
              type="submit"
              className="btn w-100 py-3 text-white fw-bold text-uppercase"
              style={{ 
                backgroundColor: '#1E3A8A', 
                letterSpacing: '0.1em',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1E40AF';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E3A8A';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Join Now
            </button>
          </div>
        </form>
      </div>

      <p className="text-center text-secondary pb-4 px-3" style={{ fontSize: '0.75rem' }}>
        We respect your privacy. Your information will never be shared or sold.
      </p>
    </div>
  );
}
