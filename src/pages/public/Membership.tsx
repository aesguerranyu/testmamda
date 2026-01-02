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
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "borough" && value !== "Outside New York" && value !== "Outside USA" ? { city: "" } : {})
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full bg-white border-2 border-gray-900 p-8 text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#22C55E' }}
          >
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E3A8A' }}>
            Welcome to Mamdani Tracker!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for joining. We'll keep you informed about updates and new developments.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 text-white font-bold uppercase tracking-widest text-sm transition-colors hover:opacity-90"
            style={{ backgroundColor: '#1E3A8A' }}
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="text-white py-12 px-4 sm:px-6 lg:px-8 text-center"
        style={{ backgroundColor: '#1E3A8A' }}
      >
        <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
          Become a Member
        </h1>
        <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
          Be part of the exciting public interest project tracking changes in NYC.
        </p>
        <button
          onClick={() => {
            const formElement = document.getElementById('membership-form');
            if (formElement) {
              formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="px-6 py-2 bg-white text-[#1E3A8A] hover:bg-white/90 font-bold uppercase tracking-widest text-xs transition-all"
        >
          JOIN NOW
        </button>
      </div>

      {/* Why Join Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Join?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: '#22C55E' }}
            >
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-600 text-sm">
              Track the mayor's commitments and agenda items in one place
            </span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: '#22C55E' }}
            >
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-600 text-sm">
              See what has changed and what evidence supports it
            </span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: '#22C55E' }}
            >
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-600 text-sm">
              Membership is free and focused on transparency
            </span>
          </div>
        </div>

        {/* Form */}
        <form 
          id="membership-form" 
          onSubmit={handleSubmit} 
          className="bg-white border-2 border-gray-200 p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#1E3A8A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Last Name (optional)
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#1E3A8A] transition-colors"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#1E3A8A] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Where do you live? *
            </label>
            <select
              name="borough"
              value={formData.borough}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#1E3A8A] transition-colors"
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
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {formData.borough === "Outside USA" ? "City/Country" : "City, State"} *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#1E3A8A] transition-colors"
              />
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-4 text-white font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#1E3A8A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1E40AF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E3A8A';
              }}
            >
              Join Now
            </button>
          </div>
        </form>
      </div>

      <p className="text-center text-xs text-gray-500 pb-8 px-4">
        We respect your privacy. Your information will never be shared or sold.
      </p>
    </div>
  );
}
