import type { TeachingResponse, LessonContent } from "./schema";

/** Offline lesson + quiz generator with rich classroom templates. */

type Template = {
  match: RegExp;
  subject: string;
  theme: TeachingResponse["theme"];
  visualTitle: string;
  steps: { icon: string; label: string }[];
  lesson: LessonContent;
  quiz: { question: string; options: [string, string, string, string]; correctAnswer: string; explanation: string }[];
};

const PHOTOSYNTHESIS: Template = {
  match: /photosynth/i,
  subject: "Science",
  theme: "nature",
  visualTitle: "Photosynthesis Process",
  steps: [
    { icon: "☀️", label: "Sunlight (energy)" },
    { icon: "🍃", label: "Leaf absorbs CO₂" },
    { icon: "💧", label: "Roots se Paani" },
    { icon: "🟢", label: "Chlorophyll reaction" },
    { icon: "🍬", label: "Glucose (food)" },
    { icon: "💨", label: "Oxygen release" },
  ],
  lesson: {
    hook: "Kya aapne kabhi socha hai ki plants apna khaana kahan se laate hain? Na maa hai, na kitchen — phir bhi pet bharta hai!",
    concept:
      "Photosynthesis ek chemical process hai jisme green plants sunlight ki energy use karke carbon dioxide aur paani ko mila kar glucose (sugar) aur oxygen banate hain. Yeh process leaves ke andar chloroplast naam ke special parts me hota hai, jisme chlorophyll naam ka green pigment sunlight ko trap karta hai. Equation hai: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂.",
    whyItMatters:
      "Photosynthesis ke bina earth par life possible nahi hai — humein jo oxygen saans lene ko milti hai aur jo food chain start hoti hai, sab yahin se aata hai. Exam me bhi yeh chapter har board me aata hai.",
    keyPoints: [
      "Chlorophyll naam ka green pigment sunlight ko absorb karta hai (mostly red aur blue wavelength).",
      "Stomata leaves me chhote pores hote hain jisse CO₂ andar aata aur O₂ bahar jaata hai.",
      "Glucose plant ka food banta hai, aur extra glucose starch ke form me store hota hai.",
      "Oxygen ek by-product hai jo hamari saans ke liye essential hai.",
      "Yeh process sirf day-time me hota hai jab sunlight available ho.",
    ],
    subtopics: [
      { title: "Light reaction", detail: "Sunlight paani ko todta hai — oxygen release hoti hai, energy ATP me store hoti hai." },
      { title: "Dark reaction (Calvin cycle)", detail: "CO₂ aur ATP milkar glucose banate hain, sunlight ki zaroorat nahi." },
      { title: "Chloroplast", detail: "Cell ke andar green organelle jaha photosynthesis hota hai." },
    ],
    examples: [
      "Tulsi ke plant ko 2 din andhere me rakho — leaves yellow padne lagti hain.",
      "Money plant kitchen me sunlight ke paas zyada tezi se grow karta hai.",
      "Subah taazi hawa park me oxygen-rich hoti hai — kyunki raat bhar plants ne tayyar ki hoti hai.",
      "Iodine test: leaf me starch hoti hai to blue-black colour aata hai.",
    ],
    mistakes: [
      "Students sochte hain plants mitti se food lete hain — actually mitti se sirf minerals milte hain.",
      "Photosynthesis aur respiration ko same samajhna — yeh opposite processes hain.",
      "Sirf green leaves ko important samajhna — green stems bhi photosynthesis karte hain.",
    ],
    classroomQuestion: "Agar suraj ek hafte tak na nikle, to plants aur humare environment par kya effect hoga?",
    activity:
      "Ek leaf par 2 din ke liye black paper strip chipka do. Phir leaf ko todh kar iodine test karo — covered area me starch nahi banegi, baaki me banegi. Yahi photosynthesis ka proof hai.",
    summary: "Plants sunlight, paani aur CO₂ se apna khaana banate hain aur oxygen dete hain — isi miracle ka naam hai Photosynthesis.",
    teacherScript:
      "Bachcho, ek plant ko dekho — kya wo school canteen jaata hai khaana khaane?\nNahi na! To phir wo zinda kaise hai?\nAaj hum samjhenge ki plants apna khaana khud kaise banate hain.\nIs process ka naam hai Photosynthesis — photo matlab light, synthesis matlab banana.\nBoard par equation likho: 6CO₂ + 6H₂O + sunlight → glucose + 6O₂.",
    studentQuestions: [
      "Sir, raat ko plants kya karte hain?",
      "Kya cactus bhi photosynthesis karta hai?",
      "Agar leaf green nahi hai to kya process hoga?",
    ],
    expectedAnswers: [
      "Raat ko sirf respiration hota hai — oxygen lete hain, CO₂ chhodte hain.",
      "Haan, cactus ke green stems me chlorophyll hoti hai isliye wahin process hota hai.",
      "Red ya purple leaves me bhi chlorophyll hoti hai, bas doosre pigments uspe chha jaate hain.",
    ],
  },
  quiz: [
    { question: "Photosynthesis ke liye main energy source kya hai?", options: ["Paani", "Sunlight", "Mitti", "Hawa"], correctAnswer: "Sunlight", explanation: "Sunlight ko chlorophyll absorb karta hai." },
    { question: "Plants kaunsi gas absorb karte hain?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: "Carbon Dioxide", explanation: "CO₂ stomata se andar jaati hai." },
    { question: "Green pigment ka naam kya hai?", options: ["Glucose", "Chlorophyll", "Starch", "Xylem"], correctAnswer: "Chlorophyll", explanation: "Chlorophyll chloroplast me hota hai." },
    { question: "Photosynthesis ka by-product kaunsa gas hai?", options: ["CO₂", "Nitrogen", "Oxygen", "Hydrogen"], correctAnswer: "Oxygen", explanation: "Oxygen release hoti hai jo hum saans lete hain." },
    { question: "Photosynthesis mainly kahan hota hai?", options: ["Roots", "Stem", "Leaves", "Flowers"], correctAnswer: "Leaves", explanation: "Leaves me chloroplast bahut hote hain." },
  ],
};

const WATER_CYCLE: Template = {
  match: /water\s*cycle|hydrolog/i,
  subject: "Science",
  theme: "nature",
  visualTitle: "Water Cycle Stages",
  steps: [
    { icon: "☀️", label: "Evaporation" },
    { icon: "☁️", label: "Condensation" },
    { icon: "🌧️", label: "Precipitation" },
    { icon: "🏞️", label: "Collection" },
    { icon: "🌊", label: "Runoff to ocean" },
  ],
  lesson: {
    hook: "Aaj jo paani aap pee rahe ho, woh shayad dinosaur ke time ka bhi ho sakta hai! Kaise? Aaiye dekhte hain.",
    concept:
      "Water cycle (jal chakra) ek continuous process hai jisme earth ka paani liquid, vapor aur ice form me badalta rehta hai. Sun ki heat se ocean, river aur lake ka paani vapor ban kar upar uthta hai (evaporation), upar thanda hokar badal banta hai (condensation), phir rain ya snow ban kar zameen par girta hai (precipitation), aur wapas rivers ke through ocean tak pahunch jaata hai.",
    whyItMatters:
      "Water cycle se hi farmers ko barish milti hai, rivers chalti hain aur drinking water available hota hai. Climate change ko samajhne ke liye bhi yeh foundation hai.",
    keyPoints: [
      "Evaporation: liquid paani sun ki heat se gas (water vapor) ban jaata hai.",
      "Transpiration: plants ke leaves se bhi paani vapor ban kar nikalta hai.",
      "Condensation: thandi hawa me vapor chhote droplets ban kar badal banaata hai.",
      "Precipitation: badal bhaari ho jaayein to rain, snow ya hail girta hai.",
      "Collection: paani river, lake aur ocean me jama hota hai — cycle phir shuru.",
    ],
    subtopics: [
      { title: "Evaporation", detail: "Sun ki energy se surface ka paani vapor banta hai." },
      { title: "Condensation", detail: "Upar thandi temperature me vapor liquid droplets banta hai." },
      { title: "Precipitation", detail: "Rain, snow, sleet ya hail — sab precipitation ke forms hain." },
      { title: "Groundwater", detail: "Kuchh paani zameen ke andar seep hokar wells aur springs banata hai." },
    ],
    examples: [
      "Geyser se bhaap nikalna — chhota evaporation example.",
      "Subah grass par os ki boondein — condensation ka result.",
      "Monsoon me Mumbai me lagataar barish — precipitation stage.",
      "Ganga river ka Bay of Bengal me milna — collection.",
    ],
    mistakes: [
      "Evaporation aur boiling ko same samajhna — evaporation kisi bhi temperature par ho sakta hai.",
      "Badal ko gas samajhna — badal actually tiny water droplets ka collection hai.",
      "Bhool jaana ki plants bhi transpiration ke through paani vapor banate hain.",
    ],
    classroomQuestion: "Agar earth par water cycle ruk jaaye to ek hafte me kya hoga?",
    activity:
      "Ek transparent zipper bag me thoda paani daal kar window ke dhoop me chipka do. 1 ghante me andar boondein dikhengi — yahi mini water cycle hai (evaporation + condensation).",
    summary: "Paani sun ki heat se vapor banta, badal banta, barish hokar wapas zameen pe aata — yahi hai water cycle.",
    teacherScript:
      "Bachcho, kabhi socha barish kahan se aati hai?\nKya bhagwan upar se balti bhar bhar ke daalte hain? Nahi!\nYeh ek beautiful cycle hai jise water cycle kehte hain.\nBoard par 4 words likho: Evaporation, Condensation, Precipitation, Collection.\nAb ek-ek karke samjhte hain.",
    studentQuestions: [
      "Sir, ocean ka khaara paani barish me meetha kaise ho jaata hai?",
      "Snow bhi water cycle ka part hai kya?",
      "Agar mai paani pee lun to wo bhi cycle me wapas jaayega?",
    ],
    expectedAnswers: [
      "Evaporation me sirf pure water vapor banta hai, salt peeche reh jaata hai.",
      "Haan, snow precipitation ka frozen form hai.",
      "Haan, hamare body se sweat aur urine ke through paani wapas cycle me jaata hai.",
    ],
  },
  quiz: [
    { question: "Paani vapor kaise banta hai?", options: ["Cooling", "Evaporation", "Freezing", "Melting"], correctAnswer: "Evaporation", explanation: "Sun ki heat se liquid se gas." },
    { question: "Badal kaise banta hai?", options: ["Evaporation", "Condensation", "Precipitation", "Collection"], correctAnswer: "Condensation", explanation: "Vapor thanda hokar droplets banata hai." },
    { question: "Rain kis stage me girta hai?", options: ["Evaporation", "Condensation", "Precipitation", "Runoff"], correctAnswer: "Precipitation", explanation: "Bhaari badal se paani girta hai." },
    { question: "Water cycle ka main energy source?", options: ["Moon", "Sun", "Wind", "Stars"], correctAnswer: "Sun", explanation: "Sun ki heat cycle ko drive karti hai." },
    { question: "Plants ke through paani vapor banne ka process?", options: ["Evaporation", "Transpiration", "Condensation", "Respiration"], correctAnswer: "Transpiration", explanation: "Leaves ke stomata se vapor nikalta hai." },
  ],
};

const SOLAR_SYSTEM: Template = {
  match: /solar\s*system|planet/i,
  subject: "Astronomy",
  theme: "science",
  visualTitle: "Solar System (Sun → Neptune)",
  steps: [
    { icon: "☀️", label: "Sun (star)" },
    { icon: "☿", label: "Mercury" },
    { icon: "♀", label: "Venus" },
    { icon: "🌍", label: "Earth" },
    { icon: "♂", label: "Mars" },
    { icon: "🪐", label: "Jupiter → Neptune" },
  ],
  lesson: {
    hook: "Raat ko aasmaan me jo chamakte tare dikhte hain, unme se kuch actually planets hain — humare apne padosi!",
    concept:
      "Solar system ek family hai jisme centre me Sun (ek star) hai aur uske around gravity ki wajah se 8 planets, unke moons, asteroids aur comets ghoomte hain. Order yaad rakhne ka trick: My Very Educated Mother Just Served Us Noodles — Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Inner 4 (Mercury–Mars) rocky hain, outer 4 (Jupiter–Neptune) gas giants hain.",
    whyItMatters:
      "Solar system samajhne se hum earth ki position, seasons, day-night aur space missions (Chandrayaan, Mangalyaan) ko samajh paate hain.",
    keyPoints: [
      "Sun ek medium-size star hai jo solar system ka 99.8% mass rakhta hai.",
      "Mercury sabse paas aur sabse chhota planet hai — koi atmosphere nahi.",
      "Venus sabse garam planet hai due to thick CO₂ atmosphere (greenhouse effect).",
      "Earth ekmaatra planet hai jis par liquid water aur life confirmed hai.",
      "Jupiter sabse bada planet hai — uske 90+ moons hain.",
      "Saturn apne beautiful rings ke liye famous hai (ice + rock particles).",
    ],
    subtopics: [
      { title: "Inner planets", detail: "Mercury, Venus, Earth, Mars — small aur rocky." },
      { title: "Outer planets", detail: "Jupiter, Saturn, Uranus, Neptune — bade gas/ice giants." },
      { title: "Asteroid belt", detail: "Mars aur Jupiter ke beech rocky tukdo ki belt." },
      { title: "Dwarf planets", detail: "Pluto, Ceres, Eris — chhote planets jo official planet nahi mane jaate." },
    ],
    examples: [
      "Subah surya namaskar karte time — sun energy hi water cycle aur life chalata hai.",
      "Mangalyaan mission 2014 me India ne pehli koshish me Mars orbit pakda.",
      "Chandrayaan-3 ne 2023 me moon ke south pole par landing ki.",
      "ISS (Space Station) Earth ke orbit me ghoomta hai — har 90 minute me ek chakkar.",
    ],
    mistakes: [
      "Pluto ko planet samajhna — 2006 se yeh dwarf planet hai.",
      "Sun ko planet samajhna — Sun ek star hai.",
      "Moon ko planet samajhna — Moon Earth ka satellite hai.",
    ],
    classroomQuestion: "Agar Earth Sun ke aur paas hoti, to humari life kaise badal jaati?",
    activity:
      "Class me 9 students ko Sun + 8 planets ke labels do. Playground me Sun ke around relative distance pe khade ho kar slow speed me ghoomo — orbits ka concept clear hoga.",
    summary: "Sun ke around 8 planets gravity ki wajah se ghoomte hain — yahi humara solar system hai, aur Earth iska sabse special member.",
    teacherScript:
      "Bachcho, raat ko aasmaan dekha hai kabhi?\nWoh chamakte points sirf tare nahi, kuchh humare padosi planets bhi hain!\nAaj hum apne solar family se milenge.\nBoard par likho: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.\nEk trick: 'My Very Educated Mother Just Served Us Noodles'.",
    studentQuestions: [
      "Sir, Pluto planet kyun nahi hai?",
      "Sun me aag kahan se aati hai?",
      "Kya kisi aur planet par life ho sakti hai?",
    ],
    expectedAnswers: [
      "Pluto chhota hai aur apne orbit ko clear nahi kar paaya, isliye dwarf planet hai.",
      "Sun me nuclear fusion hota hai — hydrogen helium banta hai aur huge energy nikalti hai.",
      "Mars aur Europa (Jupiter ka moon) par scientists possibility dhoondh rahe hain.",
    ],
  },
  quiz: [
    { question: "Solar system ke centre me kya hai?", options: ["Earth", "Moon", "Sun", "Mars"], correctAnswer: "Sun", explanation: "Sun ek star hai." },
    { question: "Kitne planets hain solar system me?", options: ["6", "7", "8", "9"], correctAnswer: "8", explanation: "Mercury se Neptune tak." },
    { question: "Sun ke sabse paas wala planet?", options: ["Venus", "Mercury", "Earth", "Mars"], correctAnswer: "Mercury", explanation: "Mercury sabse pehla planet hai." },
    { question: "Sabse bada planet kaunsa hai?", options: ["Earth", "Saturn", "Jupiter", "Neptune"], correctAnswer: "Jupiter", explanation: "Jupiter gas giant hai." },
    { question: "Red planet kaunsa hai?", options: ["Mars", "Jupiter", "Saturn", "Venus"], correctAnswer: "Mars", explanation: "Iron oxide se red dikhta hai." },
  ],
};

const NUMBER_SYSTEM: Template = {
  match: /number\s*system|natural|whole|integer|rational|irrational/i,
  subject: "Mathematics",
  theme: "math",
  visualTitle: "Number System Hierarchy",
  steps: [
    { icon: "1️⃣", label: "Natural (1,2,3…)" },
    { icon: "0️⃣", label: "Whole (0,1,2…)" },
    { icon: "➖", label: "Integers (…-2,-1,0,1,2…)" },
    { icon: "½", label: "Rational (p/q)" },
    { icon: "π", label: "Irrational (√2, π)" },
    { icon: "ℝ", label: "Real numbers" },
  ],
  lesson: {
    hook: "Kya √2 ko exact decimal me likh sakte ho? Try karo… nahi likh paaoge! Aise hi mysterious numbers ki duniya hai number system.",
    concept:
      "Number system mathematics ki foundation hai. Sabse pehle aate hain Natural numbers (1, 2, 3…) jinhe counting numbers bhi kehte hain. Inme 0 add karne par Whole numbers (0, 1, 2…) bante hain. Negative numbers include karne par Integers (…-2, -1, 0, 1, 2…) milte hain. Jo numbers p/q form me likhe ja sakte hain (q ≠ 0) woh Rational hain. Jo p/q me nahi likhe ja sakte (like √2, π) woh Irrational hain. Rational + Irrational = Real numbers.",
    whyItMatters:
      "Algebra, geometry, physics aur daily life ke calculations (money, distance, temperature) sab number system par based hain. Board exam me yeh chapter har year aata hai.",
    keyPoints: [
      "Natural numbers (N): 1, 2, 3, … (counting numbers, zero nahi).",
      "Whole numbers (W): 0, 1, 2, … (natural + zero).",
      "Integers (Z): …-3, -2, -1, 0, 1, 2, 3… (positive + zero + negative).",
      "Rational numbers (Q): p/q form jaha q ≠ 0, jaise 3/4, -2, 0.75.",
      "Irrational numbers: non-terminating non-repeating decimals jaise √2, √3, π.",
      "Real numbers (R) = Rational ∪ Irrational — number line ke saare points.",
    ],
    subtopics: [
      { title: "Natural numbers", detail: "Counting ke liye use hote hain. Smallest natural number = 1." },
      { title: "Whole numbers", detail: "Natural me 0 add karne se." },
      { title: "Integers", detail: "Whole + negative numbers. Temperature aur loss/profit me kaam aate hain." },
      { title: "Rational", detail: "Terminating ya repeating decimals. 1/3 = 0.333… repeating." },
      { title: "Irrational", detail: "Square root of non-perfect squares aur π, e jaise constants." },
    ],
    examples: [
      "Cricket me runs (5, 10, 100) — natural numbers.",
      "Bank balance ₹0 — whole number.",
      "Mumbai me temperature -2°C — integer.",
      "Pizza ka 3/8 slice — rational number.",
      "Circle ka circumference = πd — π irrational hai.",
    ],
    mistakes: [
      "Zero ko natural number samajhna — zero whole number hai, natural nahi.",
      "Sochna √4 irrational hai — actually √4 = 2 jo natural hai.",
      "Har decimal ko irrational samajhna — 0.5 ya 0.333… repeating hain to rational hain.",
    ],
    classroomQuestion: "Kya 22/7 aur π same hain? Agar nahi to kyun?",
    activity:
      "Class ko 5 groups me baato. Har group ko 10 numbers do (mix of fractions, decimals, square roots) aur board par 5 columns (N, W, Z, Q, Irrational) me classify karne ko bolo. Fastest correct group wins.",
    summary: "Natural ⊂ Whole ⊂ Integer ⊂ Rational, aur Rational + Irrational = Real — yahi hai number system ki family.",
    teacherScript:
      "Bachcho, count karo — 1, 2, 3…\nYeh natural numbers hain. Ab agar mere paas kuch nahi to mai kya likhun? Zero!\nZero add karne se whole numbers ban gaye.\nAb agar mai 5 rupay udhaar le lun, to mera balance kya hai? -5!\nYahin se integers shuru hote hain.\nAaiye board par ek number line banate hain.",
    studentQuestions: [
      "Sir, 0 positive hai ya negative?",
      "π ka exact value kya hai?",
      "Kya √2 ko fraction me likh sakte hain?",
    ],
    expectedAnswers: [
      "Zero neither positive nor negative — wo neutral hai.",
      "π ka koi exact decimal nahi hai; approx 3.14159… non-terminating non-repeating.",
      "Nahi, √2 irrational hai — kisi p/q form me exact nahi likha ja sakta.",
    ],
  },
  quiz: [
    { question: "Smallest natural number kya hai?", options: ["0", "1", "-1", "2"], correctAnswer: "1", explanation: "Natural numbers 1 se start hote hain." },
    { question: "Zero kis set me aata hai?", options: ["Natural", "Whole", "Sirf negative", "Irrational"], correctAnswer: "Whole", explanation: "0 whole numbers me hai, natural me nahi." },
    { question: "Kaunsa irrational hai?", options: ["1/2", "√4", "√2", "0.25"], correctAnswer: "√2", explanation: "√2 non-terminating non-repeating hai." },
    { question: "-7 kis set me aata hai?", options: ["Natural", "Whole", "Integer", "Irrational"], correctAnswer: "Integer", explanation: "Integers me negative numbers include hote hain." },
    { question: "Rational numbers ka general form?", options: ["p+q", "p/q (q≠0)", "p×q", "p−q"], correctAnswer: "p/q (q≠0)", explanation: "Definition by Q." },
  ],
};

const FRACTIONS: Template = {
  match: /fraction|bhinn/i,
  subject: "Mathematics",
  theme: "math",
  visualTitle: "Types of Fractions",
  steps: [
    { icon: "🍕", label: "Whole (1)" },
    { icon: "½", label: "Proper (a<b)" },
    { icon: "5⁄3", label: "Improper (a>b)" },
    { icon: "1½", label: "Mixed" },
    { icon: "🟰", label: "Equivalent (½ = 2⁄4)" },
  ],
  lesson: {
    hook: "Ek pizza ko 4 doston me baatna ho to har ek ko kitna milega? Yahin se shuru hoti hai fractions ki kahani.",
    concept:
      "Fraction ka matlab hai 'kisi cheez ka part'. Likha jaata hai p/q form me, jaha p = numerator (upar) aur q = denominator (neeche, ≠ 0). Numerator batata hai kitne parts liye, denominator batata hai total kitne equal parts hain. Jaise 3/4 matlab 4 equal parts me se 3 parts.",
    whyItMatters:
      "Cooking (1/2 cup atta), money (¼ rupay), time (1/2 hour), aur higher math (algebra, ratios) sab me fractions chahiye.",
    keyPoints: [
      "Proper fraction: numerator < denominator (jaise 3/5).",
      "Improper fraction: numerator ≥ denominator (jaise 7/4).",
      "Mixed fraction: whole number + proper fraction (jaise 1 ¾).",
      "Equivalent fractions: same value different form (1/2 = 2/4 = 4/8).",
      "Same denominator wale fractions ko directly add/subtract karte hain.",
    ],
    subtopics: [
      { title: "Like fractions", detail: "Same denominator wale (3/7, 5/7)." },
      { title: "Unlike fractions", detail: "Different denominator (1/2, 1/3) — LCM lena padta hai." },
      { title: "Simplification", detail: "Numerator aur denominator ka HCF se divide karke smallest form." },
    ],
    examples: [
      "Chocolate ke 8 pieces me se 3 khaaye → 3/8 khaaya.",
      "Ghadi me 15 minute = 15/60 = 1/4 hour.",
      "Cricket match me 50 overs me se 20 over baaki → 20/50 = 2/5.",
    ],
    mistakes: [
      "Numerator aur denominator alag-alag add karna (1/2 + 1/3 ≠ 2/5).",
      "Simplification bhool jaana (4/8 likhna instead of 1/2).",
      "Improper fraction ko galat samajhna — improper bhi valid hota hai.",
    ],
    classroomQuestion: "Kya 3/4 hamesha 4/5 se chhota hai? Kaise check karoge?",
    activity:
      "Kagaz ke ek square ko fold karke 1/2, 1/4, 1/8 banao. Phir colour karke equivalent fractions dikhao (1/2 = 2/4 = 4/8).",
    summary: "Fraction kisi whole ka part hai, p/q form me — proper, improper, mixed aur equivalent unke types hain.",
    teacherScript:
      "Bachcho, kal mai ek pizza laaya tha 4 logo ke liye.\nHar ek ko kitna mila? 1/4!\nYahi hota hai fraction.\nUpar wala number numerator, neeche wala denominator.\nBoard par 1/2 likho, ab 2/4 likho — kya ye same hain?",
    studentQuestions: [
      "Sir, 0/5 valid fraction hai kya?",
      "Denominator 0 kyun nahi ho sakta?",
      "Kya 5/5 ek fraction hai?",
    ],
    expectedAnswers: [
      "Haan, 0/5 = 0 — valid hai.",
      "Kisi cheez ko 0 parts me baatna possible nahi, isliye denominator 0 undefined hai.",
      "Haan, 5/5 improper fraction hai aur equal hai 1 ke.",
    ],
  },
  quiz: [
    { question: "3/5 kis type ka fraction hai?", options: ["Proper", "Improper", "Mixed", "Equivalent"], correctAnswer: "Proper", explanation: "Numerator < denominator." },
    { question: "1/2 ke equivalent kaunsa hai?", options: ["2/3", "2/4", "3/5", "4/9"], correctAnswer: "2/4", explanation: "Dono ki value 0.5 hai." },
    { question: "7/4 kis type ka fraction hai?", options: ["Proper", "Improper", "Equivalent", "Like"], correctAnswer: "Improper", explanation: "Numerator > denominator." },
    { question: "Denominator kabhi kya nahi ho sakta?", options: ["1", "0", "5", "100"], correctAnswer: "0", explanation: "Division by zero undefined hai." },
    { question: "1 ½ kis type ka fraction hai?", options: ["Proper", "Improper", "Mixed", "Like"], correctAnswer: "Mixed", explanation: "Whole + proper fraction." },
  ],
};

const DEMOCRACY: Template = {
  match: /democracy|loktantra|government/i,
  subject: "Civics",
  theme: "history",
  visualTitle: "How Democracy Works",
  steps: [
    { icon: "🗳️", label: "Citizens vote" },
    { icon: "🏛️", label: "Representatives chunte" },
    { icon: "📜", label: "Laws banti" },
    { icon: "⚖️", label: "Judiciary check" },
    { icon: "👥", label: "Citizens benefit" },
  ],
  lesson: {
    hook: "Aapke school me agar monitor aapke vote se chuna jaaye, to wo zyada accountable hoga ya teacher ke chosen monitor? Yahi sawaal democracy ka hai.",
    concept:
      "Democracy ek aisi government hai jisme power citizens ke paas hoti hai. Abraham Lincoln ki famous definition: 'Government of the people, by the people, for the people.' India world ki sabse badi democracy hai, jaha har 5 saal me elections hote hain aur 18+ age ke citizens vote karte hain.",
    whyItMatters:
      "Democracy se citizens ke rights protect hote hain, freedom of speech milti hai, aur leaders ko accountable rakha jaata hai. Without democracy = dictatorship.",
    keyPoints: [
      "Universal adult franchise: har citizen (18+) ko vote ka adhikaar.",
      "Free aur fair elections regular intervals par hote hain.",
      "Separation of powers: Legislature, Executive, Judiciary alag-alag.",
      "Rule of law: kanoon sab ke liye equal, PM se lekar common man tak.",
      "Fundamental rights citizens ko constitution se milte hain.",
    ],
    subtopics: [
      { title: "Direct democracy", detail: "Citizens khud laws par vote karte hain (Switzerland)." },
      { title: "Representative democracy", detail: "Citizens representatives chunte hain (India, USA)." },
      { title: "Parliamentary system", detail: "PM legislature ko answerable (India, UK)." },
      { title: "Presidential system", detail: "President directly elected (USA)." },
    ],
    examples: [
      "2024 Lok Sabha elections me 64 crore se zyada Indians ne vote diya.",
      "School me class monitor election — chhoti scale ki democracy.",
      "RTI (Right to Information) Act 2005 — citizens government se sawaal pooch sakte hain.",
      "Panchayati Raj: village level par bhi democracy.",
    ],
    mistakes: [
      "Democracy ko sirf 'elections' samajhna — judiciary aur rights bhi essential hain.",
      "Sochna ki majority hamesha sahi hoti hai — minority rights bhi protected hain.",
      "Republic aur Democracy ko same samajhna — Republic me head of state elected hota hai.",
    ],
    classroomQuestion: "Kya 18 saal voting ke liye sahi age hai? Apni opinion explain karo.",
    activity:
      "Class me mock election karo — 2-3 candidates apne 1-minute manifesto bolein, phir secret ballot se monitor chuno. Counting class ke saamne karo.",
    summary: "Democracy people-powered government hai — voting, rights, aur accountability iske teen pillars.",
    teacherScript:
      "Bachcho, agar aapke ghar me sab faisle sirf ek banda kare to acha lagega?\nNahi na! Sab milkar discuss karte ho — yahi democracy ki spirit hai.\nIndia ki Constitution 26 January 1950 ko lagu hui.\nBoard par likho: 'Government of the people, by the people, for the people'.\nAaj samjhenge yeh actually kaise kaam karta hai.",
    studentQuestions: [
      "Sir, agar mujhe koi candidate pasand na ho to?",
      "Election me kya cheating ho sakti hai?",
      "Kya democracy hi best system hai?",
    ],
    expectedAnswers: [
      "NOTA (None Of The Above) option hota hai — koi bhi pasand nahi to NOTA dabao.",
      "Election Commission monitor karta hai, EVM tamper-proof hain, aur observers hote hain.",
      "Sabhi systems me kuch limitations hain, lekin democracy citizens ko sabse zyada freedom deti hai.",
    ],
  },
  quiz: [
    { question: "Democracy me ultimate power kiske paas hoti hai?", options: ["President", "Citizens", "Army", "Judges"], correctAnswer: "Citizens", explanation: "By definition, power people ke paas hoti hai." },
    { question: "India me voting age kya hai?", options: ["16", "18", "21", "25"], correctAnswer: "18", explanation: "61st Amendment 1989 me 21 se 18 ki gayi." },
    { question: "Lok Sabha elections kitne saal me hote hain?", options: ["3", "4", "5", "6"], correctAnswer: "5", explanation: "5-year term." },
    { question: "Constitution kab lagu hua?", options: ["15 Aug 1947", "26 Jan 1950", "2 Oct 1947", "26 Nov 1949"], correctAnswer: "26 Jan 1950", explanation: "Republic Day." },
    { question: "NOTA ka matlab?", options: ["New Option", "None Of The Above", "Not Open To All", "Network Of Tax"], correctAnswer: "None Of The Above", explanation: "Voter koi candidate pasand na ho to use kar sakta hai." },
  ],
};

const FOOD_CHAIN: Template = {
  match: /food\s*chain|food\s*web|ecosystem/i,
  subject: "Science",
  theme: "nature",
  visualTitle: "Food Chain (Producer → Top Predator)",
  steps: [
    { icon: "🌿", label: "Producers (plants)" },
    { icon: "🐛", label: "Primary consumer" },
    { icon: "🐦", label: "Secondary consumer" },
    { icon: "🦅", label: "Tertiary consumer" },
    { icon: "🦠", label: "Decomposers" },
  ],
  lesson: {
    hook: "Sher khaata hai hiran ko, hiran khaata hai ghaas ko — par ghaas khaata kya hai? Aaiye dekhte hain nature ki dining chain.",
    concept:
      "Food chain ek linear sequence hai jisme energy ek organism se doosre tak transfer hoti hai khaane ke through. Sabse pehle producers (green plants) sun se energy lete hain via photosynthesis. Phir herbivores (primary consumers) plants khaate hain, carnivores (secondary/tertiary) inhe khaate hain, aur decomposers (bacteria, fungi) dead bodies ko todh kar nutrients wapas soil me bhejte hain.",
    whyItMatters:
      "Food chain samajhne se hum ecosystem balance, pollution effects (jaise pesticide top predators tak pahunchna), aur conservation ki importance samajhte hain.",
    keyPoints: [
      "Producers: green plants jo apna food khud banate hain.",
      "Primary consumers: herbivores jaise cow, deer, grasshopper.",
      "Secondary consumers: carnivores jo herbivores khaate hain (frog, snake).",
      "Tertiary consumers: top predators jaise tiger, eagle.",
      "Decomposers: bacteria aur fungi jo dead matter recycle karte hain.",
      "Har step me sirf 10% energy transfer hoti hai (10% law).",
    ],
    subtopics: [
      { title: "Trophic levels", detail: "Food chain ke alag-alag steps ko trophic levels kehte hain." },
      { title: "Food web", detail: "Multiple interconnected food chains ka network." },
      { title: "Energy pyramid", detail: "Hamesha upright — base par sabse zyada energy producers ke paas." },
    ],
    examples: [
      "Grass → Grasshopper → Frog → Snake → Eagle.",
      "Phytoplankton → Small fish → Big fish → Shark (ocean chain).",
      "Wheat → Cow → Human (humara apna chain).",
    ],
    mistakes: [
      "Food chain ko hamesha straight line samajhna — actually food web hota hai.",
      "Decomposers ko bhool jaana — yeh nutrients recycle karne ke liye essential hain.",
      "Sun ko ignore karna — Sun food chain ka ultimate energy source hai.",
    ],
    classroomQuestion: "Agar saare frogs khatam ho jaayein to is chain par kya effect padega?",
    activity:
      "Class ko 5 groups me baato. Har group ek food chain card banaaye apne local ecosystem (jaise garden, pond, forest). Phir board par sab chains ko jodke ek food web banao.",
    summary: "Sun → producers → consumers → decomposers — yahi nature ka energy transfer cycle hai, jise hum food chain kehte hain.",
    teacherScript:
      "Bachcho, sher kya khaata hai? Hiran.\nHiran kya khaata hai? Ghaas.\nGhaas ko energy kahan se milti hai? Sun!\nYeh chain hai energy flow ki — har link important hai.\nBoard par draw karo: Sun → Grass → Deer → Tiger.",
    studentQuestions: [
      "Sir, humans kis level pe aate hain?",
      "Agar producers khatam ho jaayein to?",
      "Decomposers kya khaate hain?",
    ],
    expectedAnswers: [
      "Humans omnivores hain — primary aur secondary consumer dono level pe.",
      "Saari food chain collapse ho jaayegi, life possible nahi.",
      "Decomposers dead plants aur animals ko break down karke nutrients lete hain.",
    ],
  },
  quiz: [
    { question: "Food chain ka pehla link kaun hota hai?", options: ["Producer", "Consumer", "Decomposer", "Predator"], correctAnswer: "Producer", explanation: "Plants jo photosynthesis karte hain." },
    { question: "Herbivore kis level pe hota hai?", options: ["Producer", "Primary consumer", "Tertiary consumer", "Decomposer"], correctAnswer: "Primary consumer", explanation: "Plants khaane wale primary consumers hain." },
    { question: "Decomposers kaun hote hain?", options: ["Plants", "Tigers", "Bacteria & fungi", "Birds"], correctAnswer: "Bacteria & fungi", explanation: "Dead matter ko todhte hain." },
    { question: "Food chain ka ultimate energy source?", options: ["Soil", "Sun", "Water", "Wind"], correctAnswer: "Sun", explanation: "Producers Sun ki energy use karte hain." },
    { question: "10% law kis cheez se related hai?", options: ["Population", "Energy transfer", "Water cycle", "Photosynthesis"], correctAnswer: "Energy transfer", explanation: "Har trophic level par 10% energy hi aage jaati hai." },
  ],
};

const STATES_OF_MATTER: Template = {
  match: /states?\s*of\s*matter|solid|liquid|gas|plasma/i,
  subject: "Science",
  theme: "science",
  visualTitle: "States of Matter & Changes",
  steps: [
    { icon: "🧊", label: "Solid (fixed)" },
    { icon: "💧", label: "Liquid (flows)" },
    { icon: "💨", label: "Gas (spread out)" },
    { icon: "⚡", label: "Plasma (ionized)" },
    { icon: "🔁", label: "Changes via heat" },
  ],
  lesson: {
    hook: "Paani, baraf aur bhaap — teeno same cheez hain, bas roop alag. Kaise? Aaj raaz kholenge!",
    concept:
      "Matter har woh cheez hai jiska mass ho aur jagah ghere. Matter mainly 3 states me milti hai: Solid (definite shape & volume), Liquid (definite volume but takes shape of container), Gas (na shape na volume, fills entire container). Chautha state hai Plasma (extremely hot ionized gas, jaise sun). States change hote hain heat add/remove karne se.",
    whyItMatters:
      "Cooking, weather, manufacturing, aur sab natural processes states of matter par based hain. Yeh basic foundation hai chemistry aur physics ki.",
    keyPoints: [
      "Solid me particles tightly packed hote hain, sirf vibrate karte hain.",
      "Liquid me particles thoda loose, slide kar sakte hain.",
      "Gas me particles bahut door aur fast move karte hain.",
      "Plasma me particles itne energetic ki electrons free ho jaate hain.",
      "Melting: solid → liquid, Boiling: liquid → gas, Condensation: gas → liquid.",
      "Sublimation: solid directly gas (jaise camphor, dry ice).",
    ],
    subtopics: [
      { title: "Solid", detail: "Strong intermolecular forces, definite shape." },
      { title: "Liquid", detail: "Medium forces, takes container ka shape." },
      { title: "Gas", detail: "Weak forces, compressible, fills container." },
      { title: "Plasma", detail: "Ionized gas, found in stars aur neon lights." },
    ],
    examples: [
      "Ice cube (solid) → glass me melt hokar water (liquid) → kettle me boil hokar steam (gas).",
      "Camphor (kapoor) jala do — direct gas ban jaata hai (sublimation).",
      "LPG cylinder me liquid form me gas store hoti hai.",
      "Sun ek giant ball of plasma hai.",
    ],
    mistakes: [
      "Sochna gas dikhti nahi to wahan kuchh nahi — gas bhi mass rakhti hai.",
      "Evaporation aur boiling ko same samajhna — evaporation any temperature par hota hai.",
      "Plasma ko bhool jaana — yeh 4th state hai.",
    ],
    classroomQuestion: "Agar Earth par koi liquid water nahi hota to humara life kaisa hota?",
    activity:
      "Ek ice cube le kar plate me rakho. Time note karo melting ka, phir us water ko stove par boil karke time note karo. Observe karo particles ka behavior change.",
    summary: "Solid, Liquid, Gas aur Plasma — matter ke 4 states heat ke add/remove se ek-doosre me badalte hain.",
    teacherScript:
      "Bachcho, mere haath me kya hai? Ice cube — yeh solid hai.\nAb mai ise hatheli pe rakhta hun — yeh paani ban gaya. Liquid!\nAur agar mai ise garam karun? Bhaap! Gas!\nSame H₂O, teen alag states.\nBoard par triangle banao — Solid, Liquid, Gas with arrows.",
    studentQuestions: [
      "Sir, plasma ghar me kahin milta hai?",
      "Steel ko liquid kaise karte hain?",
      "Bhaap aur dhuan same hai?",
    ],
    expectedAnswers: [
      "Haan, neon signs aur tubelights me plasma hota hai.",
      "Steel ko 1500°C+ tak heat karne par melt karke liquid banti hai.",
      "Nahi — bhaap pure water vapor hai, dhuan me solid particles bhi hote hain.",
    ],
  },
  quiz: [
    { question: "Solid ke particles kya karte hain?", options: ["Free move", "Sirf vibrate", "Spread out", "Disappear"], correctAnswer: "Sirf vibrate", explanation: "Tightly packed isliye." },
    { question: "Liquid ka shape kaisa hota hai?", options: ["Fixed", "Container ke according", "Always round", "Always cube"], correctAnswer: "Container ke according", explanation: "Liquid container ka shape leta hai." },
    { question: "Solid direct gas banne ka process?", options: ["Melting", "Boiling", "Sublimation", "Condensation"], correctAnswer: "Sublimation", explanation: "Jaise camphor." },
    { question: "Plasma kahan paaya jaata hai?", options: ["Fridge", "Sun", "Pond", "Ice"], correctAnswer: "Sun", explanation: "Sun giant plasma ball hai." },
    { question: "Gas → liquid ka process?", options: ["Evaporation", "Melting", "Condensation", "Sublimation"], correctAnswer: "Condensation", explanation: "Vapor thanda hokar liquid." },
  ],
};

const TEMPLATES: Template[] = [
  PHOTOSYNTHESIS,
  WATER_CYCLE,
  SOLAR_SYSTEM,
  NUMBER_SYSTEM,
  FRACTIONS,
  DEMOCRACY,
  FOOD_CHAIN,
  STATES_OF_MATTER,
];

function genericTemplate(topic: string, grade: string): Template {
  const cap = topic.charAt(0).toUpperCase() + topic.slice(1);
  return {
    match: /.*/,
    subject: "General",
    theme: "default",
    visualTitle: `${cap} — Structure`,
    steps: [
      { icon: "🎯", label: `${cap} kya hai` },
      { icon: "🧩", label: "Main parts" },
      { icon: "⚙️", label: "Process / steps" },
      { icon: "🌟", label: "Real-life use" },
    ],
    lesson: {
      hook: `Kya aapne kabhi soocha hai ${topic} actually kaam kaise karta hai? Aaj saaf-saaf samjhenge.`,
      concept: `${cap} ek aisa topic hai jise Class ${grade} me detail me padha jaata hai. Iske main parts, structure aur usage classroom me roz dikhte hain.`,
      whyItMatters: `${cap} samajhna aapke board exam aur daily life dono ke liye useful hai.`,
      keyPoints: [
        `${cap} ke definition aur main components.`,
        `${cap} ka structure aur classification.`,
        `${cap} ke real-life applications jo aap roz dekhte ho.`,
        `${cap} ke common formulas / rules.`,
      ],
      subtopics: [
        { title: `${cap} ka introduction`, detail: "Definition aur scope." },
        { title: "Main parts", detail: "Important sub-areas jo detail me padhne hain." },
        { title: "Applications", detail: "Real world me kaise use hota hai." },
      ],
      examples: [
        `${cap} ka ek example aapke ghar me — kitchen, school ya playground me.`,
        `${cap} ka ek example exam questions me jo aksar puchha jaata hai.`,
        `${cap} ka ek example Indian context me.`,
      ],
      mistakes: [
        `${cap} ki definition ratna without samjhe.`,
        `${cap} aur similar topic me confusion.`,
        "Formula yaad rakhna without understanding derivation.",
      ],
      classroomQuestion: `${cap} ke baare me ek question jo aapko sabse interesting laga, woh share karo.`,
      activity: `Class ko 4 groups me baato. Har group ${cap} ka ek aspect 2 min me present kare — examples, definition, parts, use.`,
      summary: `${cap} ko step-by-step samjhne se yeh topic asaan ho jaata hai.`,
      teacherScript: `Bachcho, aaj hum ${cap} padhenge.\nPehle definition, phir parts, phir examples.\nBoard par notes lete jao.\nSawaal beech me bhi pooch sakte ho.`,
      studentQuestions: [
        `Sir, ${cap} exam me kitne marks ka aata hai?`,
        `Kya ${cap} ke notes ready hain?`,
        `${cap} ki best example aapki nazar me kya hai?`,
      ],
      expectedAnswers: [
        "Generally 5-10 marks ka section hota hai.",
        "Haan, class notes upload kar diye jaayenge.",
        "Real-life se related example sabse strong hota hai.",
      ],
    },
    quiz: [
      { question: `${cap} ke baare me kya sahi hai?`, options: [`${cap} ek defined concept hai`, `${cap} kuch nahi hai`, `${cap} sirf kahaani hai`, `${cap} useless hai`], correctAnswer: `${cap} ek defined concept hai`, explanation: `${cap} ek proper academic topic hai.` },
      { question: `${cap} sikhne ka pehla step?`, options: ["Definition samajhna", "Sona", "Bhool jaana", "Skip karna"], correctAnswer: "Definition samajhna", explanation: "Basics se shuru karte hain." },
      { question: `${cap} me practice kyun zaroori hai?`, options: ["Concept clear ho", "Time pass", "Marks na aaye", "Teacher khush ho"], correctAnswer: "Concept clear ho", explanation: "Practice se hi clarity aati hai." },
      { question: `${cap} real life me kahan dikhta hai?`, options: ["Examples me", "Sirf books me", "Kahin nahi", "Movies me"], correctAnswer: "Examples me", explanation: "Examples se concept solidify hota hai." },
      { question: `${cap} sikhne ka best tarika?`, options: ["Step by step", "Skip karke", "Sirf ratna", "Without notes"], correctAnswer: "Step by step", explanation: "Structured learning best hota hai." },
    ],
  };
}

function pick(topic: string, grade: string): Template {
  return TEMPLATES.find((t) => t.match.test(topic)) ?? genericTemplate(topic, grade);
}

export function synthTeaching(topic: string, grade = "6"): TeachingResponse {
  const t = pick(topic, grade);
  return {
    intent: "teaching",
    topic,
    subject: t.subject,
    grade,
    language: "Hinglish",
    theme: t.theme,
    visualType: "flowchart",
    lesson: t.lesson,
    visual: { title: t.visualTitle, steps: t.steps },
    quiz: null,
  };
}

export function synthQuiz(topic: string, grade = "6"): TeachingResponse {
  const t = pick(topic, grade);
  return {
    intent: "quiz",
    topic,
    subject: t.subject,
    grade,
    language: "Hinglish",
    theme: t.theme,
    visualType: "flowchart",
    lesson: null,
    visual: null,
    quiz: {
      title: `${topic} — Quiz`,
      topic,
      klass: grade,
      language: "Hinglish",
      questions: t.quiz.map((q) => ({
        question: q.question,
        options: q.options as unknown as string[],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        type: "mcq",
        difficulty: "easy",
      })),
    },
  };
}

export function synthFallback(topic: string, intent: "teaching" | "quiz", grade = "6"): TeachingResponse {
  return intent === "quiz" ? synthQuiz(topic, grade) : synthTeaching(topic, grade);
}
