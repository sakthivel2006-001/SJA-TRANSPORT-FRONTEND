import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import AchievementCounter from '../components/AchievementCounter';
import ReviewCard from '../components/ReviewCard';
import TransportCharges from '../components/TransportCharges';
import ServiceAreas from '../components/ServiceAreas';
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerFeedback from '../components/CustomerFeedback';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

// Import assets
import aboutPreviewImg from '../assets/ChatGPT Image Jul 20, 2026, 11_30_15 PM.webp';

import { useAchievements } from '../hooks/useAchievements';
import { useGallery } from '../hooks/useGallery';
import { useFeedback } from '../hooks/useFeedback';
import { useTransportServices, getTransportServiceCardData } from '../hooks/useTransportServices';
import { useVehicles } from '../hooks/useVehicles';
import { getGalleryImageUrl } from '../utils/galleryImageUrl';

const Home: React.FC = () => {
  const { achievements, loading: loadingAchievements } = useAchievements();
  const { items: galleryItems, loading: loadingGallery } = useGallery();
  const { reviews, loading: loadingReviews } = useFeedback();
  const { services, loading: loadingServices } = useTransportServices();
  const { vehicles, loading: loadingVehicles } = useVehicles();

  const serviceCards = services.map(getTransportServiceCardData);

  const galleryImages = galleryItems.map((item) => ({
    _id: item._id,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    category: item.category || 'Fleet Vehicles',
    isFeatured: item.isFeatured,
    vehicleName: item.vehicleName,
    capacity: item.capacity,
    pickupLocation: item.pickupLocation,
    deliveryLocation: item.deliveryLocation,
    serviceType: item.serviceType,
    vehicleUsed: item.vehicleUsed,
    deliveryDate: item.deliveryDate,
    likesCount: item.likesCount,
    likedBy: item.likedBy,
  }));

  const featuredGalleryImages = galleryImages.filter((item) => item.isFeatured);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />

      {/* About Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-heading font-bold text-primary mb-8">
                Driven by Excellence. Delivered with Care.
              </h2>
              <Link to="/about" className="inline-flex items-center text-primary font-medium hover:text-accent transition-colors">
                Read Our Story <span className="ml-2">→</span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <img src={aboutPreviewImg} alt="SJA Transport Tata Intra Truck" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-3/4 h-3/4 bg-accent/20 rounded-3xl z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title="Our Transport Services"
            subtitle="Comprehensive logistics solutions tailored for your specific needs."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {loadingServices ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-72 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm animate-pulse" />
              ))
            ) : (
              serviceCards.map((service, idx) => (
                <ServiceCard
                  key={service._id}
                  title={service.title}
                  description={service.description}
                  Icon={service.Icon}
                  capacity={service.capacity}
                  gradient={service.gradient}
                  delay={idx * 0.1}
                />
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="px-8 py-3 bg-white text-primary border border-gray-200 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm inline-block">
              View All Services
            </Link>
          </div>
        </div>
      </section>


      {/* Transport Charges */}
      <TransportCharges
        localRate="15–25"
        longDistanceRate="25–40"
      />

      {/* Why Choose Us */}
      <WhyChooseUs />
      {/* Service Areas */}
      <ServiceAreas />
      {/* Achievements */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {loadingAchievements ? (
            <div className="flex justify-center items-center h-32">
              <Spinner size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {achievements.length > 0 ? (
                achievements.map((achievement) => {
                  const numericMatch = String(achievement.value).match(/^(\d+)/);
                  const numericEnd = numericMatch ? parseInt(numericMatch[1], 10) : 0;
                  const suffix = String(achievement.value).replace(/^\d+/, '') || '+';
                  return (
                    <AchievementCounter
                      key={achievement._id}
                      end={numericEnd}
                      label={achievement.title}
                      suffix={suffix}
                    />
                  );
                })
              ) : (
                <>
                  <AchievementCounter end={1500} label="Successful Deliveries" suffix="+" />
                  <AchievementCounter end={1200} label="Happy Customers" suffix="+" />
                  <AchievementCounter end={10} label="Years Experience" suffix="+" />
                  <AchievementCounter end={95} label="Customer Satisfaction" suffix="%" />
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title="Featured Logistics Gallery"
            subtitle="Only the top selected transport stories from our latest deliveries."
            centered
          />

          {loadingGallery ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size={48} />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {(featuredGalleryImages.length > 0 ? featuredGalleryImages : galleryImages.slice(0, 3)).map((image) => (
                <motion.article
                  key={image._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden rounded-t-[28px]">
                    <img src={getGalleryImageUrl(image.imageUrl)} alt={image.title} loading="lazy" className="h-64 w-full object-cover transition duration-700 hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-semibold text-primary">{image.title}</h3>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      {image.vehicleName && <p><span className="font-semibold text-primary">Vehicle:</span> {image.vehicleName}</p>}
                      {image.pickupLocation && image.deliveryLocation && (
                        <p><span className="font-semibold text-primary">Route:</span> {image.pickupLocation} → {image.deliveryLocation}</p>
                      )}
                      {image.serviceType && <p><span className="font-semibold text-primary">Service:</span> {image.serviceType}</p>}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                      <span>{image.likesCount || 0} likes</span>
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">Featured</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/gallery" className="px-8 py-3 bg-white text-primary border border-gray-200 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm inline-block">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title="Our Premium Fleet"
            subtitle="Explore our range of reliable vehicles ready for your transport needs."
            centered
          />
          {loadingVehicles ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size={48} />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {vehicles.filter(v => v.featured).length > 0 
                ? vehicles.filter(v => v.featured).slice(0, 3).map(vehicle => (
                    <motion.article
                      key={vehicle._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow"
                    >
                      <div className="relative overflow-hidden rounded-t-[28px]">
                        <img src={vehicle.image} alt={vehicle.vehicleName} loading="lazy" className="h-56 w-full object-cover transition duration-700 hover:scale-105" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm border border-white/20">
                          {vehicle.vehicleType}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-heading font-semibold text-gray-900">{vehicle.vehicleName}</h3>
                          {vehicle.status === 'Available' ? (
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] mt-2" title="Available"></span>
                          ) : vehicle.status === 'On Trip' ? (
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2" title="On Trip"></span>
                          ) : (
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full mt-2" title="Maintenance"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{vehicle.description || `Ideal for transporting ${vehicle.suitableGoods}.`}</p>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-gray-400">Capacity</span>
                            <span className="font-medium">{vehicle.capacity}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-gray-400">Suitable For</span>
                            <span className="font-medium truncate block">{vehicle.suitableGoods}</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))
                : (
                   <div className="col-span-1 md:col-span-3 text-center py-12">
                     <p className="text-gray-500 text-lg">No vehicles featured currently. Please check back later.</p>
                   </div>
                )
              }
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title="What Our Clients Say"
            centered
          />
          {loadingReviews ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.length > 0 ? (
                reviews
                  .slice(0, 3)
                  .map((review, idx) => (
                    <ReviewCard
                      key={review._id}
                      name={review.customerName}
                      role="Customer"
                      review={review.review}
                      rating={review.rating}
                      serviceType={review.service}
                      vehicleUsed={review.vehicle}
                      date={review.createdAt}
                      delay={idx * 0.1}
                    />
                  ))
              ) : (
                <div className="col-span-1 md:col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">No customer reviews available yet. Be the first to share your experience.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Customer Feedback */}
      <CustomerFeedback />

      {/* Booking CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/80"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Ready to Move Your Goods?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Get a premium transport experience with SJA TRANSPORT. Fast, reliable, and tailored to you.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-accent text-white text-lg font-bold rounded-full shadow-2xl hover:bg-white hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
            >
              Book Shipment Now
            </Link>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
