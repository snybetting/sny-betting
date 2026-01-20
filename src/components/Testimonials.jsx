import { useState, useEffect, useRef } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

// EDIT TESTIMONIALS HERE - Add new testimonials to this array
// Ordered by impact: detailed endorsements first
const TESTIMONIALS = [
  {
    name: 'Thomas',
    quote: "SNY has completely transformed the way I gamble. He's fully transparent with his P&L and does the hard work of consistently identifying genuine value bets. As long as you follow the advised bets and staking plan, the edge is clear. Not every bet wins, but that's just variance — long-term profitability is the goal, and the process delivers.",
  },
  {
    name: 'Cameron',
    quote: "Sonny's service is absolutely top notch, if you bet on football then this is definitely the service for you. His results speak for themselves, even in the bad periods he always seems to bounce back. The time and effort Sonny puts in shows in his picks and the results he produces for us.",
  },
  {
    name: 'JK',
    quote: "Immediately I recognised the immense sense of community that he has built. He is extremely responsive, committed to educating subscribers to becoming profitable bettors. Most importantly his bets are always thoroughly researched. The VIP group chat alone is worth the monthly investment.",
  },
  {
    name: 'Anton',
    quote: "Sonny is one of the few tipsters who shows full transparency in his wins and losses. No hassle to get assistance if you are unsure or inexperienced. I've been in the VIP for a while now and it's one of the best I've used.",
  },
  {
    name: 'Mikey Lawton',
    quote: "Used other tipsters before who tip bets at ridiculous units plus an expensive membership but since I have gone with yourself I have found myself consistently making money each month and the membership is definitely worth the money.",
  },
  {
    name: 'Lewis Cook',
    quote: "Even though it's not been the best month, it's been so beneficial to learn about EV and actually betting on the value of the outcome. Over time you will win as variance is something you will always have to deal with. This has completely changed my perspective of betting.",
  },
  {
    name: 'David Hoang',
    quote: "I have been with him the whole time I've been betting, everything just goes so smoothly, staking plan and everything. As long as you follow the advice nothing can go wrong. Cannot recommend the service enough, it even helped me quit monster to live longer.",
  },
  {
    name: 'Adam Crane',
    quote: "Sonny's service is top drawer. I have been a member for a while now and look forward to his tips and analysis daily. Thanks",
  },
  {
    name: 'James Wallace',
    quote: "Great service which is open, honest and clear. Can tell Sonny knows what he's doing and that there is a lot of profit to be made!",
  },
]

function TestimonialCard({ name, quote }) {
  return (
    <div className="bg-[#404040] rounded-2xl p-6 md:p-8 relative flex flex-col h-full shadow-xl border border-white/10">
      {/* Quote icon */}
      <div className="text-primary mb-4">
        <Quote className="w-6 h-6" />
      </div>

      {/* Quote text */}
      <p className="text-white/90 text-base leading-relaxed mb-6 flex-grow">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-auto">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-dark font-semibold text-sm">{name.charAt(0)}</span>
        </div>
        <div className="font-semibold text-primary">{name}</div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const sectionRef = useRef(null)
  const carouselRef = useRef(null)

  // Minimum swipe distance
  const minSwipeDistance = 50

  // Get number of visible cards based on screen size
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 1
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 768) return 2
    return 1
  }

  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount())
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, TESTIMONIALS.length - visibleCount)

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const goToPrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const goToIndex = (index) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) goToNext()
    if (isRightSwipe) goToPrev()
  }

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

  // Calculate dot indicators
  const totalDots = maxIndex + 1

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="section-light py-20 md:py-28 px-6 overflow-hidden"
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

        {/* Carousel container */}
        <div className="relative">
          {/* Navigation arrows - desktop only */}
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="hidden md:flex absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-dark text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark/80 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-dark text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark/80 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel track */}
          <div
            ref={carouselRef}
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {TESTIMONIALS.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-dark w-6'
                  : 'bg-dark/30 hover:bg-dark/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
