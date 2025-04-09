import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">Privacy Policy</h1>
        {/* <p className="text-sm text-gray-500 text-center mb-6">Effective Date: [Insert Date]</p> */}

        <p className="text-base text-gray-700 mb-4">
          At <strong>Have a Seat - Fast Reservation</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data when you use our app or website.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect your name, email, location, preferences, device data, and app usage to enhance your experience.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>To manage your restaurant reservations</li>
          <li>To personalize recommendations using AI</li>
          <li>To enhance app performance and user support</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
        <p className="mb-4">
          Your data is never sold. We may share limited info with restaurants or partners to process your bookings securely.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Security</h2>
        <p className="mb-4">
          We implement standard security practices, but no method is 100% secure.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Choices</h2>
        <p className="mb-4">
          You may update your profile, opt out of notifications, or request account deletion at any time.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Children’s Privacy</h2>
        <p className="mb-4">
          Our app is not intended for children under 13. We do not knowingly collect data from minors.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Third-Party Links</h2>
        <p className="mb-4">
          External links may be present in the app. We are not responsible for the privacy practices of third-party sites.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Policy Updates</h2>
        <p className="mb-4">
          This policy may be updated occasionally. Check back periodically for the latest changes.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
        <p className="mb-4">
          If you have any queries or concerns regarding this policy, please feel free to contact us.
           {/* at{" "}
          <a
            href="mailto:support@haveaseaton.us"
            className="text-blue-600 underline hover:text-blue-800"
          >
            support@haveaseaton.us
          </a>. */}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
