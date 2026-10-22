// CLONE_SPEC §4 — pillar copy, chat-mock content and persona data.

export const PILLARS = [
  {
    title: 'The CX platform built for agents',
    bullets: [
      'AI agents that run support, shopping, social, QA, and VoC',
      'One system to consolidate your full CX stack',
      'Designed for AI from day one. Platform agnostic',
    ],
  },
  {
    title: 'Brand intelligence that unlocks growth at scale',
    bullets: [
      'Turn customer interactions into strategic business insights',
      'Activate intelligence across teams to drive revenue and retention',
      'Delight customers by anticipating needs better than anyone else',
    ],
  },
  {
    title: 'Your brand voice unified across all channels',
    bullets: [
      'AI Personas built on your tone, voice, and customer language',
      'Channel-specific design that holds together as one brand',
      'Every interaction reinforces what makes your brand yours',
    ],
  },
]

// Card backgrounds. Variant 3 uses a different image on mobile (§11).
export const CARD_BG = [
  { desktop: 'OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png', mobile: 'OS7uIQBhEtXd5l7MXZ0qAcM0Lg.png', alt: 'Hand holding a phone showing the Siena AI chat demo' },
  { desktop: '9jAbqJZIRcnPqEcOjQ13ZPF0.webp', mobile: '9jAbqJZIRcnPqEcOjQ13ZPF0.webp', alt: '' },
  { desktop: 'HrlKm73yASgQyND1oNoZ1Ub0Kj4.jpg', mobile: 'ufHpMeiISwDwuS87rNWJ1rkUhY.webp', alt: '' },
]

// Variant 1 rows: start delays 0.5/1.0/1.5/2.0/2.5s; first row rises from +80px, others +50px.
export const V1_ROWS = [
  { from: 'customer', fullAvatar: true, fill: true, delay: 0.5, y: 80, text: 'Hey! Need help with an order I placed yesterday—I forgot to apply my discount code.' },
  { from: 'siena', delay: 1.0, y: 50, text: 'No worries! I’ve got your order pulled up. I can apply the code “WELCOME15” and refund the difference—ready to go?' },
  { from: 'customer', delay: 1.5, y: 50, text: 'Yes please! Appreciate it.' },
  { from: 'siena', delay: 2.0, y: 50, text: 'Done. Also noticed you’ve bought from our skincare line twice—our new serum just dropped and it’s a perfect match. Want me to add it to your cart with 10% off?' },
  { from: 'customer', delay: 2.5, y: 50, text: 'Omg yes! That sounds amazing.' },
]

// Variant 2: customer 0.35s, product card 0.55s, Siena 0.95s; all from +80px.
export const V2 = {
  customer: { delay: 0.35, y: 80, text: 'Can you recommend a product based on my latest orders?' },
  product: { delay: 0.55, y: 80 },
  siena: {
    delay: 0.95,
    y: 80,
    text: "Based on your recent orders, I think you'd love the Grüns Superfood Gummies in Original. Want me to add it to your next order?",
  },
}

// Variant 3 personas. Jessie/Yogi bodies are swapped on the live site — copied as observed.
export const PERSONAS = [
  {
    name: 'Mabel',
    avatar: 'BilPHEdCbXjLRA68eDP6iIsgBao.webp',
    tags: ['Knowledgable', 'Chatty', 'Passionate', 'Barista'],
    body:
      'Hi Sammy,\n\nMaking our Mushroom Latte is easier than you might think! Just scoop the powder into a cup or dose mug, add enough water to cover the powder ad mix. Then add your preferred milk and stir it all together! Sit back, relax, and savor your newfound elevated feeling.\n\nBest,\nMable at Everyday Dose',
  },
  {
    name: 'Jessie',
    avatar: 'k7qGhbcvDgF5iYvCPZyc89zQOKQ.webp',
    tags: ['Mindful', 'Insightful', 'Honest', 'Educational'],
    body:
      'For hot yoga, I’d recommend pairing your practice with a full yoga mat towel, which is designed to absorb sweat and prevent any pooling of sweat on the mat, making your practice more comfortable.\n\nNamaste,\nYogi, Customer Care at YF',
  },
  {
    name: 'Yogi',
    avatar: 'v2nN38JC5smUrR0AjXOvYcJtKzE.webp',
    tags: ['Adventurous', 'Expert', 'Smart', 'Optimistic'],
    body:
      "We love the idea of making your Swoverall even more unique to you. We offer custom embroidery or screen printing for bulk orders on a case-by-case basis. Let's create something special together! 🎉👕🎨\n\nCheers,\nJessie at Waves",
  },
  {
    name: 'Sami',
    avatar: 'k7qGhbcvDgF5iYvCPZyc89zQOKQ.webp',
    tags: ['Playful', 'Happy', 'Resolute', 'Helpful'],
    body:
      "Our fresh food contains a variety of nutritious ingredients, such as chicken, pumpkin, kale, and blueberries, which support your dog's overall health and well-being. Plus, it's packed with vitamins and minerals to help your Cavalier King Charles thrive. Would you like to try a sample pack for your pup? 🐶\n\nChat soon,\nSami at Treats",
  },
]
