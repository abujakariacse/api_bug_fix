/* eslint-disable no-unused-vars */
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaHome,
  FaUsers,
  FaDumbbell,
  FaComments,
  FaChartLine,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/", icon: <FaHome /> },
        { name: "Trainers", path: "/trainers", icon: <FaUsers /> },
        { name: "Classes", path: "/classes", icon: <FaDumbbell /> },
        { name: "Community", path: "/community", icon: <FaComments /> },
        { name: "Dashboard", path: "/dashboard", icon: <FaChartLine /> },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Blog", path: "/blog" },
        { name: "Press", path: "/press" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: "https://facebook.com/fitforge" },
    { icon: <FaTwitter />, url: "https://twitter.com/fitforge" },
    { icon: <FaInstagram />, url: "https://instagram.com/fitforge" },
    { icon: <FaLinkedin />, url: "https://linkedin.com/company/fitforge" },
    { icon: <FaYoutube />, url: "https://youtube.com/fitforge" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 px-6 md:px-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Logo and About - Takes up more space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-4 space-y-6"
          >
            <Link to="/" className="flex items-center">
              <img
                className="w-36"
                src="https://i.ibb.co/qS1WNFv/Fit-Forge-Logo.png"
                alt="FitForge Logo"
              />
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Forging stronger bodies and healthier lives through innovative
              fitness solutions and community support.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-lime-400 text-2xl transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links - Take up less space */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="lg:col-span-2 space-y-6"
            >
              <h3 className="text-xl font-bold text-lime-400 tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      to={link.path}
                      className="flex items-center gap-3 text-gray-300 hover:text-lime-400 transition-colors group"
                    >
                      <span className="text-lime-400 opacity-80 group-hover:opacity-100 transition-opacity">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info - Takes up less space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-3 space-y-6"
          >
            <h3 className="text-xl font-bold text-lime-400 tracking-wide">
              Contact Us
            </h3>
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-start gap-4 text-gray-300 hover:text-white transition-colors"
              >
                <MdLocationOn className="text-xl text-lime-400 mt-1 flex-shrink-0" />
                <span>123 Fitness Street, Wellness City, 10001</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors"
              >
                <MdPhone className="text-xl text-lime-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors"
              >
                <MdEmail className="text-xl text-lime-400 flex-shrink-0" />
                <span>support@fitforge.com</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.16, 0.77, 0.47, 0.97] }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-lime-400/40 to-transparent mb-10"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm"
        >
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} FitForge. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/privacy"
              className="hover:text-lime-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-lime-400 transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="hover:text-lime-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
