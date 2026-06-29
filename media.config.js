/* =========================================================
   MAXFIT — Media Library (edit this file to swap assets)
   Drop files into /images and /videos folders using the
   exact filenames below. Missing files auto-fallback to
   the placeholder URLs until you add your own.
========================================================= */

window.MAXFIT_MEDIA = {
  hero: {
    src: 'images/hero.jpg',
    fallback: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1600&auto=format&fit=crop'
  },

  trainers: [
    { name: 'Coach Ada Eze', spec: 'Fat Loss Specialist',
      img: 'images/trainers/ada-eze.jpg',
      fallback: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop' },
    { name: 'Coach Tunde Bello', spec: 'Strength Coach',
      img: 'images/trainers/tunde-bello.jpg',
      fallback: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=200&auto=format&fit=crop' },
    { name: 'Coach Chidi Obi', spec: 'Football Performance',
      img: 'images/trainers/chidi-obi.jpg',
      fallback: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=200&auto=format&fit=crop' },
    { name: 'Coach Funmi Lawal', spec: 'Beginner Specialist',
      img: 'images/trainers/funmi-lawal.jpg',
      fallback: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200&auto=format&fit=crop' },
    { name: 'Coach Ifeoma Nnaji', spec: 'Endurance Coach',
      img: 'images/trainers/ifeoma-nnaji.jpg',
      fallback: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' }
  ],

  /* Exercise reels — add poster JPG + matching MP4 in videos/reels/ */
  reels: [
    { name: 'Sled Push Sprints', cat: 'Fat Loss', diff: 'Intermediate', cal: '320', dur: '12 min',
      poster: 'images/reels/sled-push.jpg', video: 'videos/reels/sled-push.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop' },
    { name: 'Barbell Back Squat', cat: 'Strength', diff: 'Advanced', cal: '180', dur: '18 min',
      poster: 'images/reels/barbell-squat.jpg', video: 'videos/reels/barbell-squat.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop' },
    { name: 'Jump Rope Intervals', cat: 'Cardio', diff: 'Beginner', cal: '260', dur: '10 min',
      poster: 'images/reels/jump-rope.jpg', video: 'videos/reels/jump-rope.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=600&auto=format&fit=crop' },
    { name: 'Kettlebell Complex', cat: 'Functional', diff: 'Intermediate', cal: '290', dur: '15 min',
      poster: 'images/reels/kettlebell.jpg', video: 'videos/reels/kettlebell.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=600&auto=format&fit=crop' },
    { name: 'Cone Agility Drill', cat: 'Football', diff: 'Intermediate', cal: '210', dur: '14 min',
      poster: 'images/reels/cone-drill.jpg', video: 'videos/reels/cone-drill.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=600&auto=format&fit=crop' },
    { name: 'Hanging Leg Raises', cat: 'Core', diff: 'Advanced', cal: '140', dur: '9 min',
      poster: 'images/reels/leg-raises.jpg', video: 'videos/reels/leg-raises.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop' },
    { name: 'Hip Mobility Flow', cat: 'Mobility', diff: 'Beginner', cal: '95', dur: '11 min',
      poster: 'images/reels/hip-mobility.jpg', video: 'videos/reels/hip-mobility.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=600&auto=format&fit=crop' },
    { name: 'Battle Ropes Burnout', cat: 'Fat Loss', diff: 'Advanced', cal: '340', dur: '8 min',
      poster: 'images/reels/battle-ropes.jpg', video: 'videos/reels/battle-ropes.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?q=80&w=600&auto=format&fit=crop' },
    { name: 'Deadlift Technique', cat: 'Strength', diff: 'Intermediate', cal: '200', dur: '16 min',
      poster: 'images/reels/deadlift.jpg', video: 'videos/reels/deadlift.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop' },
    { name: 'Box Jump Circuit', cat: 'Cardio', diff: 'Intermediate', cal: '280', dur: '12 min',
      poster: 'images/reels/box-jump.jpg', video: 'videos/reels/box-jump.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
    { name: 'Shuttle Run Drills', cat: 'Football', diff: 'Advanced', cal: '250', dur: '13 min',
      poster: 'images/reels/shuttle-run.jpg', video: 'videos/reels/shuttle-run.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop' },
    { name: 'Plank-to-Push-Up', cat: 'Core', diff: 'Beginner', cal: '110', dur: '7 min',
      poster: 'images/reels/plank-pushup.jpg', video: 'videos/reels/plank-pushup.mp4',
      posterFallback: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=600&auto=format&fit=crop' }
  ],

  stories: [
    { name: 'Emeka, 32', achieve: '-14kg in 4 months',
      quote: 'I went from skipping the gym every week to never missing a session. The trainer matching made all the difference.',
      before: 'images/stories/emeka-before.jpg', after: 'images/stories/emeka-after.jpg',
      beforeFallback: 'https://images.unsplash.com/photo-1583500178690-f7fd8b3a4a40?q=80&w=300&auto=format&fit=crop',
      afterFallback: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=300&auto=format&fit=crop' },
    { name: 'Zainab, 27', achieve: '+8kg lean muscle',
      quote: 'The dashboard kept me accountable. Watching my strength numbers climb every week is addictive.',
      before: 'images/stories/zainab-before.jpg', after: 'images/stories/zainab-after.jpg',
      beforeFallback: 'https://images.unsplash.com/photo-1571907480495-3c1c62e1a5a3?q=80&w=300&auto=format&fit=crop',
      afterFallback: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=300&auto=format&fit=crop' },
    { name: 'David, 24', achieve: 'Signed semi-pro club',
      quote: 'The football conditioning program got my sprint times down and earned me a trial. MAXFIT changed my career.',
      before: 'images/stories/david-before.jpg', after: 'images/stories/david-after.jpg',
      beforeFallback: 'https://images.unsplash.com/photo-1517466787156-3633afaf2d7a?q=80&w=300&auto=format&fit=crop',
      afterFallback: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=300&auto=format&fit=crop' },
    { name: 'Grace, 41', achieve: '-21kg in 9 months',
      quote: 'At 41, I didn\u2019t think transformation like this was possible. My trainer and the nutrition hub proved me wrong.',
      before: 'images/stories/grace-before.jpg', after: 'images/stories/grace-after.jpg',
      beforeFallback: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?q=80&w=300&auto=format&fit=crop',
      afterFallback: 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?q=80&w=300&auto=format&fit=crop' }
  ]
};

/** Apply local src with automatic fallback if file is missing */
window.maxfitImg = function maxfitImg(el, src, fallback){
  if (!el) return;
  el.src = src;
  el.onerror = function(){
    this.onerror = null;
    if (fallback) this.src = fallback;
  };
};
