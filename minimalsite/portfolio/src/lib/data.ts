export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt: string; caption?: string }[] }
  | { type: "video"; src: string; caption?: string }
  | { type: "gradient"; className: string }
  | { type: "list"; items: string[] }
  | { type: "link"; label: string; href: string; description?: string }
  | { type: "code"; code: string }
  | {
      type: "visualization";
      title: string;
      prompt: string;
      caption: string;
      media?: { type: "image" | "video"; src: string; alt: string };
    };

export interface JournalTrack {
  title: string;
  artist: string;
  albumArt?: string;
  spotifyUrl?: string;
  audioSrc?: string;
}

export interface JournalPost {
  slug: string;
  month: string;
  subtitle: string;
  date: string;
  year: number;
  coverImage?: string;
  coverGradient?: string;
  tracks: JournalTrack[];
  blocks: ContentBlock[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  year: number;
  tags: string[];
  featured?: boolean;
  externalUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  hero?: { type: "image" | "video"; src: string; alt: string };
  sections: { id: string; title: string; blocks: ContentBlock[] }[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  logo?: string;
  period: string;
  highlights?: string[];
}

export const experiences: Experience[] = [
  {
    id: "sandisk-2025",
    title: "Advanced Memory Intern",
    company: "SanDisk",
    logo: "/sandisk.svg",
    period: "Feb 2025 - Aug 2025",
    highlights: [
      "Built ML trim optimization platform to predict read-window outcomes using XGBoost, configurable DNNs, and clustering to guide trim selection across process corners.",
      "Scaled ingestion and feature pipelines to 48TB+ with NumPy, Pandas, and SQL, using parallelism and batching to cut manual optimization time by 7x.",
      "Automated experiments with an LLM-backed reporting stack and Dockerized workflows for reproducible execution across test sites.",
    ],
  },
  {
    id: "socet-2024",
    title: "ASIC Design Flow Researcher",
    company: "Purdue SoC Extension Technologies",
    logo: "/socetlogo.svg",
    period: "2023 - ",
    highlights: [
      "Built a Cadence Genus/Innovus physical flow for MITLL 20nm with automated congestion and IR-drop checks.",
      "Developed C operator kernels (GEMM, Softmax, ReLU) and integrated PyTorch with an in-house systolic-array accelerator.",
      "Optimized a GPU compiler to reduce divergence and improve scheduling for higher throughput.",
    ],
  },
  {
    id: "endian-2025",
    title: "Engineer",
    company: "Endian",
    period: "Mar 2025 - May 2025",
    highlights: [
      "Built an automation platform with Node.js and FastAPI, Dockerized and backed by Supabase, orchestrating a 20-agent browser-use fleet.",
      "Designed a security-first credential flow with incremental capture, client-side encryption, and secrets management.",
    ],
  },
  {
    id: "comma-2025",
    title: "Comma Capital Fellow",
    company: "Comma Capital",
    period: "2025",
    highlights: [
      "Selected fellow focused on frontier systems and AI infrastructure; collaborated on product and investment research.",
    ],
  },
  {
    id: "stars-2024",
    title: "Chip Design Intern",
    company: "STARS @Purdue",
    logo: "/purduelogo.svg",
    period: "Summer 2024",
    highlights: [
      "Designed and taped out a wireless messaging ASIC in SKY130 with GPIO, Wishbone bus control, and maskable interrupts.",
    ],
  },
  {
    id: "stanford-2022",
    title: "Student Researcher",
    company: "Stanford Cornfield Lab",
    logo: "/stanfordlogo.svg",
    period: "2022 - 2022",
  },
  {
    id: "ibm-2021",
    title: "Research Intern",
    company: "IBM Almaden",
    logo: "/ibmlogo.svg",
    period: "2021 - 2021",
  },
];

export const journalPosts: JournalPost[] = [
  {
    slug: "july",
    month: "july",
    subtitle: "finding excitement in the everyday",
    date: "July 31, 2025",
    year: 2025,
    coverImage: "/oai2.jpeg",
    coverGradient: "from-orange-300 via-pink-300 to-blue-300",
    tracks: [
      {
        title: "where you are",
        artist: "john summit",
        albumArt: "/whereyouare.jpg",
        audioSrc: "/whereyouare.mp3",
        spotifyUrl: "https://open.spotify.com/track/0bFBRve9nqszP6fC7eX8nY",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-orange-300 via-pink-300 to-blue-300" },
      {
        type: "quote",
        text: "music has been the fuel for a lot of my optimism and positivity.",
      },
      {
        type: "paragraph",
        text:
          "july passed by pretty fast, but there were many experiences to look back fondly on. i've been overcoming a hurdle of thinking that my life wasn't exciting enough to share with others. instead, i'm learning to normalize repetitiveness while taking on new adventures and being intentional with my time with others.",
      },
      {
        type: "paragraph",
        text:
          "this month has been about enjoying meeting new people and catching up with old friends. there's something beautiful about the rhythm of familiar faces and the excitement of new connections. i've realized that life doesn't need to be constantly groundbreaking to be meaningful--sometimes the most profound moments happen in the spaces between the big events.",
      },
      {
        type: "gallery",
        images: [
          {
            src: "/IMG_1493.JPG",
            alt: "Horseback riding on the beach",
            caption: "first time on horseback in years, feeling the ocean breeze",
          },
          {
            src: "/IMG_1760.JPG",
            alt: "Coastal landscape at sunset",
            caption: "sea ranch views that remind me to slow down",
          },
          {
            src: "/IMG_1887.JPG",
            alt: "Rocky shoreline at golden hour",
            caption: "finding beauty in the rugged coastline",
          },
          {
            src: "/IMG_2767.JPG",
            alt: "Mountain camping at dawn",
            caption: "backpacking for the first time in years",
          },
          {
            src: "/IMG_2847.jpg",
            alt: "Night sky over mountains",
            caption: "stargazing in the wilderness",
          },
          {
            src: "/IMG_3691.JPG",
            alt: "City skyline from rooftop",
            caption: "new york city weekend getaway",
          },
        ],
      },
      {
        type: "paragraph",
        text:
          "i backpacked for the first time in years, feeling the weight of my pack and the freedom of the trail. weekend getaways to sea ranch, ca and new york city reminded me that adventure doesn't have to be far-flung to be transformative. weekend bbq + poker with friends became these perfect moments of connection and laughter.",
      },
      { type: "gradient", className: "from-pink-300 via-blue-300 to-orange-300" },
      {
        type: "paragraph",
        text:
          "music has been the fuel for a lot of my optimism and positivity. i love house, techno, afro, progressive house, everything electronic dance music. there's something about the rhythm and energy that connects me to a deeper sense of joy and possibility. when i'm listening to the right track, everything feels possible.",
      },
      {
        type: "paragraph",
        text:
          "i've been learning to find excitement in the everyday. it's not about constantly seeking the next big thing, but about being present in the moments that make up a life. the coffee with a friend, the walk in the park, the late-night conversation--these are the threads that weave together into something beautiful.",
      },
      {
        type: "paragraph",
        text:
          "there's a certain magic in being intentional with time. when i'm fully present with someone, whether it's an old friend or someone i just met, i feel more alive. it's like each interaction is a small adventure, a chance to learn something new or see the world through different eyes.",
      },
      { type: "gradient", className: "from-blue-300 via-orange-300 to-pink-300" },
      {
        type: "paragraph",
        text:
          "july taught me that life doesn't need to be constantly extraordinary to be extraordinary. sometimes the most profound experiences come from the simple act of showing up, being present, and allowing yourself to be moved by the people and places around you. it's about finding the music in the everyday rhythm.",
      },
      {
        type: "paragraph",
        text:
          "as the month comes to a close, i'm grateful for these moments of connection and discovery. for the friends who make me laugh, the music that moves me, and the adventures that remind me of the beauty in both the grand and the simple. here's to finding excitement in the everyday and letting the rhythm carry us forward.",
      },
    ],
  },
  {
    slug: "june",
    month: "june",
    subtitle: "choosing commitment over comfort",
    date: "June 12, 2025",
    year: 2025,
    coverImage: "/oai4.jpg",
    coverGradient: "from-pink-300 via-fuchsia-300 to-red-300",
    tracks: [
      {
        title: "gesture",
        artist: "home alone",
        albumArt: "/gesture.jpg",
        audioSrc: "/gesture.mp3",
        spotifyUrl: "https://open.spotify.com/track/2r7E8XjJ1l9vD29kGZXV0K",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-pink-300 via-fuchsia-300 to-red-300" },
      {
        type: "quote",
        text:
          "i've been showing up to life just enough to say i'm there, but never enough to actually be there.",
      },
      {
        type: "paragraph",
        text:
          "june has been a month of harsh realizations and necessary reckonings. i've come to understand something fundamental about myself: i cannot function without challenges. when i'm not solving problems or pushing against something difficult, i spiral into depression. it's not optional for me--it's essential.",
      },
      {
        type: "paragraph",
        text:
          "i've realized i can't go through life just showing up, eating, sleeping--i'll get depressed. the human organism needs problem-solving, complex problems, stress, something difficult to overcome. it's through conquering these challenges that i can truly relax. i can't just have happiness all the time; that's not real. i have to experience discomfort to appreciate happiness. instead of dropping problems to avoid discomfort and never truly experiencing joy, i can actually value the things and people in my life by embracing that discomfort.",
      },
      {
        type: "paragraph",
        text:
          "lately, i've been reflecting on how i sometimes lose sight of my dreams. worse, i don't consistently establish and follow the goals needed to get closer to those dreams. i've been coasting, showing up just enough to say i'm in a space or working towards something, but not giving it my 100%. it's a comfortable lie i've been telling myself.",
      },
      {
        type: "paragraph",
        text:
          "i've convinced myself that my goals will work out with little bits of effort over time. maybe they will, but i personally feel that it's time to go 100% on something. if it doesn't work out, i need to have the discipline to go back to school and follow the traditional laid-out path. that's the deal i'm making with myself.",
      },
      { type: "gradient", className: "from-fuchsia-300 via-red-300 to-pink-300" },
      {
        type: "paragraph",
        text:
          "i live my life by the code of not following traditional footsteps. but in doing so, i take risks. and taking risks means i need to have a concrete plan. by the next blog post, i will have given my 100% towards something and made the decision whether to pursue it further or return to the laid-out path for a bit. this is my commitment to myself.",
      },
      {
        type: "paragraph",
        text:
          "because i haven't been giving 100% to anything recently, i find myself surrounded by amazing people yet somehow feeling empty and unworthy inside. months ago, i thought coming back to somewhere full of people i knew and admired would bring me meaning and happiness. now, i don't know if i'll ever be satisfied with enough of anything.",
      },
      {
        type: "paragraph",
        text:
          "this feeling has culminated from me valuing everything in my life very little for a while now. just like the higher i can get emotionally, the lower i can fall as well. right now, in this moment, i don't know what i'm searching for, how i can ever truly appreciate what i have, or what drives me and gives me meaning.",
      },
      { type: "gradient", className: "from-red-300 via-pink-300 to-fuchsia-300" },
      {
        type: "paragraph",
        text:
          "i've gotten much better at picking myself up from being down, but i still sporadically fall into periods of dissatisfaction and low self-esteem. i don't think it's sadness, but rather unhappiness with where i am given what i have and what i can do. the gap between my potential and my reality feels paralyzing.",
      },
      {
        type: "paragraph",
        text:
          "while i will continue growing my community of people that inspire me and i enjoy being around, i think what's important for me now is to work on motivating myself. the start to that is honestly pretending to be motivated when i am unmotivated, since that is really what motivation is at its core.",
      },
      {
        type: "paragraph",
        text:
          "same with bravery--in moments of peril, pretending to be brave is what sparks bravery. so i'm going to start there. fake it until i make it, but with intention and commitment. no more half-measures, no more comfortable lies. it's time to choose commitment over comfort.",
      },
    ],
  },
  {
    slug: "may",
    month: "may",
    subtitle: "redefining balance, purpose, and connections",
    date: "May 17, 2025",
    year: 2025,
    coverImage: "/WEBPtoJPG4.jpg",
    coverGradient: "from-yellow-100 via-blue-100 to-red-200",
    tracks: [
      {
        title: "house of love",
        artist: "smooth touch",
        albumArt: "/houseoflove.jpg",
        audioSrc: "/houseoflove.mp3",
        spotifyUrl: "https://open.spotify.com/track/7v0G2WwH1g1bEVF6t7F8x8",
      },
      {
        title: "unforgettable",
        artist: "smokepurpp",
        albumArt: "/unforgettable.jpg",
        audioSrc: "/unforgettable.mp3",
        spotifyUrl: "https://open.spotify.com/track/1w9m0wYdM0ZWsK8aZs1Xc9",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-yellow-100 via-blue-100 to-red-200" },
      {
        type: "quote",
        text:
          "to live in balance is to let disappointment pass through you, leaving only the shape of what you've learned.",
      },
      {
        type: "paragraph",
        text:
          "i am living may with more purpose--balancing adventure, friendship, and self-discovery. may always feels like a season of possibility, but also a time when i am questioning my place in the world.",
      },
      {
        type: "paragraph",
        text:
          "i have always hated being the one reaching out to others to catch up. it has felt like no one wants to reach out to me, and i have wondered if i am just forcing connections. but i have grown fine with that reality. i am seeing my initiative to catch up as a strength, not a weakness. i am proud to be the one who brings people together, even if it sometimes feels one-sided.",
      },
      {
        type: "paragraph",
        text:
          "my friends are all incredibly progress- and career-driven. i admire that, but i hope we all see each other for more than just our career value. i want our friendships to be about more than what we achieve. i want us to celebrate the small moments, the spontaneous adventures, and the simple joy of being together.",
      },
      { type: "gradient", className: "from-blue-100 via-yellow-100 to-red-200" },
      {
        type: "paragraph",
        text:
          "i have been realizing that most things i enjoy doing are not meaningful without friends. that is a tough truth, but it is also an opportunity. now, i am growing some passions on my own--finding things that light me up, even when i am alone. i want people to discover me for who i am, not just for what i do or who i know.",
      },
      {
        type: "paragraph",
        text:
          "i am excited for what is ahead. this may, i am embracing adventure, seeking out new opportunities, and learning to enjoy my own company. i am reaching out, not because i have to, but because i want to. and i am hopeful that the connections i am making--old and new--are deeper and more genuine than ever before.",
      },
    ],
  },
  {
    slug: "happiness",
    month: "happiness",
    subtitle: "ambition has made college lose true happiness",
    date: "April 25, 2025",
    year: 2025,
    coverImage: "/oai1.jpg",
    coverGradient: "from-purple-500 via-pink-500 to-blue-500",
    tracks: [
      {
        title: "sunflower feelings",
        artist: "kuzu mellow",
        albumArt: "/sunflowerfeelings.jpeg",
        audioSrc: "/sunflowerfeelings.mp3",
        spotifyUrl: "https://open.spotify.com/track/5H8gV0nYB0V3n3jX7aVtQ0",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-red-400 via-orange-300 to-indigo-300" },
      {
        type: "paragraph",
        text:
          "two years into college and i'm asking myself again: what the hell am i doing? who am i becoming? i've spent the past two years meticulously constructing my resume, obsessing over internships, and judging everyone--including myself--by a single metric: career potential.",
      },
      {
        type: "paragraph",
        text:
          "it started innocently enough. my first semester, i was just trying to \"get ahead,\" to \"set myself up for success.\" now i find myself categorizing people within seconds of meeting them. engineering major? respect. art history? what's your backup plan? i've become the human embodiment of linkedin, constantly calculating everyone's professional value while ignoring what makes them... human.",
      },
      {
        type: "quote",
        text: "i've been so busy building a career-worthy life that i forgot to build a life worth living.",
      },
      {
        type: "paragraph",
        text:
          "i wonder if my friends or classmates think i'm crushing it. from the outside, i'm this put-together, ambitious, cracked sophomore with a five-year plan and his shit figured out. they don't see me staring at the ceiling at night, wondering why success feels so empty. or scrolling through texts from high school friends i never grew close to again because who knows why. or realizing i haven't laughed--really laughed--in months.",
      },
      {
        type: "paragraph",
        text:
          "last week, my roommate invited me to a concert. my first instinct wasn't \"sounds fun\" but \"who will be there that could be useful for my career?\" that's when i knew something was broken in me. i'm 20 years old, and i've already turned my life into a never-ending job interview. the worst part? i'm not even passionate about the career i'm killing myself for. i'm chasing status, not fulfillment.",
      },
      { type: "gradient", className: "from-indigo-300 via-purple-400 to-fuchsia-300" },
      {
        type: "paragraph",
        text:
          "i've become so focused on being impressive that i've forgotten how to be present. i scroll through social media and mentally rank everyone's career trajectories instead of appreciating their joy. i have 1500+ linkedin connections but can't name five people who really know me. i've sacrificed deep connections for shallow networking, genuine interests for resume-building activities.",
      },
      {
        type: "paragraph",
        text:
          "the most messed up part? i've internalized capitalism so completely that i evaluate my own worth through the lens of productivity. watching a movie feels like wasted time. going for a walk without listening to an educational podcast feels irresponsible. my self-worth has become completely entangled with my perceived market value. no wonder i'm miserable.",
      },
      {
        type: "paragraph",
        text:
          "i can't even remember the last time i genuinely talked to someone for hours to someone not about internships or classes, but about our families, our fears, our favorite movies from childhood. i don't feel like a real person, more like a walking resume. now i wait for something revolutionary to come to me, most likely the reality is not. still, i know i will be the one to dig myself out of this as i have so many times before. i've noticed i've built this terrible habit of just dropping things and not caring about them when things get hard, and this needs to change. desperately waiting for someone to change me but i think i've realized that person is myself. still, i'm lost and confused. ive slowly lost motivation discipline and commitment to work and becoming someone that is fine with whatever comes to them in life while not giving something their everything. i go in cycles of hyper productivity to extremely low points of doing zero work in a week. i dont think this is me burning out, its just me being lazy. how should i go about fixing this?",
      },
      { type: "gradient", className: "from-fuchsia-300 via-pink-300 to-red-400" },
      {
        type: "paragraph",
        text:
          "being happy scares me. i don't think i deserve happiness, but it's more so the fear of happiness blinding me and inevitably causing more misery to ppl i care abt. tbh im so emotionally detached from everything. isn't there the saying of how being alone means nobody can hurt you and you cannot hurt anyone who cares about you. i don't have some grand solution yet. i'm not suddenly \"fixed.\" small steps. i'm trying to relearn how to value people--including myself--not for what we can achieve, but for who we are. because i'm starting to realize that being the perfect job candidate means nothing if you've lost yourself along the way.",
      },
      {
        type: "paragraph",
        text:
          "so if you're like me--someone who's been measuring life in linkedin endorsements and forgotten how to just be--maybe we can figure this out together. because i think there's more to these college years, more to life, than just preparing for some hypothetical career. at least, i really hope there is.",
      },
    ],
  },
  {
    slug: "college",
    month: "college",
    subtitle: "unexpected friends and experiences",
    date: "April 14, 2025",
    year: 2025,
    coverImage: "/oai3.jpg",
    coverGradient: "from-pink-200 via-rose-300 to-orange-200",
    tracks: [
      {
        title: "charcoal baby",
        artist: "blood orange",
        albumArt: "/charcoalbaby.jpg",
        audioSrc: "/charcoalbaby.mp3",
        spotifyUrl: "https://open.spotify.com/track/4jBfUBDkK4wzpv25VufQnS",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-pink-400 via-rose-300 to-orange-300" },
      {
        type: "paragraph",
        text:
          "this past semester has been nothing short of transformative. i've met so many incredible people who've expanded my world in ways i never expected. startup founders with audacious visions, industry leaders who somehow make time to mentor, and classmates who are both terrifyingly brilliant and refreshingly down-to-earth. it's humbling and exhilarating all at once.",
      },
      {
        type: "paragraph",
        text:
          "one weekend, i ended up on an impromptu trip with a mix of good friends and people i barely knew of. we stayed in some off grid cabin, and somehow in the span of two days, i genuinely enjoyed being around everyone. there's something about seeing people outside the classroom context--away from the polished performances we all put on--that accelerates closeness in ways that feel almost magical.",
      },
      {
        type: "quote",
        text:
          "what connects us isn't just our ambitions but the moments we admit we're struggling to reach them.",
      },
      {
        type: "paragraph",
        text:
          "i've discovered pockets of creativity i didn't know existed on campus. a fashion collective that puts on guerrilla runway shows in unexpected campus locations. a group of art students who sneak onto rooftops to draw the cityscape at sunset. runners who meet at 5am and somehow make it seem fun rather than torturous. each community has its own language, inside jokes, and rituals that make being part of it feel special.",
      },
      {
        type: "paragraph",
        text:
          "what's fascinating is the undercurrent of \"duck syndrome\" that connects us all--we're gliding seemingly effortlessly on the surface while paddling frantically underneath. it's weirdly comforting when someone i admire admits they're struggling too. the most profound bonding happens in those moments of vulnerability, when the facade cracks and we acknowledge how hard we're all working to stay afloat.",
      },
      { type: "gradient", className: "from-orange-300 via-rose-300 to-pink-400" },
      {
        type: "paragraph",
        text:
          "there's something powerful about being surrounded by people who are unapologetically pursuing their passions. my roommate who codes until 3am because she's building something she believes in. the guy from my writing workshop who's already published two sci-fi novellas. the international student who's creating a platform to connect rural artisans from her home country with global markets. their drive doesn't make me feel inadequate; it ignites something in me.",
      },
      {
        type: "paragraph",
        text:
          "i find myself wanting to match their energy, to contribute something meaningful. it's not competitive in a toxic way--it's this collective current pushing us all forward. when one person breaks through, achieves something remarkable, it expands our sense of what's possible. their success becomes proof that the rest of us can reach our goals too, even if those goals look completely different.",
      },
      {
        type: "paragraph",
        text:
          "we've created these core rituals that keep us grounded--weekly dinners where phones are banned, spontaneous study sessions that inevitably devolve into philosophical debates, celebrations for even minor victories. these shared experiences form a safety net. when imposter syndrome hits hard (which it does, regularly), there's always someone who can remind you of what you've already accomplished and why you belong here.",
      },
      {
        type: "paragraph",
        text:
          "i'm learning that being humbled by exceptional peers doesn't have to diminish me--it can actually expand my vision for myself. there's this quote i keep coming back to: \"surround yourself with people who make you uncomfortable with settling for less.\" that's what this semester has given me--a community that simultaneously accepts me exactly as i am and inspires me to become more.",
      },
      { type: "gradient", className: "from-rose-300 via-pink-400 to-orange-300" },
      {
        type: "paragraph",
        text:
          "there are days when i wonder if i belong among these incredible people. days when the gap between where i am and where i want to be feels impossibly wide. but then i remember that everyone starts somewhere, and that even the most accomplished people i've met are still works in progress themselves. we're all just at different points on similar journeys.",
      },
      {
        type: "paragraph",
        text:
          "as the semester ends, i'm grateful not just for what i've learned in classrooms, but for these unexpected connections that have shaped me. for late-night conversations that helped clarify my own dreams. for witnessing peers overcome obstacles that once seemed insurmountable. for finding a community that celebrates ambition while acknowledging vulnerability. college isn't just about building a resume--it's about building a constellation of relationships that illuminate possibilities i couldn't have imagined on my own.",
      },
    ],
  },
  {
    slug: "purpose",
    month: "purpose",
    subtitle: "finding what makes me",
    date: "December 22, 2024",
    year: 2024,
    coverImage: "/oai5.png",
    coverGradient: "from-blue-400 via-purple-400 to-pink-400",
    tracks: [
      {
        title: "here with me",
        artist: "d4v4d",
        albumArt: "/herewithme.jpg",
        audioSrc: "/herewithme.mp3",
        spotifyUrl: "https://open.spotify.com/track/5PjdY0CKGZdEuoNab3yDmX",
      },
    ],
    blocks: [
      { type: "gradient", className: "from-blue-400 via-purple-400 to-pink-400" },
      {
        type: "paragraph",
        text:
          "lately, i keep coming back to the question: what gives me purpose? is it personal growth, the praise of others, or the rare moments when i actually feel proud of myself? is it the number of people i know, or the depth of the connections i have? does my sense of self shape how others see me, or is it the other way around? do i feel valued, seen as someone with potential, or am i just hoping for it?",
      },
      {
        type: "paragraph",
        text:
          "i keep wondering if my purpose should be about what i do for others, or if it should be about my own growth and fulfillment. even if i help people or give them purpose, is that really what gives me purpose? or am i just searching for something to fill the space where meaning should be? sometimes i think about how much of my self-worth is tied to being recognized, and how much is just about being able to look at myself and feel content with who i am becoming.",
      },
      { type: "gradient", className: "from-blue-400 via-purple-400 to-pink-400" },
      {
        type: "paragraph",
        text:
          "i've realized that a lot of my drive comes from wanting to be seen as someone with potential, someone who is going somewhere. but the more i chase that, the more i wonder if i'm just running from the fear of being ordinary. is it enough to just be, or do i need to be impressive? i think about the times i've felt most alive--usually not when i'm being praised, but when i'm deeply engaged in something, or when i'm with people who make me feel understood.",
      },
      {
        type: "paragraph",
        text:
          "i used to think purpose would just appear, but now i see it's something i have to build, one uncomfortable step at a time. the truth is, most of the time, it's a lot of not fully vibing with people, awkward conversations, and rejection. but i'm starting to value these moments--they help me figure out what i want, and who i want to be purposeful with. i'm learning that the quality of my connections matters more than the quantity, and that being vulnerable is the only way to find people who really get me.",
      },
      { type: "gradient", className: "from-purple-400 via-blue-400 to-pink-400" },
      {
        type: "paragraph",
        text:
          "i'm still not sure if my purpose is supposed to be about others or just about me. maybe it's both. maybe it changes. i'm learning that it's okay to not have a clear answer. what matters is that i keep asking, keep trying, and keep showing up--even when it's awkward, even when it's hard. i'm starting to see that purpose isn't something you find--it's something you create, slowly, by being honest with yourself and others. it's in the moments you risk being misunderstood, the times you reach out even when you're scared, and the days you choose to keep going, even when you're not sure why.",
      },
      {
        type: "paragraph",
        text:
          "maybe purpose is about learning to be okay with not knowing, and finding meaning in the process of searching. maybe it's about letting go of the need to be perfect, and just being real. i'm still figuring it out, but for now, i'm grateful for the questions, the connections, and the chance to keep growing.",
      },
      {
        type: "quote",
        text: "maybe purpose is just the courage to keep searching.",
      },
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "tiny-gemm",
    title: "Tiny-GEMM",
    description:
      "Optimized Triton GEMM + fused transformer kernels for small-batch inference.",
    longDescription:
      "Tiny-GEMM is a collection of fused Triton kernels that make decode-time transformer inference fast on resource-constrained GPUs by minimizing memory traffic and fusing sublayers.",
    date: "2025",
    year: 2025,
    tags: [
      "Triton",
      "Kernel Fusion",
      "INT4",
      "Transformer Inference",
      "Profiling",
    ],
    featured: true,
    githubUrl: "https://github.com/zhan4808/gemmopt",
    hero: { type: "image", src: "/Qyyy.gif", alt: "Tiny-GEMM hero visual" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "modern transformer inference is often bottlenecked not by flops, but by memory traffic, kernel launch overhead, and poor cache utilization--especially in the small-batch, low-latency regime (batch = 1-8).",
          },
          {
            type: "paragraph",
            text:
              "tiny-gemm targets the two most dominant transformer compute paths: multi-head attention and feed-forward networks (mlps / ffns). the goal is to make decode-time inference fast by fusing operations, maximizing reuse in sram/cache, and exploiting packed int4 weights.",
          },
        ],
      },
      {
        id: "why-small-batch",
        title: "Why small-batch inference is hard",
        blocks: [
          {
            type: "paragraph",
            text:
              "most optimized gpu kernels are tuned for training-like throughput: large batch sizes, long steady-state compute, and high arithmetic intensity. real deployment looks different: batch size ~ 1, decode steps are sequential, memory dominates compute, and launch overhead matters.",
          },
          {
            type: "list",
            items: [
              "fusing whole transformer sublayers",
              "io-aware tiling",
              "weight-only quantization",
              "cache-aligned layouts",
            ],
          },
          {
            type: "visualization",
            title: "Figure 1 — Transformer Inference Bottleneck Map",
            prompt:
              "Show an attention + MLP block with arrows labeled 'HBM traffic dominates'. Emphasize memory movement and launch overhead over compute.",
            caption:
              "Small-batch inference is constrained less by compute and more by memory movement and kernel launch overhead.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-01.svg",
              alt: "Transformer inference bottleneck map",
            },
          },
        ],
      },
      {
        id: "fused-attention",
        title: "Fused multi-head attention kernel",
        blocks: [
          {
            type: "paragraph",
            text:
              "transformer attention is conceptually: Attn(Q,K,V) = Softmax((QK^T) / sqrt(d_k)) V. naively, this pipeline allocates large intermediate matrices (QK^T, masked scores, softmax probabilities).",
          },
          {
            type: "paragraph",
            text:
              "tiny-gemm computes attention in one fused triton kernel using a flashattention-style tiling approach. attention must be io-aware, minimizing reads/writes to hbm by keeping working tiles inside sram/registers.",
          },
          {
            type: "list",
            items: [
              "block tiling for batch=1 decode workloads",
              "fused causal masking (autoregressive safe)",
              "locality-aware q/k/v access",
              "optional dropout support",
            ],
          },
          {
            type: "visualization",
            title: "Figure 2 — Naive vs Fused Attention Pipeline",
            prompt:
              "Left: QK^T -> mask -> softmax -> V with four kernel boxes. Right: single fused block. Use minimal arrows and labels.",
            caption:
              "Tiny-GEMM computes attention in one fused Triton kernel, avoiding intermediate writes.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-02.svg",
              alt: "Naive vs fused attention pipeline",
            },
          },
          {
            type: "visualization",
            title: "Figure 3 — FlashAttention-Style Tiling in SRAM",
            prompt:
              "Block matrix tiles inside GPU SRAM with arrows showing on-chip reuse. Emphasize 'on-chip' vs 'HBM'.",
            caption:
              "IO-aware tiling keeps score computation and softmax normalization on-chip, reducing HBM reads/writes.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-03.svg",
              alt: "FlashAttention-style tiling in SRAM",
            },
          },
        ],
      },
      {
        id: "fused-ffn",
        title: "Fused feed-forward network (ffn)",
        blocks: [
          {
            type: "paragraph",
            text:
              "the transformer mlp block is typically: Y = sigma(XW1 + B1) W2 + B2. standard implementations launch gemm, bias add, activation, gemm, bias add. tiny-gemm fuses the full pipeline to reduce kernel boundaries, intermediate writes, and memory bandwidth.",
          },
          {
            type: "visualization",
            title: "Figure 4 — FFN Fusion: GEMM -> Act -> GEMM",
            prompt:
              "Show two GEMMs with activation between, crossed-out intermediate buffers, and a single fused box on the right.",
            caption:
              "FFN fusion eliminates bandwidth-heavy intermediate activations.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-04.svg",
              alt: "FFN fusion diagram",
            },
          },
        ],
      },
      {
        id: "int4",
        title: "Packed INT4 quantization framework",
        blocks: [
          {
            type: "paragraph",
            text:
              "for inference, weights dominate memory footprint. tiny-gemm implements per-channel int4 weight packing, custom dequantization in kernel, and packed int4 gemm primitives. int4 provides ~8x compression vs fp32 and boosts throughput in memory-bound regimes.",
          },
          {
            type: "visualization",
            title: "Figure 5 — Packed INT4 Weight Layout",
            prompt:
              "Diagram showing two INT4 packed into one byte. Use a simple 8-bit box split into two 4-bit halves.",
            caption:
              "Packed INT4 weights reduce memory footprint and improve cache residency, enabling faster weight-only inference.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-05.svg",
              alt: "Packed INT4 layout",
            },
          },
        ],
      },
      {
        id: "pytorch",
        title: "PyTorch operator integration",
        blocks: [
          {
            type: "paragraph",
            text:
              "tiny-gemm registers fused attention + ffn as first-class pytorch ops using torch.library. this enables integration into torch.compile graphs, transformer backends, and higher-level inference runtimes.",
          },
          {
            type: "code",
            code:
              "import tiny_gemm.ops\n\nout = torch.ops.tiny_gemm.fused_attention(q, k, v, causal=True)",
          },
          {
            type: "visualization",
            title: "Figure 7 — PyTorch Op Registration Stack",
            prompt:
              "Stacked diagram: torch.compile -> torch.library -> Triton kernel. Show flow arrows.",
            caption:
              "Custom operator registration makes fused kernels composable inside modern PyTorch inference graphs.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-07.svg",
              alt: "PyTorch op registration stack",
            },
          },
        ],
      },
      {
        id: "profiling",
        title: "Profiling + bottleneck discovery",
        blocks: [
          {
            type: "paragraph",
            text:
              "optimization work is only meaningful when guided by measurement. tiny-gemm includes pytorch profiler integration, tensorboard traces, and kernel-level bottleneck surfacing.",
          },
          {
            type: "list",
            items: [
              "profile -> identify io wall -> fuse -> retile -> benchmark -> repeat",
            ],
          },
        ],
      },
      {
        id: "benchmarks",
        title: "Benchmark highlights",
        blocks: [
          {
            type: "paragraph",
            text:
              "benchmarks compare baseline pytorch attention/ffn, fused triton kernels, and int4 quantized weights. gains are largest for batch=1-4, sequence length <= 2k, decode-style inference workloads.",
          },
          {
            type: "visualization",
            title: "Figure 6 — Benchmark Plot",
            prompt:
              "Line chart: PyTorch FP16 baseline, Tiny-GEMM fused, Tiny-GEMM INT4. Emphasize batch=1 decode gains.",
            caption:
              "Fused kernels + INT4 quantization provide the largest speedups in batch=1 decode workloads.",
            media: {
              type: "image",
              src: "/visuals/tiny-gemm/fig-06.svg",
              alt: "Benchmark plot",
            },
          },
        ],
      },
      {
        id: "structure",
        title: "Project structure",
        blocks: [
          {
            type: "list",
            items: [
              "triton_fused_transformer.py -- fused attention + ffn kernels",
              "triton_gemm.py -- packed int4 gemm",
              "quantize_utils.py -- quant/dequant utilities",
              "benchmark_fused_transformer.py -- benchmarking harness",
              "tiny_gemm/ops.py -- torch.library op registration",
              "docker/ -- reproducible cuda runtime",
            ],
          },
        ],
      },
      {
        id: "future",
        title: "Future work",
        blocks: [
          {
            type: "list",
            items: [
              "flashattention-2 style scheduling improvements",
              "additional fused blocks: layernorm + residual",
              "broader int4 support across hidden dimension patterns",
              "compiler-level integration into full transformer runtimes",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "verigen",
    title: "VeriGen: Agents for Accelerated Chip Design",
    description:
      "Integrated RTL design verification tool for testbench generation, script and trace analysis with multi-agent collaboration for accelerated RTL development.",
    longDescription:
      "VeriGen automates verification workflows with agents that generate testbenches, analyze traces, and help teams collaborate on RTL correctness faster.",
    date: "2025",
    year: 2025,
    tags: ["RTL", "Verification", "Agents", "SystemVerilog"],
    featured: true,
    hero: { type: "image", src: "/QwQ1.gif", alt: "VeriGen workflow" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "verigen is an integrated rtl design verification tool that accelerates chip design by automating testbench generation, script and trace analysis, and enabling multi-agent collaboration.",
          },
        ],
      },
      {
        id: "capabilities",
        title: "Capabilities",
        blocks: [
          {
            type: "list",
            items: [
              "automated testbench generation for rtl designs",
              "script and trace analysis for rapid debugging",
              "multi-agent collaboration for parallel verification",
            ],
          },
        ],
      },
      {
        id: "how-it-works",
        title: "How it works",
        blocks: [
          {
            type: "paragraph",
            text:
              "verigen leverages ai agents to generate and validate testbenches, analyze simulation traces, and suggest fixes. this reduces manual effort and speeds up the verification cycle.",
          },
        ],
      },
    ],
  },
  {
    slug: "artsage",
    title: "ArtSage",
    description:
      "Interactive AI museum exploration tool with image recognition and RAG workflows to identify art, retrieve museum data, and answer user prompts for enriched museum experience. Expanding with agentic features and AR.",
    longDescription:
      "ArtSage turns museum visits into interactive learning with image recognition, RAG-powered Q&A, and future AR-driven exploration.",
    date: "2025",
    year: 2025,
    tags: ["RAG", "Computer Vision", "AR", "AI"],
    featured: true,
    hero: { type: "image", src: "/QwQ1.gif", alt: "ArtSage demo" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "artsage is an interactive ai-powered tool for museum exploration. snap a photo of any artwork and artsage will identify it, retrieve museum data, and answer your questions using retrieval-augmented generation workflows.",
          },
        ],
      },
      {
        id: "features",
        title: "Features",
        blocks: [
          {
            type: "list",
            items: [
              "image recognition for artwork",
              "rag-based q&a about art and artists",
              "ar features for immersive museum experiences (coming soon)",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "omnom",
    title: "OmNom | TreeHacks 2025 Most Creative Hack Grand Prize",
    description:
      "An autonomous end-to-end 6-foot tall autonomous food delivery robot that navigates novel outdoor and indoor campus environments, interacts with ordering iPads, fetches and delivers late-night food.",
    longDescription:
      "A full-stack robotics prototype that handles navigation, interaction, and delivery, enabling students to focus while OmNom handles the late-night run.",
    date: "2025",
    year: 2025,
    tags: ["Robotics", "Autonomy", "HCI"],
    liveUrl: "https://devpost.com/software/omnom-hg16v3",
    hero: { type: "video", src: "/murmure6.mp4", alt: "OmNom demo video" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "omnom is a six-foot autonomous food delivery robot that navigates indoor and outdoor campus environments, interacts with ordering tablets, and completes end-to-end deliveries.",
          },
        ],
      },
      {
        id: "system",
        title: "System Architecture",
        blocks: [
          {
            type: "paragraph",
            text:
              "planned: animated system diagram showing perception, planning, navigation, and manipulation loops with live sensor feeds.",
          },
          {
            type: "video",
            src: "/murmure6.mp4",
            caption: "demo clip placeholder; replace with manim or rive overlay.",
          },
        ],
      },
      {
        id: "interaction",
        title: "Human Interaction",
        blocks: [
          {
            type: "paragraph",
            text:
              "this section will visualize the ordering flow and interaction loop with the kiosk using a stepwise animated diagram.",
          },
        ],
      },
    ],
  },
  {
    slug: "slynk",
    title: "slynk: Turning Ads into Experiences",
    description:
      "Reimagining ads with interactive AR avatars. meet and talk with your favorite celebrities with slynk, our AR app offering a new personalized immersive experience for discovering advertisements.",
    longDescription:
      "slynk turns ads into interactive experiences with ar avatars that meet and talk with users, unlocking personalized discovery.",
    date: "2024",
    year: 2024,
    tags: ["AR", "Mobile", "Experiential"],
    liveUrl: "https://devpost.com/software/slynk",
    hero: { type: "image", src: "/murmure3.gif", alt: "slynk demo" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "slynk explores how advertising can feel more like a conversation. interactive ar avatars help users meet, talk, and discover products through a personalized lens.",
          },
        ],
      },
      {
        id: "experience",
        title: "Experience Flow",
        blocks: [
          {
            type: "paragraph",
            text:
              "planned: conceptual animation of the avatar interaction loop and the personalization engine.",
          },
          {
            type: "image",
            src: "/murmure3.gif",
            alt: "slynk concept placeholder",
            caption: "placeholder visual; replace with manim or rive animation.",
          },
        ],
      },
    ],
  },
  {
    slug: "skin-ensemble",
    title:
      "Using an Ensemble of GANs and CNNs to More Accurately Generate and Diagnose Skin Condition Datasets in Diverse Skin Types",
    description:
      "Generated and validated synthetic images to address ethical AI bias due to lack of diverse skin condition images.",
    longDescription:
      "An ensemble of GANs and CNNs generates and validates synthetic skin condition images, improving dataset diversity and fairness.",
    date: "2024",
    year: 2024,
    tags: ["GANs", "CNNs", "Medical AI", "Bias"],
    hero: { type: "image", src: "/Murmure7.svg", alt: "Skin ensemble graphic" },
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "skin ensemble uses an ensemble of gans and cnns to generate and diagnose skin condition datasets, focusing on diversity and ethical ai.",
          },
        ],
      },
      {
        id: "approach",
        title: "Approach",
        blocks: [
          {
            type: "list",
            items: [
              "gans generate realistic skin condition images for underrepresented skin types",
              "cnns validate the generated images for accuracy",
              "ensemble methods improve robustness",
            ],
          },
          {
            type: "link",
            label: "View the full project PDF",
            href: "/skin-ensemble.pdf",
            description: "Full research write-up and results.",
          },
        ],
      },
    ],
  },
];

export const socialLinks = [
  { name: "GitHub", url: "https://github.com/zhan4808" },
  { name: "LinkedIn", url: "https://linkedin.com/in/robert05" },
  { name: "X", url: "https://x.com/robdobflob" },
  { name: "Email", url: "mailto:robertzhang930@gmail.com" },
];

export const aboutLinks = [
  { name: "Collaborations", url: "mailto:robertzhang930@gmail.com", icon: "/gmail.svg" },
  { name: "X", url: "https://x.com/robdobflob", icon: "/x.svg" },
  { name: "Instagram", url: "https://instagram.com/robert.zhang_", icon: "/instagram.svg" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/robert05/", icon: "/linkedin.svg" },
  { name: "GitHub", url: "https://github.com/zhan4808", icon: "/github.svg" },
  { name: "Beli", url: "https://beliapp.co/app/robertz", icon: "/beli.svg" },
];


export function getJournalsByYear(): Map<number, JournalPost[]> {
  const postsByYear = new Map<number, JournalPost[]>();
  for (const post of journalPosts) {
    const yearPosts = postsByYear.get(post.year) || [];
    yearPosts.push(post);
    postsByYear.set(post.year, yearPosts);
  }
  return new Map([...postsByYear.entries()].sort((a, b) => b[0] - a[0]));
}

export function getProjectsByYear(): Map<number, Project[]> {
  const projectsByYear = new Map<number, Project[]>();
  for (const project of projects) {
    const yearProjects = projectsByYear.get(project.year) || [];
    yearProjects.push(project);
    projectsByYear.set(project.year, yearProjects);
  }
  return new Map([...projectsByYear.entries()].sort((a, b) => b[0] - a[0]));
}
