import { useState, useEffect, useRef } from 'react'
import { Quote } from 'lucide-react'

// EDIT TESTIMONIALS HERE - Add new testimonials to this array
const TESTIMONIALS = [
  {
    name: 'Thomas',
    quote: "SNY has completely transformed the way I gamble. He's fully transparent with his P&L and does the hard work of consistently identifying genuine value bets. As long as you follow the advised bets and staking plan, the edge is clear. Not every bet wins, but that's just variance — long-term profitability is the goal, and the process delivers.",
  },
  {
    name: 'Mikey Lawton',
    quote: "Used other tipsters before who tip bets at ridiculous units plus an expensive membership but since I have gone with yourself I have found myself consistently making money each month and the membership is definitely worth the money.",
  },
  {
    name: 'James Wallace',
    quote: "Great service which is open, honest and clear. Can tell Sonny knows what he's doing and that there is a lot of profit to be made!",
  },
  {
    name: 'Adam Crane',
    quote: "Sonny's service is top drawer. I have been a member for a while now and look forward to his tips and analysis daily. Thanks",
  },
  {
    name: 'Lewis Cook',
    quote: "Even though it's not been the best month, it's been so beneficial to learn about EV and actually betting on the value of the outcome. Over time you will win as variance is something you will always have to deal with. This has completely changed my perspective of betting.",
  },
  {
    name: 'Cameron',
    quote: "Sonny's service is absolutely top notch, if you bet on football then this is definitely the service for you. His results speak for themselves, even in the bad periods he always seems to bounce back. The time and effort Sonny puts in shows in his picks and the results he produces for us.",
  },
  {
    name: 'Anton',
    quote: "Sonny is one of the few tipsters who shows full transparency in his wins and losses. No hassle to get assistance if you are unsure or inexperienced. I've been in the VIP for a while now and it's one of the best I've used.",
  },
  {
    name: 'JK',
    quote: "Immediately I recognised the immense sense of community that he has built. He is extremely responsive, committed to educating subscribers to becoming profitable bettors. Most importantly his bets are always thoroughly researched. The VIP group chat alone is worth the monthly investment.",
  },
  {
    name: 'Jason',
    quote: "Initially joined on a 3 day free trial which went great with just short of £200 profit in that time. I had no hesitation in signing up monthly and I'm now £250 in profit in just 1 week. The amount of detail with the guides and information given is excellent. Would highly recommend.",
  },
]

function TestimonialCard({ name, quote, delay }) {
  return (
    <div
      className="bg-[#404040] rounded-2xl p-7 md:p-8 relative group flex flex-col h-fit shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/10"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Quote icon */}
      <div className="text-primary mb-5">
        <Quote className="w-7 h-7" />
      </div>

      {/* Quote text - full quote, no truncation */}
      <p className="text-white/90 text-base leading-relaxed mb-6">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-5 border-t border-white/10 mt-auto">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-dark font-semibold text-sm">{name.charAt(0)}</span>
        </div>
        <div className="font-semibold text-primary">{name}</div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="section-light py-24 md:py-32 px-6"
    >
      <div className={`max-w-6xl mx-auto ${isVisible ? 'section-visible' : 'section-hidden'}`}>
        {/* Section header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-dark">
            Trusted by Thousands
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-dark/60 max-w-xl mx-auto">
            Feedback from members
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-start">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
