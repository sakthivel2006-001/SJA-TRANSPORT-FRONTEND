import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Route, IndianRupee, Clock, Shield, TrendingUp } from 'lucide-react';

interface PricingTier {
  title: string;
  rateRange: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  gradient: string;
  accentColor: string;
}

interface TransportChargesProps {
  localRate?: string;
  longDistanceRate?: string;
}

const TransportCharges: React.FC<TransportChargesProps> = ({
  localRate = '15–25',
  longDistanceRate = '25–40',
}) => {
  const tiers: PricingTier[] = [
    {
      title: 'Local Transport',
      rateRange: `₹${localRate}`,
      icon: <MapPin className="w-8 h-8" />,
      description: 'Within city limits & nearby areas',
      features: [
        'Same-day pickup & delivery',
        'Door-to-door service',
        'Real-time tracking',
        'Ideal for small businesses',
      ],
      gradient: 'from-blue-500 to-indigo-600',
      accentColor: 'blue',
    },
    {
      title: 'Long Distance',
      rateRange: `₹${longDistanceRate}`,
      icon: <Route className="w-8 h-8" />,
      description: 'Inter-city & state-wide delivery',
      features: [
        'Multi-city route coverage',
        'Insured goods transport',
        'Dedicated vehicle assignment',
        'Priority scheduling available',
      ],
      gradient: 'from-amber-500 to-orange-600',
      accentColor: 'amber',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <IndianRupee className="w-4 h-4" />
            Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Transport Charges
          </h2>
          <p className="text-lg text-text/60 max-w-2xl mx-auto">
            Simple, transparent pricing with no hidden fees. Pay per kilometer based on your transport distance.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative"
            >
              {/* Card glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${tier.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />

              <div className="relative bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${tier.gradient}`} />

                <div className="p-8 md:p-10">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-white shadow-lg`}>
                      {tier.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-gray-900">{tier.title}</h3>
                      <p className="text-sm text-text/50">{tier.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-heading font-extrabold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                        {tier.rateRange}
                      </span>
                      <span className="text-lg text-text/50 font-medium">/km</span>
                    </div>
                    <p className="text-sm text-text/40 mt-1">*Rate varies based on goods type & vehicle</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-text/70">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${tier.gradient} flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[15px]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="/book"
                    className={`block w-full text-center py-3.5 px-6 bg-gradient-to-r ${tier.gradient} text-white font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300`}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {[
            { icon: <Shield className="w-5 h-5" />, text: 'Goods Fully Insured' },
            { icon: <Clock className="w-5 h-5" />, text: 'On-Time Guarantee' },
            { icon: <TrendingUp className="w-5 h-5" />, text: 'No Hidden Charges' },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm"
            >
              <div className="text-primary">{badge.icon}</div>
              <span className="text-sm font-semibold text-gray-700">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TransportCharges;
