// Central content source for Bashaashaa Studio.
// All imagery is sourced from Unsplash (verified, live photo IDs) and
// forced to true black & white via the `sat=-100` parameter, so the
// palette stays consistent no matter the source photo's original grade.
const bw = (id, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80&sat=-100`;

export const heroSlides = [
  {
    id: 'hero-1',
    image: bw('photo-1634729108603-b3ea9ea28cc9', 2000),
    caption: 'Wedding Day',
  },
  {
    id: 'hero-2',
    image: bw('photo-1576280314550-773c50583407', 2000),
    caption: 'Behind the Camera',
  },
  {
    id: 'hero-3',
    image: bw('photo-1617725145063-56958eadf557', 2000),
    caption: 'Golden Hour',
  },
  {
    id: 'hero-4',
    image: bw('photo-1771478703148-efb96d5f749d', 2000),
    caption: 'Nikkah',
  },
];

export const galleryCategories = [
  {
    id: 'wedding',
    title: 'Wedding',
    image: bw('photo-1634729108603-b3ea9ea28cc9'),
    size: 'tall',
  },
  {
    id: 'graduation',
    title: 'Graduation',
    image: bw('photo-1639765766830-d829d2fe4219'),
    size: 'wide',
  },
  {
    id: 'birthday',
    title: 'Birthday',
    image: bw('photo-1577998474517-7eeeed4e448a'),
    size: 'short',
  },
  {
    id: 'nikkah',
    title: 'Nikkah',
    image: bw('photo-1673073220743-ee78b02eb029'),
    size: 'tall',
  },
  {
    id: 'cultural',
    title: 'Cultural Events',
    image: bw('photo-1515657834497-26509e295154'),
    size: 'short',
  },
  {
    id: 'maternity',
    title: 'Maternity',
    image: bw('photo-1636905012612-6a6128d980ed'),
    size: 'wide',
  },
  {
    id: 'kids',
    title: 'Kids Photography',
    image: bw('photo-1595760780346-f972eb49709f'),
    size: 'short',
  },
  {
    id: 'portrait',
    title: 'Portrait Photography',
    image: bw('photo-1494790108377-be9c29b29330'),
    size: 'tall',
  },
  {
    id: 'corporate',
    title: 'Corporate Events',
    image: bw('photo-1580894732444-8ecded7900cd'),
    size: 'wide',
  },
  {
    id: 'pre-wedding',
    title: 'Pre-Wedding',
    image: bw('photo-1617724975854-70b5d0cedb0a'),
    size: 'short',
  },
];

export const services = [
  {
    id: 'wedding',
    title: 'Wedding Photography',
    description:
      'A full-day narrative of your ceremony — from the quiet hours of preparation to the last dance. Every glance, every tear, every detail preserved exactly as it felt.',
    image: bw('photo-1617725145063-56958eadf557'),
  },
  {
    id: 'video-production',
    title: 'Video Production',
    description:
      'Cinematic wedding films, event highlight reels, and brand video — shot and edited with the same black-and-white sensibility as our photography, delivered ready to share.',
    image: bw('photo-1485846234645-a62644f84728'),
  },
  {
    id: 'graduation',
    title: 'Graduation Photography',
    description:
      'Years of work distilled into a single, defining frame. We photograph the pride on your face and the people who helped you get there.',
    image: bw('photo-1525921429624-479b6a26d84d'),
  },
  {
    id: 'birthday',
    title: 'Birthday Photography',
    description:
      'Candid, joyful coverage of the milestones worth celebrating loudly — from first birthdays to fiftieth ones.',
    image: bw('photo-1531956531700-dc0ee0f1f9a5'),
  },
  {
    id: 'nikkah',
    title: 'Nikkah Photography',
    description:
      'Elegant, respectful coverage of the Nikkah ceremony, attentive to tradition and the quiet significance of every ritual.',
    image: bw('photo-1716604435424-b24fb7b891c3'),
  },
  {
    id: 'cultural',
    title: 'Cultural Photography',
    description:
      'Documentary-style coverage that honors heritage — color, movement, and ceremony captured with care and cultural fluency.',
    image: bw('photo-1497271679421-ce9c3d6a31da'),
  },
  {
    id: 'maternity',
    title: 'Maternity Photography',
    description:
      'Soft, intimate portraits that hold the anticipation of a family about to grow. Timeless images for the years ahead.',
    image: bw('photo-1711313530954-39421910bc82'),
  },
  {
    id: 'kids',
    title: 'Kids Photography',
    description:
      'Unscripted, playful sessions that let a child\u2019s real personality lead — no forced smiles, just honest moments.',
    image: bw('photo-1519238263530-99bdd11df2ea'),
  },
  {
    id: 'portrait',
    title: 'Portrait Photography',
    description:
      'Studio or on-location portraiture built around light, posture, and presence — for the way you actually want to be remembered.',
    image: bw('photo-1573497019940-1c28c88b4f3e'),
  },
  {
    id: 'corporate',
    title: 'Corporate Photography',
    description:
      'Polished brand and team photography for websites, press, and leadership pages — professional without feeling stiff.',
    image: bw('photo-1627161684458-a62da52b51c3'),
  },
  {
    id: 'pre-wedding',
    title: 'Pre-Wedding Photography',
    description:
      'A relaxed, cinematic session that tells the story of you two before the big day — the calm before the celebration.',
    image: bw('photo-1630198908899-fc1226ddbac4'),
  },
];

export const testimonials = [
  {
    id: 't1',
    name: 'Selam & Dawit',
    role: 'Wedding, Jimma',
    quote:
      'Bashaashaa Studio captured our wedding exactly how we dreamed it \u2014 quiet, honest, and beautiful. We still find new details in the photos months later.',
    image: bw('photo-1573497161161-c3e73707e25c', 300),
  },
  {
    id: 't2',
    name: 'Meron T.',
    role: 'Portrait Session',
    quote:
      'Every picture tells a beautiful story. I have never felt more like myself in front of a camera.',
    image: bw('photo-1699899657680-421c2c2d5064', 300),
  },
  {
    id: 't3',
    name: 'Abel & Hana',
    role: 'Pre-Wedding',
    quote:
      'It didn\u2019t feel like a photoshoot. It felt like being followed by someone who genuinely cared about our story.',
    image: bw('photo-1651684215020-f7a5b6610f23', 300),
  },
  {
    id: 't4',
    name: 'Kidist A.',
    role: 'Maternity',
    quote:
      'Gentle, patient, and unbelievably talented. These are photos my daughter will have forever.',
    image: bw('photo-1560250097-0b93528c311a', 300),
  },
];

export const stats = [
  { label: 'Happy Clients', value: 500, suffix: '+' },
  { label: 'Years Experience', value: 10, suffix: '+' },
  { label: 'Moments Captured', value: 1000, suffix: '+' },
];
