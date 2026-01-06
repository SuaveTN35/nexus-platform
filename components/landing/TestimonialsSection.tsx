const testimonials = [
  {
    quote: "NEXUS replaced 5 different tools we were using. Our team productivity increased by 40% in the first month.",
    author: "Sarah Chen",
    role: "CEO",
    company: "TechStart Ventures",
    image: null,
  },
  {
    quote: "The AI-powered lead scoring is a game changer. We're closing deals 2x faster because we know exactly who to focus on.",
    author: "Marcus Johnson",
    role: "Sales Director",
    company: "Pinnacle Real Estate",
    image: null,
  },
  {
    quote: "Finally, a CRM that doesn't feel like work. The automation handles 80% of our follow-ups automatically.",
    author: "Emily Rodriguez",
    role: "Marketing Manager",
    company: "GrowthLab Agency",
    image: null,
  },
  {
    quote: "We've tried every platform out there. NEXUS is the only one that actually delivers on its AI promises.",
    author: "David Park",
    role: "Founder",
    company: "CloudScale Solutions",
    image: null,
  },
  {
    quote: "The property management features alone saved us 20 hours per week. Worth every penny.",
    author: "Jennifer Walsh",
    role: "Broker",
    company: "Premier Properties",
    image: null,
  },
  {
    quote: "Setup took 15 minutes. Within a week, we had our entire pipeline automated. Incredible platform.",
    author: "Alex Thompson",
    role: "Operations Director",
    company: "Venture Partners",
    image: null,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Testimonials</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Loved by teams everywhere
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See why 2,000+ businesses trust NEXUS to power their growth
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              {/* Quote */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
