import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

const boroughs = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "The Bronx",
  "Staten Island",
  "Outside New York",
  "Outside USA",
];

export function MembershipForm() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    borough: "",
    city: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "borough" &&
      value !== "Outside New York" &&
      value !== "Outside USA"
        ? { city: "" }
        : {}),
    }));
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md border-2 border-gray-900 bg-white p-8 text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "#22C55E" }}
        >
          <CheckIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-3 text-2xl font-bold" style={{ color: "#1E3A8A" }}>
          Welcome to Mamdani Tracker!
        </h3>
        <p className="mb-6 text-gray-600">
          Thank you for joining. We'll keep you informed about updates and new
          developments.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="border-0 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#1E3A8A" }}
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-4 border-2 border-gray-200 bg-white p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-blue-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
            Last Name (optional)
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="w-full border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-blue-600 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
          Where do you live? *
        </label>
        <select
          name="borough"
          value={formData.borough}
          onChange={handleChange}
          required
          className="w-full border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-blue-600 focus:outline-none"
        >
          <option value="">Select a borough</option>
          {boroughs.map((borough) => (
            <option key={borough} value={borough}>
              {borough}
            </option>
          ))}
        </select>
      </div>

      {(formData.borough === "Outside New York" ||
        formData.borough === "Outside USA") && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
            {formData.borough === "Outside USA" ? "City/Country" : "City, State"} *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-blue-600 focus:outline-none"
          />
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          className="w-full border-0 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "#1E3A8A" }}
        >
          Join Now
        </button>
      </div>

      <p className="pt-2 text-center text-xs text-gray-500">
        We respect your privacy. Your information will never be shared or sold.
      </p>
    </form>
  );
}
