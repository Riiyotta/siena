import Hero from '../components/Hero.jsx'
import Testimonials from '../components/Testimonials.jsx'
import ScrollArea from '../components/ScrollArea.jsx'
import Metrics from '../components/Metrics.jsx'
import CustomerStories from '../components/CustomerStories.jsx'
import Features from '../components/Features.jsx'
import Integrations from '../components/Integrations.jsx'
import MainCta from '../components/MainCta.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Testimonials />
      <ScrollArea />
      <Metrics />
      <CustomerStories />
      <Features />
      <Integrations />
      <MainCta />
    </>
  )
}
