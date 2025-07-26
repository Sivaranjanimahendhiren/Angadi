import React, { useState } from 'react';

const Contact = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showSubs, setShowSubs] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    if (name && email) {
      const newSub = { name, email };
      const existingSubs = JSON.parse(localStorage.getItem('subscriptions')) || [];
      const updatedSubs = [...existingSubs, newSub];
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
      alert('✅ Subscribed successfully!');
      e.target.reset();
    } else {
      alert('❗ Please fill out all fields');
    }
  };

  const loadSubscriptions = () => {
    const saved = JSON.parse(localStorage.getItem('subscriptions')) || [];
    setSubscriptions(saved);
    setShowSubs(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mt-2">We'd love to hear from you – get in touch with <strong>Angadi</strong>!</p>
        </div>

        {/* Contact Form + Map */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.347190732263!2d79.82967431482342!3d11.91385949154182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a53613c3e4fb9fd%3A0xdaa112d83e8538fc!2sPondicherry%2C%20India!5e0!3m2!1sen!2sin!4v1637512439384"
            width="100%"
            height="400"
            className="rounded-lg shadow"
            allowFullScreen=""
            loading="lazy"
            title="Pondicherry Location"
          ></iframe>

          <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Say Hello 👋</h3>
            <p className="text-gray-600 mb-4">Let us know how we can help you at <strong>Angadi</strong>.</p>
            <input type="text" name="name" placeholder="Your Name" className="w-full border border-gray-300 rounded px-4 py-2 mb-3" required />
            <input type="email" name="email" placeholder="Your Email" className="w-full border border-gray-300 rounded px-4 py-2 mb-3" required />
            <textarea name="message" rows="5" placeholder="Your Message" className="w-full border border-gray-300 rounded px-4 py-2 mb-3" required></textarea>
            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              ✉️ Send Message
            </button>
          </form>
        </div>

        {/* Subscribe Section */}
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Subscribe & Get 30% Off</h2>
            <p className="text-gray-600">Stay connected with <strong>Angadi</strong> for updates and offers.</p>
          </div>
          <form onSubmit={handleSubscribe} className="grid md:grid-cols-3 gap-4">
            <input type="text" name="name" placeholder="Your Name" className="border border-gray-300 rounded px-4 py-2" required />
            <input type="email" name="email" placeholder="Your Email Address" className="border border-gray-300 rounded px-4 py-2" required />
            <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              📩 Subscribe
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={loadSubscriptions} className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-900 transition">
              View Previous Subscriptions
            </button>
          </div>

          {showSubs && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Subscriptions:</h4>
              {subscriptions.length > 0 ? (
                subscriptions.map((sub, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded mb-2">
                    👤 {sub.name} — 📧 {sub.email}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No subscriptions found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
