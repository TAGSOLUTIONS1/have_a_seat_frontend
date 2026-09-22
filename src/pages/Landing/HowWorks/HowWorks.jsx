import { motion } from "framer-motion";
import { Search, CalendarCheck, Utensils } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    desc: "Browse through our curated list of top-rated restaurants, cafes, and bars.",
  },
  {
    icon: CalendarCheck,
    title: "Reserve",
    desc: "Select your preferred date, time, and party size to instantly secure your table.",
  },
  {
    icon: Utensils,
    title: "Enjoy",
    desc: "Arrive at the restaurant, skip the wait, and enjoy an unforgettable dining experience.",
  },
];

export default function HowWorks() {
  return (
    <section className="py-24 bg-lightGrey mt-10" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-agrandir font-bold text-shipGrey mb-4">
            How It Works
          </h2>
          <p className="text-graysublabel max-w-2xl mx-auto font-inter leading-relaxed">
            Simple, fast, and reliable. Your next great meal is just three steps
            away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-frenchPink flex items-center justify-center mb-6 text-plum">
                  <Icon className="w-8 h-8" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-agrandir font-bold text-shipGrey mb-3">
                  {step.title}
                </h3>
                <p className="text-shipGrey/80 font-inter leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
