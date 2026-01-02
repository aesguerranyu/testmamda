import { useState } from "react";
import { Check } from "lucide-react";

export function MembershipForm() {
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
      <div className="bg-white border-2 border p-4 md:p-5 text-center" style={{ borderColor: '#7F97E6' }}>
        <div className="inline-flex items-center justify-center rounded-full mb-4" style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#D1FAE5' }}>
          <Check style={{ width: '1.75rem', height: '1.75rem', color: '#10B981' }} />
        </div>
        <h3 className="font-bold text-[#0C2788] mb-3" style={{ fontSize: 'clamp(24px, 3vw, 30px)' }}>Welcome to Mamdani Tracker!</h3>
        <p className="text-lg text-gray-600 mb-4">
          Thank you for joining. We'll keep you informed about updates and new developments.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-4 py-3 bg-[#0C2788] text-white hover:bg-[#1436B3] transition-colors font-bold uppercase tracking-wide text-sm border-0 cursor-pointer"
          style={{ letterSpacing: '0.15em' }}
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border p-4 md:p-5" style={{ borderColor: '#7F97E6' }}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-bold text-black">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border"
              placeholder="First name"
              style={{ borderColor: '#D1D5DB' }}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block mb-2 text-sm font-bold text-black">
              Last Name <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border"
              placeholder="Last name"
              style={{ borderColor: '#D1D5DB' }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-bold text-black">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border"
            placeholder="your.email@example.com"
            style={{ borderColor: '#D1D5DB' }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="borough" className="block mb-2 text-sm font-bold text-black">
            Where do you live? <span className="text-red-500">*</span>
          </label>
          <select
            id="borough"
            name="borough"
            required
            value={formData.borough}
            onChange={handleChange}
            className="w-full px-3 py-2 border"
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
          <div className="mb-4">
            <label htmlFor="city" className="block mb-2 text-sm font-bold text-black">
              {formData.borough === "Outside USA" ? "City/Country" : "City, State"} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border"
              placeholder={formData.borough === "Outside USA" ? "e.g., London, UK" : "e.g., Boston, MA"}
              style={{ borderColor: '#D1D5DB' }}
            />
          </div>
        )}

        <div className="pt-3">
          <button
            type="submit"
            className="px-4 py-2 bg-[#0C2788] text-white hover:bg-[#1436B3] hover:scale-105 transition-all font-bold uppercase tracking-wide text-xs border-0 cursor-pointer"
            style={{ letterSpacing: '0.15em' }}
          >
            Join Now
          </button>
        </div>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4 mb-0">
        We respect your privacy. Your information will never be shared or sold.
      </p>
    </div>
  );
}