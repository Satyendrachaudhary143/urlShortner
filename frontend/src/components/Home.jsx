import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.07 7.07a8 8 0 1111.314-11.314 8 8 0 01-11.314 11.314zm0 0L4 20m0 0h4m-4 0v-4" /></svg>
    ),
    title: 'Fast',
    desc: 'Instantly shorten your links with lightning speed.'
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7a2 2 0 012-2h12a2 2 0 012 2v7c0 2.21-3.582 4-8 4z" /></svg>
    ),
    title: 'Free',
    desc: 'No hidden charges. Shorten unlimited URLs for free.'
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2zm-5 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
    ),
    title: 'Password Protection',
    desc: 'Secure your links with passwords for private sharing.'
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4m-6 6v2a4 4 0 004 4h4m-6-6h6" /></svg>
    ),
    title: 'Custom URLs',
    desc: 'Create memorable, branded short links with custom aliases.'
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /></svg>
    ),
    title: 'Analytics',
    desc: 'Track clicks and performance of your short links.'
  },
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-[80vh] py-8 px-2">
      {/* Hero Section */}
      <div className="w-full max-w-3xl text-center mb-12 fade-in">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 shadow-md">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.07 7.07a8 8 0 1111.314-11.314 8 8 0 01-11.314 11.314zm0 0L4 20m0 0h4m-4 0v-4" /></svg>
          </span>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          The Fastest & Easiest URL Shortener
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Shorten, customize, and protect your links in seconds. Free, secure, and packed with features.
        </p>
        <button
          className="btn-primary text-lg px-8 py-3 mt-4 shadow-lg"
          onClick={() => navigate('/shorten')}
        >
          Get Started
        </button>
      </div>
      {/* Features Section */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16 fade-in">
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow p-6 border border-blue-50">
            {feature.icon}
            <h3 className="mt-4 text-lg font-bold text-gray-800">{feature.title}</h3>
            <p className="mt-2 text-gray-500 text-sm text-center">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 