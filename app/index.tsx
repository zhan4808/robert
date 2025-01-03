import { motion } from 'framer-motion';
import Navbar  from './components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-20">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to My Personal Website
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          I'm a developer passionate about creating interactive web experiences.
        </motion.p>
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="https://github.com/yourusername"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {/* GitHub Icon */}
            </svg>
            <span>GitHub</span>
          </a>
          <a
            href="https://twitter.com/yourusername"
            className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Twitter Icon */}
            </svg>
            <span>Twitter</span>
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;