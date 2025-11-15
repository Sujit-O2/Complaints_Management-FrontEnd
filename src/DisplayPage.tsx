import {
  Building2,
  FileText,
  Users,
  CheckCircle,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const features = [
  {
    icon: FileText,
    title: "Easy Complaint Submission",
    description: "Students can quickly submit and track their hostel and campus complaints.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Separate dashboards for students, wardens, and admins with proper permissions.",
  },
  {
    icon: CheckCircle,
    title: "Status Tracking",
    description: "Real-time status updates and timeline of complaint resolution.",
  },
  {
    icon: Building2,
    title: "Comprehensive Management",
    description: "Manage both hostel and campus complaints in one centralized system.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Hostel Resident",
    quote:
      "This platform simplified reporting complaints. Resolution is quick and transparent.",
  },
  {
    name: "Ravi Mishra",
    role: "Warden",
    quote: "The dashboards make managing issues efficient and straightforward.",
  },
  {
    name: "Admin Team",
    role: "System Admins",
    quote: "Helps us keep track and resolve campus issues without hassles.",
  },
];

const faqs = [
  {
    question: "Who can use the complaint management system?",
    answer:
      "Students, wardens, and administrators can access customized dashboards to manage complaints effectively.",
  },
  {
    question: "How can I track the status of my complaint?",
    answer:
      "Each complaint has real-time status updates and detailed responses within the platform.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Currently, the platform is accessible via web browsers optimized for mobile and desktop devices.",
  },
  {
    question: "Can I edit or withdraw my complaint once submitted?",
    answer:
      "You can edit your complaint during the review phase or withdraw it by contacting the admin team.",
  },
];

const Display = () => {
  const navigate = useNavigate();
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white bg-opacity-90 backdrop-blur-md shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-blue-700 select-none">
              Campus Complaints
            </span>
          </div>
          <nav className="flex gap-6">
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-grow flex flex-col justify-center items-center text-center px-6 sm:px-12 lg:px-24 pt-20 pb-32 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 opacity-80 -z-10 rounded-b-xl"></div>
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight max-w-4xl">
          Campus Complaint Management System
        </h1>
        <p className="mt-6 max-w-3xl text-lg sm:text-xl font-light tracking-wide">
          Streamline hostel and campus complaint handling with our efficient,
          role-based management platform for a better student experience.
        </p>

        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          <button
            onClick={() => navigate("/auth")}
            className="rounded-xl px-8 py-4 bg-white text-blue-700 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="rounded-xl px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-blue-700 transition"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-800 mb-3">Key Features</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            Everything you need to manage campus complaints efficiently and transparently.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow cursor-default"
              title={feature.description}
            >
              <div className="p-5 bg-blue-100 rounded-3xl inline-block mb-6">
                <feature.icon className="h-9 w-9 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map(({ name, role, quote }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-10 shadow-lg font-serif text-gray-700"
              >
                <p className="mb-6 italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
                <h4 className="text-xl font-semibold text-blue-700">{name}</h4>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-20 max-w-4xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map(({ question, answer }, idx) => (
            <div
              key={question}
              className="border border-blue-300 rounded-xl overflow-hidden"
            >
              <button
                className="flex justify-between items-center w-full px-6 py-4 font-semibold text-blue-700 hover:bg-blue-50 transition"
                onClick={() => toggleFaq(idx)}
                aria-expanded={idx === faqOpenIndex}
                aria-controls={`faq-content-${idx}`}
              >
                <span>{question}</span>
                <ChevronDown
                  className={`w-5 h-5 transform transition-transform ${
                    idx === faqOpenIndex ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {idx === faqOpenIndex && (
                <div
                  id={`faq-content-${idx}`}
                  className="px-6 pb-6 text-gray-700 leading-relaxed"
                >
                  {answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-6">Ready to get started?</h2>
        <p className="max-w-3xl mx-auto mb-10 opacity-90 text-lg">
          Join our campus complaint platform and improve your living and learning environment.
        </p>
        <button
          onClick={() => navigate("/auth")}
          className="px-10 py-4 rounded-xl border-2 border-white hover:bg-white hover:text-blue-700 font-semibold transition"
        >
          Create Account
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 text-center text-gray-500">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Campus Complaint System. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" aria-label="Facebook" className="hover:text-blue-600">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-400">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Linkedin" className="hover:text-blue-700">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Display;
