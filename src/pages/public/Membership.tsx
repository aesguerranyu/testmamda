import { MembershipForm } from "@/components/public/MembershipForm";

export default function Membership() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-subway-blue mb-4">
            Become a Member
          </h1>
          <p className="text-gray-600 text-lg">
            Join our community and stay informed about Mayor Mamdani's progress on his promises.
            It's completely free!
          </p>
        </div>
        <MembershipForm />
      </div>
    </div>
  );
}
