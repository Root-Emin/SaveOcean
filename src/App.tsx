import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Fish, 
  Waves, 
  Trash2, 
  Copy, 
  CheckCircle, 
  Mail, 
  Twitter, 
  Facebook, 
  ChevronDown,
  Award,
  TrendingUp
} from 'lucide-react';

function App() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const bitcoinAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";

  // Mock top donaters data
  const topDonaters = [
    { rank: 1, name: "Ocean Guardian", amount: "2.5 BTC" },
    { rank: 2, name: "Blue Wave Foundation", amount: "1.8 BTC" },
    { rank: 3, name: "Anonymous", amount: "1.2 BTC" },
    { rank: 4, name: "Marine Life Supporter", amount: "0.9 BTC" },
    { rank: 5, name: "Coral Reef Protector", amount: "0.7 BTC" },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bitcoinAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}th`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        {/* Wave Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400C200 300 400 500 600 400C800 300 1000 500 1200 400V800H0V400Z" fill="white"/>
            <path d="M0 500C200 400 400 600 600 500C800 400 1000 600 1200 500V800H0V500Z" fill="white" opacity="0.5"/>
          </svg>
        </div>
        
        <div className={`relative z-10 text-center text-white px-6 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-6">
            <Waves className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Save Our <span className="text-blue-200">Oceans</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Together we can fight ocean pollution and protect marine life for future generations
          </p>
          <button 
            onClick={() => scrollToSection('donation')}
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Heart className="w-5 h-5" />
            Donate Now
          </button>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white opacity-70" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every year, millions of tons of plastic waste enter our oceans, threatening marine ecosystems and the creatures that call them home. Your donation helps fund cleanup efforts, research, and education programs that make a real difference.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Fish className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Protect Marine Life</h3>
              <p className="text-gray-600">Save countless species from plastic pollution and habitat destruction.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Waves className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Ocean Cleanup</h3>
              <p className="text-gray-600">Fund innovative technologies and programs to remove plastic from our seas.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Trash2 className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Reduce Waste</h3>
              <p className="text-gray-600">Education and awareness programs to prevent future pollution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donation" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Make a Donation</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Your Bitcoin donation directly supports ocean cleanup initiatives and marine conservation efforts worldwide.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Bitcoin Wallet Address</h3>
              <div className="bg-white rounded-lg p-6 shadow-inner border-2 border-blue-200">
                <code className="text-sm md:text-base text-gray-800 font-mono break-all">
                  {bitcoinAddress}
                </code>
              </div>
            </div>

            <button
              onClick={copyToClipboard}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-md ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Address Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Address
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 mt-6">
              Scan QR code or copy the address to your Bitcoin wallet
            </p>
          </div>
        </div>
      </section>

      {/* Top Donaters Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-yellow-500" />
              <h2 className="text-4xl font-bold text-gray-800">Top Ocean Heroes</h2>
            </div>
            <p className="text-xl text-gray-600">
              Celebrating our most generous supporters who are making a real difference
            </p>
          </div>

          <div className="space-y-4">
            {topDonaters.map((donor, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-lg border-l-4 transform hover:scale-102 transition-all duration-300 ${
                  donor.rank === 1 ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-white' :
                  donor.rank === 2 ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-white' :
                  donor.rank === 3 ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-white' :
                  'border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center ${
                      donor.rank <= 3 ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-blue-100'
                    }`}>
                      {donor.rank <= 3 ? getRankIcon(donor.rank) : donor.rank}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{donor.name}</h3>
                      <p className="text-sm text-gray-500">Ocean Supporter</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{donor.amount}</div>
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      Donated
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Waves className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Save Our Oceans</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Together, we can make a difference for our planet's oceans
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-700">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <a href="mailto:info@saveouroceans.org" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
                <Mail className="w-4 h-4" />
                info@saveouroceans.org
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm mt-8">
            © 2025 Save Our Oceans Campaign. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;