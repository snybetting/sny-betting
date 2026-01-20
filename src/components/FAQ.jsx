import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ_DATA = [
  {
    question: 'What is a unit?',
    answer: 'We use a 100 unit bankroll, where 1 unit = 1% of your bankroll. For example, with a £1,000 bankroll, 1 unit = £10.',
  },
  {
    question: 'How do I follow your bets?',
    answer: (
      <>
        Simply join the free{' '}
        <a
          href="https://t.me/+KRBoF_MnFuhhZDVk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          Telegram channel
        </a>{' '}
        and turn on notifications.
      </>
    ),
  },
  {
    question: 'What sports do you bet on?',
    answer: 'Mainly soccer, but sometimes American Football, Basketball & Tennis.',
  },
  {
    question: 'Is this free?',
    answer: (
      <>
        Yes! I offer a{' '}
        <a
          href="https://t.me/+KRBoF_MnFuhhZDVk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          free service
        </a>{' '}
        with daily bets. There's also a{' '}
        <a
          href="https://t.me/+67pZuXXVM6pmZmRk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          VIP tier
        </a>{' '}
        for serious bettors who want access to every bet I place.
      </>
    ),
  },
  {
    question: 'How much can I make?',
    answer: 'It depends on your stake size and how long you follow. Check out the Profit Calculator above to see potential returns based on your unit size.',
  },
  {
    question: 'Do I need a big bankroll?',
    answer: 'No, you can start small. Many members start with just £100-200 and grow from there.',
  },
  {
    question: 'Which bookies do you use?',
    answer: 'Bet365, Sky Bet, Paddy Power, and Betfair.',
  },
  {
    question: "What if I miss a bet?",
    answer: "Don't worry - you can't catch them all. This is a long-term approach, so missing the odd bet won't hurt your overall results.",
  },
]

function AccordionItem({ question, answer, isOpen, onClick }) {
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  return (
    <div className="bg-[#404040] rounded-xl overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#4a4a4a] transition-colors"
      >
        <span className="font-semibold text-white pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className="transition-all duration-300 ease-out overflow-hidden"
        style={{ height }}
      >
        <div ref={contentRef} className="px-5 pb-5 text-white/70 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [isVisible, setIsVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
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

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-16 md:py-20 px-6 bg-[#333333] overflow-hidden"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none animate-gradient-shift"
        style={{
          background: `linear-gradient(
            110deg,
            #333333 0%,
            #333333 25%,
            rgba(208, 240, 192, 0.08) 40%,
            rgba(208, 240, 192, 0.12) 50%,
            rgba(208, 240, 192, 0.08) 60%,
            #333333 75%,
            #333333 100%
          )`,
          backgroundSize: '200% 100%',
        }}
      />
      <div className={`relative z-10 max-w-3xl mx-auto ${isVisible ? 'section-visible' : 'section-hidden'}`}>
        {/* Section header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_DATA.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
