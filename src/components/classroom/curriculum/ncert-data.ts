export interface NCERTChapter {
  id: string;
  chapterNumber: number;
  title: string;
  hindiTitle?: string;
  prompt: string;
  keyConcepts: string[];
}

export interface NCERTSubject {
  name: string;
  icon: string;
  chapters: NCERTChapter[];
}

export interface NCERTClassCurriculum {
  grade: string;
  subjects: NCERTSubject[];
}

export const NCERT_CURRICULUM: NCERTClassCurriculum[] = [
  {
    grade: "6",
    subjects: [
      {
        name: "Science",
        icon: "🔬",
        chapters: [
          {
            id: "c6-sci-1",
            chapterNumber: 1,
            title: "Components of Food",
            hindiTitle: "भोजन के घटक",
            prompt: "Explain Components of Food (Carbohydrates, Proteins, Fats, Vitamins and Minerals) for Class 6 NCERT Science.",
            keyConcepts: ["Nutrients", "Balanced Diet", "Deficiency Diseases", "Iodine Test"],
          },
          {
            id: "c6-sci-2",
            chapterNumber: 2,
            title: "Sorting Materials into Groups",
            hindiTitle: "वस्तुओं के समूह बनाना",
            prompt: "Teach Sorting Materials into Groups (Hardness, Solubility, Transparency) for Class 6 NCERT Science.",
            keyConcepts: ["Properties of Materials", "Soluble vs Insoluble", "Transparency"],
          },
          {
            id: "c6-sci-3",
            chapterNumber: 3,
            title: "Separation of Substances",
            hindiTitle: "पदार्थों का पृथक्करण",
            prompt: "Explain Separation of Substances (Threshing, Winnowing, Filtration, Evaporation) for Class 6 NCERT Science.",
            keyConcepts: ["Winnowing", "Decantation", "Filtration", "Evaporation"],
          },
          {
            id: "c6-sci-4",
            chapterNumber: 4,
            title: "Getting to Know Plants",
            hindiTitle: "पौधों को जानिए",
            prompt: "Teach Getting to Know Plants (Herbs, Shrubs, Trees, Leaf Venation, Photosynthesis, Flower Parts) for Class 6 NCERT Science.",
            keyConcepts: ["Herbs & Shrubs", "Leaf Venation", "Roots: Tap vs Fibrous", "Flower Anatomy"],
          },
          {
            id: "c6-sci-5",
            chapterNumber: 5,
            title: "Body Movements",
            hindiTitle: "शरीर में गति",
            prompt: "Explain Body Movements (Ball and Socket Joint, Hinge Joint, Skeleton system) for Class 6 NCERT Science.",
            keyConcepts: ["Joints", "Ball & Socket", "Cartilage", "Movement in Earthworm & Fish"],
          },
          {
            id: "c6-sci-6",
            chapterNumber: 6,
            title: "Light, Shadows and Reflections",
            hindiTitle: "प्रकाश, छायाएं एवं परावर्तन",
            prompt: "Teach Light, Shadows and Reflections (Opaque, Transparent, Translucent, Pinhole Camera) for Class 6 NCERT Science.",
            keyConcepts: ["Luminous Objects", "Shadow Formation", "Pinhole Camera", "Mirrors"],
          },
        ],
      },
      {
        name: "Mathematics",
        icon: "🧮",
        chapters: [
          {
            id: "c6-math-1",
            chapterNumber: 1,
            title: "Knowing Our Numbers",
            hindiTitle: "अपनी संख्याओं की जानकारी",
            prompt: "Teach Knowing Our Numbers (Indian & International Place Value System, Roman Numerals) for Class 6 NCERT Math.",
            keyConcepts: ["Place Value", "Estimation", "Large Numbers", "Roman Numerals"],
          },
          {
            id: "c6-math-2",
            chapterNumber: 2,
            title: "Whole Numbers",
            hindiTitle: "पूर्ण संख्याएँ",
            prompt: "Explain Whole Numbers (Predecessor, Successor, Number Line, Properties of Addition & Multiplication) for Class 6 NCERT Math.",
            keyConcepts: ["Number Line", "Closure Property", "Commutative Property", "Patterns"],
          },
          {
            id: "c6-math-3",
            chapterNumber: 3,
            title: "Playing with Numbers",
            hindiTitle: "संख्याओं के साथ खेलना",
            prompt: "Teach Playing with Numbers (Factors, Multiples, Prime & Composite, Divisibility Rules, HCF, LCM) for Class 6 NCERT Math.",
            keyConcepts: ["Prime Numbers", "Divisibility Tests", "HCF", "LCM"],
          },
          {
            id: "c6-math-4",
            chapterNumber: 4,
            title: "Integers",
            hindiTitle: "पूर्णांक",
            prompt: "Explain Integers (Negative Numbers, Number Line, Addition and Subtraction of Integers) for Class 6 NCERT Math.",
            keyConcepts: ["Negative Numbers", "Number Line Movement", "Rules of Signs"],
          },
          {
            id: "c6-math-5",
            chapterNumber: 5,
            title: "Fractions",
            hindiTitle: "भिन्न",
            prompt: "Teach Fractions (Proper, Improper, Mixed Fractions, Equivalent Fractions, Addition) for Class 6 NCERT Math.",
            keyConcepts: ["Fraction on Number Line", "Equivalent Fractions", "Simplest Form"],
          },
        ],
      },
    ],
  },
  {
    grade: "7",
    subjects: [
      {
        name: "Science",
        icon: "🔬",
        chapters: [
          {
            id: "c7-sci-1",
            chapterNumber: 1,
            title: "Nutrition in Plants",
            hindiTitle: "पादपों में पोषण",
            prompt: "Explain Nutrition in Plants (Autotrophic, Chlorophyll, Photosynthesis Equation, Stomata, Insectivorous plants) for Class 7 NCERT Science.",
            keyConcepts: ["Autotrophs vs Heterotrophs", "Photosynthesis Formula", "Stomata & Guard Cells", "Pitcher Plant"],
          },
          {
            id: "c7-sci-2",
            chapterNumber: 2,
            title: "Nutrition in Animals",
            hindiTitle: "प्राणियों में पोषण",
            prompt: "Teach Nutrition in Animals (Human Digestive System, Teeth types, Rumination in Cows) for Class 7 NCERT Science.",
            keyConcepts: ["Digestion Stages", "Alimentary Canal", "Villi in Small Intestine", "Ruminants"],
          },
          {
            id: "c7-sci-3",
            chapterNumber: 3,
            title: "Heat",
            hindiTitle: "ऊष्मा",
            prompt: "Explain Heat (Clinical vs Laboratory Thermometer, Conduction, Convection, Radiation) for Class 7 NCERT Science.",
            keyConcepts: ["Temperature", "Conduction in Solids", "Convection in Fluids", "Sea Breeze & Land Breeze"],
          },
          {
            id: "c7-sci-4",
            chapterNumber: 4,
            title: "Acids, Bases and Salts",
            hindiTitle: "अम्ल, क्षारक और लवण",
            prompt: "Teach Acids, Bases and Salts (Litmus Paper, Turmeric Indicator, Neutralisation Reaction) for Class 7 NCERT Science.",
            keyConcepts: ["Natural Indicators", "Acidic vs Basic", "Neutralisation", "Everyday Applications"],
          },
          {
            id: "c7-sci-5",
            chapterNumber: 5,
            title: "Respiration in Organisms",
            hindiTitle: "जीवों में श्वसन",
            prompt: "Explain Respiration in Organisms (Aerobic vs Anaerobic, Breathing Mechanism, Diaphragm, Cellular Respiration) for Class 7 NCERT Science.",
            keyConcepts: ["Inhalation vs Exhalation", "Diaphragm Movement", "Lactic Acid in Muscles", "Gills in Fish"],
          },
          {
            id: "c7-sci-6",
            chapterNumber: 6,
            title: "Electric Current and its Effects",
            hindiTitle: "विद्युत धारा और इसके प्रभाव",
            prompt: "Teach Electric Current and its Effects (Heating Effect, Electric Fuse, Electromagnet) for Class 7 NCERT Science.",
            keyConcepts: ["Circuit Symbols", "Heating Effect (Nichrome wire)", "Electric Fuse", "Electromagnet in Electric Bell"],
          },
        ],
      },
      {
        name: "Mathematics",
        icon: "🧮",
        chapters: [
          {
            id: "c7-math-1",
            chapterNumber: 1,
            title: "Integers",
            hindiTitle: "पूर्णांक",
            prompt: "Teach Integers (Multiplication and Division of Integers, Distributive Property) for Class 7 NCERT Math.",
            keyConcepts: ["Sign Multiplication Rules", "BODMAS with Integers", "Distributive Property"],
          },
          {
            id: "c7-math-2",
            chapterNumber: 2,
            title: "Fractions and Decimals",
            hindiTitle: "भिन्न एवं दशमलव",
            prompt: "Explain Fractions and Decimals (Multiplication & Division of Fractions, Decimal Multiplications) for Class 7 NCERT Math.",
            keyConcepts: ["Reciprocal of Fractions", "Decimal Multiplication", "Division by 10/100/1000"],
          },
          {
            id: "c7-math-3",
            chapterNumber: 3,
            title: "Simple Equations",
            hindiTitle: "सरल समीकरण",
            prompt: "Teach Simple Equations (Setting up Equations, Transposition Method) for Class 7 NCERT Math.",
            keyConcepts: ["Variable & Constant", "LHS = RHS", "Solving by Transposition"],
          },
        ],
      },
    ],
  },
  {
    grade: "8",
    subjects: [
      {
        name: "Science",
        icon: "🔬",
        chapters: [
          {
            id: "c8-sci-1",
            chapterNumber: 1,
            title: "Crop Production & Management",
            hindiTitle: "फसल उत्पादन एवं प्रबंध",
            prompt: "Explain Crop Production and Management (Kharif vs Rabi, Sowing, Manure vs Fertiliser, Drip Irrigation) for Class 8 NCERT Science.",
            keyConcepts: ["Kharif & Rabi Crops", "Soil Preparation", "Drip & Sprinkler Irrigation", "Harvesting"],
          },
          {
            id: "c8-sci-2",
            chapterNumber: 2,
            title: "Microorganisms: Friend and Foe",
            hindiTitle: "सूक्ष्मजीव: मित्र एवं शत्रु",
            prompt: "Teach Microorganisms: Friend and Foe (Bacteria, Fungi, Protozoa, Algae, Vaccines, Food Preservation) for Class 8 NCERT Science.",
            keyConcepts: ["Antibiotics & Vaccines", "Pasteurisation", "Nitrogen Cycle", "Communicable Diseases"],
          },
          {
            id: "c8-sci-3",
            chapterNumber: 3,
            title: "Force and Pressure",
            hindiTitle: "बल तथा दाब",
            prompt: "Explain Force and Pressure (Contact vs Non-Contact Forces, Pressure Formula P=F/A, Atmospheric Pressure) for Class 8 NCERT Science.",
            keyConcepts: ["Gravitational & Magnetic Force", "Friction", "Pressure = Force / Area", "Atmospheric Pressure"],
          },
          {
            id: "c8-sci-4",
            chapterNumber: 4,
            title: "Sound",
            hindiTitle: "ध्वनि",
            prompt: "Teach Sound (Vibrations, Human Voice Box / Larynx, Amplitude, Frequency, Pitch, Audible Range 20Hz-20kHz) for Class 8 NCERT Science.",
            keyConcepts: ["Vibrating Body", "Medium Required for Sound", "Pitch vs Loudness", "Audible Range"],
          },
          {
            id: "c8-sci-5",
            chapterNumber: 5,
            title: "Light",
            hindiTitle: "प्रकाश",
            prompt: "Explain Light (Laws of Reflection, Regular vs Diffused Reflection, Human Eye Anatomy, Braille System) for Class 8 NCERT Science.",
            keyConcepts: ["Angle i = Angle r", "Multiple Reflection (Kaleidoscope)", "Cornea, Iris & Retina", "Eye Care"],
          },
        ],
      },
      {
        name: "Mathematics",
        icon: "🧮",
        chapters: [
          {
            id: "c8-math-1",
            chapterNumber: 1,
            title: "Linear Equations in One Variable",
            hindiTitle: "एक चर वाले रैखिक समीकरण",
            prompt: "Teach Linear Equations in One Variable (Solving Equations with Variables on Both Sides) for Class 8 NCERT Math.",
            keyConcepts: ["Linear Equations", "Balancing Equation", "Word Problem Translation"],
          },
          {
            id: "c8-math-2",
            chapterNumber: 2,
            title: "Squares and Square Roots",
            hindiTitle: "वर्ग और वर्गमूल",
            prompt: "Explain Squares and Square Roots (Prime Factorisation and Long Division Method) for Class 8 NCERT Math.",
            keyConcepts: ["Perfect Squares", "Pythagorean Triplets", "Division Method for Roots"],
          },
          {
            id: "c8-math-3",
            chapterNumber: 3,
            title: "Mensuration",
            hindiTitle: "क्षेत्रमिति",
            prompt: "Teach Mensuration (Area of Trapezium, Surface Area & Volume of Cuboid, Cube, Cylinder) for Class 8 NCERT Math.",
            keyConcepts: ["Trapezium Area", "Total Surface Area", "Volume Formulae"],
          },
        ],
      },
    ],
  },
  {
    grade: "9",
    subjects: [
      {
        name: "Science",
        icon: "🔬",
        chapters: [
          {
            id: "c9-sci-1",
            chapterNumber: 1,
            title: "Matter in Our Surroundings",
            hindiTitle: "हमारे आस-पास के पदार्थ",
            prompt: "Explain Matter in Our Surroundings (States of Matter, Latent Heat, Sublimation, Evaporation Cooling) for Class 9 NCERT Science.",
            keyConcepts: ["Kinetic Theory of Matter", "Latent Heat of Fusion/Vaporisation", "Sublimation", "Evaporation Factors"],
          },
          {
            id: "c9-sci-2",
            chapterNumber: 2,
            title: "Atoms and Molecules",
            hindiTitle: "परमाणु एवं अणु",
            prompt: "Teach Atoms and Molecules (Law of Chemical Combination, Dalton's Atomic Theory, Mole Concept, Valency) for Class 9 NCERT Science.",
            keyConcepts: ["Law of Conservation of Mass", "Atomic Mass Unit (amu)", "Writing Chemical Formulae", "Mole Concept"],
          },
          {
            id: "c9-sci-3",
            chapterNumber: 3,
            title: "The Fundamental Unit of Life",
            hindiTitle: "जीवन की मौलिक इकाई",
            prompt: "Explain The Fundamental Unit of Life (Plant vs Animal Cell, Cell Membrane, Nucleus, Mitochondria, Plastids) for Class 9 NCERT Science.",
            keyConcepts: ["Prokaryotic vs Eukaryotic", "Osmosis & Diffusion", "Powerhouse: Mitochondria", "Cell Wall"],
          },
          {
            id: "c9-sci-4",
            chapterNumber: 4,
            title: "Motion & Laws of Motion",
            hindiTitle: "गति एवं गति के नियम",
            prompt: "Teach Motion and Newton's Three Laws of Motion (Inertia, Momentum, F=ma, Action-Reaction) for Class 9 NCERT Science.",
            keyConcepts: ["Velocity & Acceleration", "Distance-Time Graphs", "Newton's 3 Laws", "Conservation of Momentum"],
          },
        ],
      },
    ],
  },
  {
    grade: "10",
    subjects: [
      {
        name: "Science",
        icon: "🔬",
        chapters: [
          {
            id: "c10-sci-1",
            chapterNumber: 1,
            title: "Chemical Reactions & Equations",
            hindiTitle: "रासायनिक अभिक्रियाएँ एवं समीकरण",
            prompt: "Explain Chemical Reactions and Equations (Balancing, Combination, Decomposition, Displacement, Redox) for Class 10 NCERT Science.",
            keyConcepts: ["Balancing Equations", "Types of Chemical Reactions", "Oxidation & Reduction", "Corrosion & Rancidity"],
          },
          {
            id: "c10-sci-2",
            chapterNumber: 2,
            title: "Life Processes",
            hindiTitle: "जैव प्रक्रम",
            prompt: "Teach Life Processes (Human Digestive, Respiratory, Circulatory, and Excretory Systems, Nephron structure) for Class 10 NCERT Science.",
            keyConcepts: ["Autotrophic Nutrition", "Double Circulation in Heart", "Alveoli Gas Exchange", "Nephron Filtration"],
          },
          {
            id: "c10-sci-3",
            chapterNumber: 3,
            title: "Light: Reflection & Refraction",
            hindiTitle: "प्रकाश: परावर्तन तथा अपवर्तन",
            prompt: "Explain Light: Reflection and Refraction (Concave/Convex Mirrors & Lenses, Ray Diagrams, Lens Formula, Power of Lens) for Class 10 NCERT Science.",
            keyConcepts: ["Mirror Formula & Magnification", "Snell's Law of Refraction", "Ray Diagrams", "Power P = 1/f"],
          },
          {
            id: "c10-sci-4",
            chapterNumber: 4,
            title: "Electricity",
            hindiTitle: "विद्युत",
            prompt: "Teach Electricity (Ohm's Law V=IR, Resistors in Series and Parallel, Joule's Law of Heating, Electric Power) for Class 10 NCERT Science.",
            keyConcepts: ["Ohm's Law", "Series vs Parallel Resistors", "Electric Power P=VI", "Heating Effect H=I²Rt"],
          },
        ],
      },
    ],
  },
];
