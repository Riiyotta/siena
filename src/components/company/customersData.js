import { filler } from './filler.js'

// specs/company.md U2 — 36 story cards in "All" order. [slug, logo, tags, title]
const RAW = [
  ['eskiin-social-media-customer-service-response-time', 'yPdio6eYzQ3Z8vtPBceOs019M.png', ['Beauty'], 'How Eskiin Answers Every Social Comment in Under a Minute and Got Three Days a Week Back'],
  ['thrive-causemetics-turned-customer-service-into-a-company-wide-intelligence-system', 'RVpmLl4ENxYALH5arYvLOF2hUY.svg', ['Beauty'], 'How Thrive Causemetics Turned Customer Service Into a Company-Wide Intelligence System'],
  ['spanx-turned-cx-business-driver-brand-experience', 'k1nvbViWWUDVEBy2xaOAlUgRSq0.png', ['Fashion', 'Lifestyle'], 'How Spanx Turned CX Into a Business Driver and Cut Handle Time in Half'],
  ['siena-ai-customer-service-automation-coterie', 'CzG1z9NEKoxzFuwvHCh0Lfb0.png', ['Lifestyle'], 'Coterie Turns CX into a Revenue Engine with 65% AI Automation'],
  ['dossier-handled-black-friday-customer-service-zero-panic', 'LSDtiaYEMw66OjmYASlgwlerh24.svg', ['Beauty'], 'How Dossier Scaled International Growth with AI Agents and Zero Black Friday Panic'],
  ['earth-breeze-scaling-customer-service-with-ai', 'j9kAeRPVaxAXfulnduynsbiTc.svg', ['Home Goods'], 'From AI Skeptic To Advocate: How Earth Breeze Scaled Customer Support Without Losing The Human Touch'],
  ['hexclad-customer-service-automation', 'DysnuY3oWCVroJab1Mx73kkVg4.svg', ['Home Goods'], 'HexClad Boosts CX Efficiency 65% with Customer Service Automation'],
  ['true-sea-moss-response-time-improvement', 'zy9mRkyxKisAjEUf8L7kCRTiI.png', ['Health & Nutrition'], 'True Sea Moss: Achieving 80% Automation and Unlocking a New Product Line with Siena AI'],
  ['comfrt-ai-customer-support-siena', 'cS9mAOIRGNEPFez1Fy9VQGafsQ.png', ['Fashion'], 'How Comfrt Achieved 65% Automation During Explosive Growth'],
  ['ehplabs', 'NzrOnMRFggp1QzWUKXstLpP2yVI.png', ['Health & Nutrition'], 'How EHPLabs handles 42% more tickets with smarter efficiency and an empowered team'],
  ['fresh-clean-threads-csat-boost', 'viVxpvqRgp5ynnq499GrMlfB0Ac.svg', ['Fashion'], 'Fresh Clean Threads Achieves 91% CSAT While Automating Tier 1 CX with Siena'],
  ['simple-modern', 'qpbEcjUraVURA3hGESyeVuyZZN4.svg', ['Home Goods'], 'How Siena helped Simple Modern achieve a 98% customer satisfaction rating'],
  ['everday-dose', 'RQ1zB2lwHhPRGxGNWzIqaXLRRw.png', ['Health & Nutrition'], 'Everyday Dose automates over 70% of shopper inquiries with Siena'],
  ['kitsch', 'NMMaJ8ZBHflI2DXZDaM4Bu6mY4.png', ['Beauty'], 'How Kitsch automates over 68% of their customer support using Siena'],
  ['mud-wtr', 'xm8gLEJzeS3t0TXpRyH46PEmocg.png', ['Health & Nutrition'], 'How MUD\\WTR Brewed Up a 4.8 CSAT Score with Siena AI'],
  ['momentous-using-ai-customer-service-agent', 'laiTWK4LZfsnrVZHxmAiKK22g.svg', ['Health & Nutrition'], 'How Momentous Achieved 100% Customer Satisfaction with Siena'],
  ['prose', 'SpxY1h6sqe6POaCpvGhqSGbxc.svg', ['Beauty'], 'Prose\'s Perfect Formula: Personalized Beauty Products and AI-Powered Empathic Support'],
  ['terra-kaffe', 'FAmVCc3xLG8QUhmtyJ3WkBGEeU.png', ['Home Goods'], 'How Siena helps Terra Kaffe expand CX capacity, improve CX metrics, save over $3,000 per month'],
  ['goody-faster-customer-service-response', 'vUaEZH5f85oxkdxCFmiAd8P8ZA.svg', ['Gifting & Consumer Goods'], 'How Goody Handled 3x More Conversations While Improving Quality'],
  ['canopy', '0JjqGImv5R5jQ7d8QYGXAnUOVA.png', ['Home Goods'], 'How Siena helps Canopy match CX capacity to seasonal demand by automating over 36% of support requests'],
  ['loftie', 'gO3x6192WCKAtB65XMiG41bNJo.png', ['Electronics'], 'How Loftie uses Siena to automate 60% of tickets and hit a 5-star support rating'],
  ['equip-foods-scaling-personalized-customer-service', 'wGvfbDAuOljwg1KwnrMA6NSIEMU.png', ['Health & Nutrition'], 'How Equip Foods Scaled Personalized CX with Siena and Open Late Collective'],
  ['western-rise-ai-customer-service-response-time', '83EJKkIYvJ792qe3DYfFh9yVwo.svg', ['Fashion'], '36 Seconds to Success: How Western Rise Used AI to Transform Team Potential'],
  ['bad-birdie-customer-service-automation', 'yTIExcu9M9XJvL1ACN3rBAIpQeQ.png', ['Lifestyle'], 'Bad Birdie: Reaching 80% Automation with Siena AI in One Month'],
  ['aday-scaling-customer-service-with-ai', 'R32uxsvtKZBcoEVJ192BcjdXKz4.png', ['Fashion'], 'From Skeptic to Advocate: How Aday Embraced AI to Scale Personal Customer Service'],
  ['fum-scales-support-while-maintaining-human-connection', 'yuv1GyrW4x3RoV3tbjTOrNLxyw.png', ['Health & Nutrition'], 'Building Connections at Scale: How FÜM Enhanced Customer Support with Siena'],
  ['fuel-meals', 'QneJbjbwOfyuvvba5LoTd515i0.svg', ['Health & Nutrition'], 'How Fuel Meals Transformed CX from Cost Center to Revenue Driver'],
  ['subtl-beauty', 'Pq81mgBAh3wCteDaPlYCPphE0w.svg', ['Beauty'], 'How Siena helps Subtl Beauty’s CX team save 41 hours per week and level up the impact of each member of the team'],
  ['verb-energy', 'sOKd7AwFJu2onVcd3HJi7RvS29g.svg', ['Food & Beverage'], 'How Verb automates 49% of its customer service tickets with Siena'],
  ['douxds', 'Hb8ztduGX6PNC0SM7a6VOQCbELU.png', ['Beauty'], 'How Siena helps Douxds save 44 hours per month and redeploy those hours toward growth'],
  ['yumwoof', 'f2IVv0SD8Ysx9G402DmViClSHgk.png', ['Pets'], 'How Yumwoof! Automated CX And Grew The Business At The Same Time'],
  ['andar', 'DeBzNPhBmu4Ga0NBJjKVAxgpEY.png', ['Fashion'], 'How Siena AI helped Andar give customers a sense of validation and made them feel heard'],
  ['superfoods-company', 'EA4gwHIcYh9cVLeJ79VplGYrtsM.png', ['Health & Nutrition'], 'How Superfoods Company cut ticket resolution times by 40% with Siena AI'],
  ['pluto', 'zVydFIQH7FDANnw6Oym4BKl8164.png', ['Home Goods'], 'How Pluto saves 290+ hours annually on customer support with Siena'],
  ['bokksu', 'hTrQ9hmKVXtuojDvJBYgd6fY44.png', ['Food & Beverage'], 'How Bokksu automates over 60% of customer support queries with Siena'],
  ['immi', 'ClvYfeeqaARZlaDvAkAsAKlyMKY.png', ['Food & Beverage'], 'How immi reduced response times from 24+ hours to minutes with Siena'],
]

export const STORIES = RAW.map(([slug, logo, tags, title]) => ({ slug, logo, tags, title }))

export const CATEGORIES = ['All', 'Beauty', 'Fashion', 'Food & Beverage', 'Health & Nutrition', 'Home Goods', 'Lifestyle', 'Electronics', 'Gifting & Consumer Goods', 'Pets']

// U3 wall of love. icon: FA6 Brands codepoint. Quotes are length-matched placeholders (see filler.js).
export const LOVE = [
  null,
  { quote: [filler(151, 4)], name: 'Yuxi Liu', handle: '@yuxiliu', avatar: 'sGwnNQeTHWr7A1joug53j9mibc.webp', icon: 0xf198 },
  { quote: [filler(277, 4)], name: 'Tanner Nelson', handle: '@tanneranelson', avatar: 'TLdXrM0Ns5C205YXarfUnZoUuY.webp', icon: 0xf08c },
  { quote: [filler(170, 2)], name: 'Rachel Reid', handle: '@rachelreid-sb', avatar: '41lIr5VsLY7853gfB7CIVgCQAw.webp', icon: 0xf08c },
  { quote: [filler(207, 4)], name: 'Mordechai Hoffman', handle: '@mordechaihoff', avatar: 'MMYBnqDv5MUAT7ixRfBpEQILI.jpg', icon: 0xe61a },
  { quote: [filler(178, 3)], name: 'Mordechai Hoffman', handle: '@mordechaihoff', avatar: 'MMYBnqDv5MUAT7ixRfBpEQILI.jpg', icon: 0xe61a },
  { quote: [filler(283, 3)], name: 'Chris Thompson', handle: '@chris-thompson', avatar: '5Q9fybvG1Blbexlw8P6VqAvM.webp', icon: 0xf08c },
  { quote: [filler(279, 6)], name: 'Cate Marquese', handle: '@cminall', avatar: 'WVZA37Bad6K0ss9JDOjwLhH2aUs.webp', icon: 0xf198 },
  { quote: [filler(63, 0), filler(166, 5)], name: 'Bryan Porter', handle: '@bryanporter', avatar: '7kFHraTWYSJ7R2Fi994w9w96VQ.png', icon: 0xf08c },
]

export const LOVE_COLUMNS = [
  { order: [1, 2, 3, 4, 5, 6, 7, 8], dir: 'up' },
  { order: [8, 7, 6, 4, 5, 3, 2, 1], dir: 'down' },
  { order: [6, 7, 8, 4, 5, 3, 2, 1], dir: 'up' },
]
