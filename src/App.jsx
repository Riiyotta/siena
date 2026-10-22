import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { NAV_OVERRIDES, ROUTES } from './routes.js'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'

const ShoppingAgent = lazy(() => import('./pages/ShoppingAgent.jsx'))
const SocialAgent = lazy(() => import('./pages/SocialAgent.jsx'))
const AiReviewManagement = lazy(() => import('./pages/AiReviewManagement.jsx'))
const QaAgent = lazy(() => import('./pages/QaAgent.jsx'))
const TopicsExplorer = lazy(() => import('./pages/TopicsExplorer.jsx'))
const AskSiena = lazy(() => import('./pages/AskSiena.jsx'))
const Memory = lazy(() => import('./pages/Memory.jsx'))
const Video = lazy(() => import('./pages/Video.jsx'))
const OrderTracking = lazy(() => import('./pages/OrderTracking.jsx'))
const Docs = lazy(() => import('./pages/Docs.jsx'))
const AiLab = lazy(() => import('./pages/AiLab.jsx'))
const RoiCalculator = lazy(() => import('./pages/RoiCalculator.jsx'))
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'))
const Careers = lazy(() => import('./pages/Careers.jsx'))
const Customers = lazy(() => import('./pages/Customers.jsx'))
const Community = lazy(() => import('./pages/Community.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const PartnerWithSiena = lazy(() => import('./pages/PartnerWithSiena.jsx'))
const ReferAFriend = lazy(() => import('./pages/ReferAFriend.jsx'))
const Pricing = lazy(() => import('./pages/Pricing.jsx'))
const BookADemo = lazy(() => import('./pages/BookADemo.jsx'))
const CompareGorgias = lazy(() => import('./pages/CompareGorgias.jsx'))
const CompareKustomer = lazy(() => import('./pages/CompareKustomer.jsx'))
const AiNativeVsAddOns = lazy(() => import('./pages/AiNativeVsAddOns.jsx'))
const Insights = lazy(() => import('./pages/Insights.jsx'))
const InsightSentimentAnalysis = lazy(() => import('./pages/InsightSentimentAnalysis.jsx'))
const InsightVoiceOfCustomer = lazy(() => import('./pages/InsightVoiceOfCustomer.jsx'))
const InsightFeedbackAnalytics = lazy(() => import('./pages/InsightFeedbackAnalytics.jsx'))
const Conversations = lazy(() => import('./pages/Conversations.jsx'))
const ConversationThrive = lazy(() => import('./pages/ConversationThrive.jsx'))
const ConversationProse = lazy(() => import('./pages/ConversationProse.jsx'))
const ConversationSpanx = lazy(() => import('./pages/ConversationSpanx.jsx'))
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))

const PAGES = { ShoppingAgent, SocialAgent, AiReviewManagement, QaAgent, TopicsExplorer, AskSiena, Memory, Video, OrderTracking, Docs, AiLab, RoiCalculator, AboutUs, Careers, Customers, Community, Events, PartnerWithSiena, ReferAFriend, Pricing, BookADemo, CompareGorgias, CompareKustomer, AiNativeVsAddOns, Insights, InsightSentimentAnalysis, InsightVoiceOfCustomer, InsightFeedbackAnalytics, Conversations, ConversationThrive, ConversationProse, ConversationSpanx, TermsOfService, PrivacyPolicy }

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Nav + Footer, unless the route renders its own (NAV_OVERRIDES hideChrome / hideNav)
function Chrome({ children }) {
  const { pathname } = useLocation()
  const { hideChrome, hideNav } = NAV_OVERRIDES[pathname] ?? {}
  return (
    <>
      {!hideChrome && !hideNav && <Nav />}
      {children}
      {!hideChrome && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Chrome>
        <main className="flex flex-col">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              {ROUTES.map(([path, name]) => {
                const Page = PAGES[name]
                return <Route key={path} path={path} element={<Page />} />
              })}
            </Routes>
          </Suspense>
        </main>
      </Chrome>
    </BrowserRouter>
  )
}
