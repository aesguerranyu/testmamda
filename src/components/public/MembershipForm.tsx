import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "borough" && value !== "Outside New York" && value !== "Outside USA"
        ? { city: "" }
        : {}),
    }));
  };

  if (submitted) {
    return (
      <div className="bg-white border-2 border-gray-200 p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-subway-green rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-subway-blue mb-3">Welcome to Mamdani Tracker!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for joining. We'll keep you informed about updates and new developments.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          className="bg-subway-blue hover:bg-subway-blue/90 text-white font-bold uppercase tracking-wide"
        >
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold uppercase tracking-wide text-xs">
              Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="border-2 border-gray-300 focus:border-subway-blue h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="font-bold uppercase tracking-wide text-xs">
              Last Name (optional)
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="border-2 border-gray-300 focus:border-subway-blue h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold uppercase tracking-wide text-xs">
            Email Address *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="border-2 border-gray-300 focus:border-subway-blue h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="borough" className="font-bold uppercase tracking-wide text-xs">
            Where do you live? *
          </Label>
          <select
            id="borough"
            name="borough"
            required
            value={formData.borough}
            onChange={handleChange}
            className="w-full h-12 px-3 border-2 border-gray-300 focus:border-subway-blue bg-white text-sm"
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
          <div className="space-y-2">
            <Label htmlFor="city" className="font-bold uppercase tracking-wide text-xs">
              {formData.borough === "Outside USA" ? "City/Country" : "City, State"} *
            </Label>
            <Input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={handleChange}
              className="border-2 border-gray-300 focus:border-subway-blue h-12"
            />
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-14 bg-subway-blue hover:bg-[#1436B3] text-white font-bold uppercase tracking-wider text-base transition-all hover:scale-[1.02]"
          >
            Join Now
          </Button>
        </div>
      </form>

      <p className="text-center text-gray-500 text-xs mt-6">
        We respect your privacy. Your information will never be shared or sold.
      </p>
    </div>
  );
}
