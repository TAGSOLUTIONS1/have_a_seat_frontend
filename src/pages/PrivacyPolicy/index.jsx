import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-12">
      <div className="bg-white p-8 rounded-3xl shadow-md text-[#333]">
        <h1 className="text-6xl font-semibold font-pt">PRIVACY POLICY</h1>
        <p className="text-lg font-bold text-policy mt-5 mb-2">Last updated May 06, 2024</p>

        <div className='flex flex-col gap-6 mt-10'>
      <p className="text-lg mb-4">
        This privacy notice for <span className="font-semibold">Have a Seat</span> (<strong>"Company," "we," "us,"</strong> or <strong>"our"</strong>), describes how and why we might collect, store, use, and/or share (<strong>"process"</strong>) your information when you use our services (<strong>"Services"</strong>), such as when you:
      </p>

      <ul className="list-disc list-inside mb-4 space-y-2 text-lg">
        <li>
          Visit our website at{" "}
          <a
            href="https://haveaseaton.us/"
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://haveaseaton.us/
          </a>
          , or any website of ours that links to this privacy notice
        </li>
        <li>
          Download and use our mobile application (Have a Seat App), or any other application of ours that links to this privacy notice
        </li>
        <li>
          Engage with us in other related ways, including any sales, marketing, or events
        </li>
      </ul>

      
      <p className="text-lg ">
      <span className="text-lg font-semibold">Questions or concerns? </span>
        Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{" "}
        <a
            href="https://haveaseaton.us/#contact"
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://haveaseaton.us/#contact
          </a>
        .
      </p>

      
        <p className="text-2xl font-bold">1. Information We Collect</p>
        <p className="text-policy text-lg">
          We may collect your name, email, location, preferences, device data, and app usage to enhance your experience.
        </p>

        <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1 text-policy text-lg">
          <li>We may use location information to help you discover and book nearby restaurants.</li>
          <li>To enhance app performance and user support</li>
        </ul>

        <h2 className="text-2xl font-bold">3. Data Sharing</h2>
        <p className="text-lg text-policy">
          Your data is never sold. We may share limited info with restaurants or partners to process your bookings securely.
        </p>

        <h2 className="text-2xl font-bold">4. Security</h2>
        <p className="text-lg text-policy">
          We follow best security practices, and your data is encrypted to keep it safe.
        </p>

        <h2 className="text-2xl font-bold">5. Your Choices</h2>
        <p className="text-lg text-policy">
          You may update your profile, opt out of notifications, or request account deletion at any time.
        </p>

        <h2 className="text-2xl font-bold">6. Children’s Privacy</h2>
        <p className="text-lg text-policy">
          Our app is not intended for children under 13. We do not knowingly collect data from minors.
        </p>

        <h2 className="text-2xl font-bold">7. Third-Party Links</h2>
        <p className="text-lg text-policy">
          External links may be present in the app. We are not responsible for the privacy practices of third-party sites.
        </p>

        <h2 className="text-2xl font-bold">8. Policy Updates</h2>
        <p className="text-lg text-policy">
          This policy may be updated occasionally. Check back periodically for the latest changes.
        </p>

        <h2 className="text-2xl font-bold">9. Contact Us</h2>
        <p className="text-lg text-policy">
          If you have any queries or concerns regarding this policy, please contact us
           at {" "}
           <a
            href="https://haveaseaton.us/#contact"
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://haveaseaton.us/#contact
          </a>
        </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
