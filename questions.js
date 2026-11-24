/*
  QUESTION BANK
  -------------
  To add a question, copy one block inside a subject and edit it:
    q       -> the question text
    options -> exactly 4 options (shown as A, B, C, D)
    answer  -> position of the correct option: 0 = A, 1 = B, 2 = C, 3 = D
    explain -> a short explanation shown after answering

  To add a new subject, add a new key with an array of questions.
  These are original practice questions. Add more from your own
  past-question books to make the app as big as you like.
*/

const QUESTIONS = {

    "Mathematics": [
        {
            q: "Solve for x: 2x + 5 = 17",
            options: ["5", "6", "7", "8"],
            answer: 1,
            explain: "2x = 17 - 5 = 12, so x = 12 / 2 = 6."
        },
        {
            q: "Simplify 3/4 + 2/3",
            options: ["5/7", "17/12", "5/12", "6/7"],
            answer: 1,
            explain: "The common denominator is 12: 9/12 + 8/12 = 17/12."
        },
        {
            q: "What is 15% of 240?",
            options: ["24", "30", "36", "40"],
            answer: 2,
            explain: "15/100 x 240 = 36."
        },
        {
            q: "Find the area of a circle of radius 7 cm. (Take pi = 22/7)",
            options: ["44 cm²", "154 cm²", "308 cm²", "22 cm²"],
            answer: 1,
            explain: "Area = pi x r² = 22/7 x 7 x 7 = 154 cm²."
        },
        {
            q: "Factorise x² - 9",
            options: ["(x - 3)²", "(x + 3)(x - 3)", "(x - 9)(x + 1)", "(x + 9)(x - 1)"],
            answer: 1,
            explain: "This is a difference of two squares: a² - b² = (a + b)(a - b), so x² - 9 = (x + 3)(x - 3)."
        },
        {
            q: "If y = 3x - 2 and x = 4, find y.",
            options: ["8", "10", "12", "14"],
            answer: 1,
            explain: "y = 3(4) - 2 = 12 - 2 = 10."
        },
        {
            q: "What is the value of log₁₀ 1000?",
            options: ["2", "3", "10", "100"],
            answer: 1,
            explain: "10³ = 1000, so log₁₀ 1000 = 3."
        },
        {
            q: "What is the sum of the interior angles of a hexagon?",
            options: ["540°", "720°", "900°", "1080°"],
            answer: 1,
            explain: "Sum = (n - 2) x 180°. For a hexagon, n = 6: 4 x 180° = 720°."
        },
        {
            q: "Simplify 2³ x 2⁴",
            options: ["2¹²", "2⁷", "4⁷", "2¹"],
            answer: 1,
            explain: "When multiplying powers with the same base, add the indices: 2³⁺⁴ = 2⁷."
        },
        {
            q: "Find the mean of 4, 6, 8, 10 and 12.",
            options: ["6", "7", "8", "9"],
            answer: 2,
            explain: "Sum = 40, and 40 / 5 = 8."
        }
    ],

    "English Language": [
        {
            q: "Choose the word nearest in meaning to 'abundant'.",
            options: ["scarce", "plentiful", "rare", "tiny"],
            answer: 1,
            explain: "'Abundant' means existing in large quantities, which is the same as 'plentiful'."
        },
        {
            q: "Choose the word opposite in meaning to 'generous'.",
            options: ["kind", "stingy", "rich", "polite"],
            answer: 1,
            explain: "A generous person gives freely. 'Stingy' (unwilling to give) is the opposite."
        },
        {
            q: "Neither of the boys ___ present at the meeting.",
            options: ["were", "are", "was", "have been"],
            answer: 2,
            explain: "'Neither' is singular here, so it takes the singular verb 'was'."
        },
        {
            q: "What is the plural of 'crisis'?",
            options: ["crisises", "crises", "crisis's", "crisies"],
            answer: 1,
            explain: "Words ending in -is often change to -es in the plural: analysis/analyses, crisis/crises."
        },
        {
            q: "'The wind whispered through the trees.' Which figure of speech is this?",
            options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
            answer: 2,
            explain: "The wind is given a human action (whispering), which is personification."
        },
        {
            q: "Choose the correct spelling.",
            options: ["accomodation", "accommodation", "acommodation", "accomadation"],
            answer: 1,
            explain: "Accommodation has double c and double m."
        },
        {
            q: "She has been living in Lagos ___ 2015.",
            options: ["for", "since", "from", "at"],
            answer: 1,
            explain: "'Since' is used with a point in time (2015). 'For' is used with a length of time."
        },
        {
            q: "What does the idiom 'to kick the bucket' mean?",
            options: ["to die", "to get angry", "to start a fight", "to be lucky"],
            answer: 0,
            explain: "'Kick the bucket' is an informal idiom meaning to die."
        },
        {
            q: "Choose the word nearest in meaning to 'diligent'.",
            options: ["lazy", "hardworking", "careless", "slow"],
            answer: 1,
            explain: "A diligent person works carefully and with effort, so 'hardworking' fits."
        },
        {
            q: "By the time we arrived, the film ___.",
            options: ["has started", "had started", "starts", "is starting"],
            answer: 1,
            explain: "The film started before we arrived, so the past perfect 'had started' is correct."
        }
    ],

    "Biology": [
        {
            q: "Which cell organelle is known as the 'powerhouse of the cell'?",
            options: ["Nucleus", "Mitochondrion", "Ribosome", "Vacuole"],
            answer: 1,
            explain: "Mitochondria release energy from food during respiration."
        },
        {
            q: "The process by which green plants make their own food is called:",
            options: ["Respiration", "Digestion", "Photosynthesis", "Transpiration"],
            answer: 2,
            explain: "Plants use light, carbon dioxide and water to make glucose and oxygen."
        },
        {
            q: "Which blood group is the universal donor?",
            options: ["A", "B", "AB", "O"],
            answer: 3,
            explain: "Group O red cells have neither A nor B antigens, so they can be given to most recipients."
        },
        {
            q: "Which organ produces insulin?",
            options: ["Liver", "Kidney", "Pancreas", "Stomach"],
            answer: 2,
            explain: "Insulin is made by the pancreas and controls blood sugar."
        },
        {
            q: "A deficiency of which vitamin causes scurvy?",
            options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
            answer: 2,
            explain: "Lack of vitamin C causes scurvy (bleeding gums, slow wound healing)."
        },
        {
            q: "Who is regarded as the father of genetics?",
            options: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Robert Hooke"],
            answer: 1,
            explain: "Gregor Mendel's pea-plant experiments laid the foundation of genetics."
        },
        {
            q: "Which of these is the vector of malaria?",
            options: ["Female Anopheles mosquito", "Housefly", "Tsetse fly", "Male Culex mosquito"],
            answer: 0,
            explain: "The female Anopheles mosquito carries the Plasmodium parasite."
        },
        {
            q: "Gaseous exchange in the lungs takes place in the:",
            options: ["Bronchi", "Trachea", "Alveoli", "Diaphragm"],
            answer: 2,
            explain: "Alveoli are tiny thin-walled air sacs where oxygen and carbon dioxide are exchanged."
        },
        {
            q: "Which enzyme in saliva begins the digestion of starch?",
            options: ["Pepsin", "Lipase", "Amylase", "Trypsin"],
            answer: 2,
            explain: "Salivary amylase breaks starch down into simpler sugars."
        },
        {
            q: "Which plant tissue transports water and mineral salts from the roots?",
            options: ["Phloem", "Xylem", "Cambium", "Epidermis"],
            answer: 1,
            explain: "Xylem carries water and minerals upward; phloem carries manufactured food."
        }
    ],

    "Physics": [
        {
            q: "What is the SI unit of force?",
            options: ["Joule", "Newton", "Watt", "Pascal"],
            answer: 1,
            explain: "Force is measured in newtons (N)."
        },
        {
            q: "A car travels 120 km in 2 hours. What is its average speed?",
            options: ["30 km/h", "60 km/h", "90 km/h", "240 km/h"],
            answer: 1,
            explain: "Speed = distance / time = 120 / 2 = 60 km/h."
        },
        {
            q: "Which of the following is a vector quantity?",
            options: ["Speed", "Mass", "Velocity", "Time"],
            answer: 2,
            explain: "Velocity has both magnitude and direction, so it is a vector."
        },
        {
            q: "A current of 2 A flows through a 5 ohm resistor. What is the voltage?",
            options: ["2.5 V", "7 V", "10 V", "25 V"],
            answer: 2,
            explain: "Ohm's law: V = I x R = 2 x 5 = 10 V."
        },
        {
            q: "Which type of mirror is commonly used as a car's rear-view mirror?",
            options: ["Plane mirror", "Concave mirror", "Convex mirror", "Parabolic mirror"],
            answer: 2,
            explain: "A convex mirror gives a wider field of view."
        },
        {
            q: "The energy a body has because of its position is called:",
            options: ["Kinetic energy", "Potential energy", "Heat energy", "Sound energy"],
            answer: 1,
            explain: "Potential energy is stored energy due to position or state, such as height above the ground."
        },
        {
            q: "The speed of light in a vacuum is approximately:",
            options: ["3 x 10⁶ m/s", "3 x 10⁸ m/s", "3 x 10¹⁰ m/s", "3 x 10⁴ m/s"],
            answer: 1,
            explain: "Light travels at about 3 x 10⁸ metres per second."
        },
        {
            q: "The acceleration due to gravity near the Earth's surface is approximately:",
            options: ["1 m/s²", "5 m/s²", "10 m/s²", "100 m/s²"],
            answer: 2,
            explain: "The accurate value is about 9.8 m/s², commonly rounded to 10 m/s² in exam calculations."
        },
        {
            q: "What force is needed to give a 5 kg mass an acceleration of 4 m/s²?",
            options: ["1.25 N", "9 N", "20 N", "25 N"],
            answer: 2,
            explain: "F = m x a = 5 x 4 = 20 N."
        },
        {
            q: "What is the SI unit of frequency?",
            options: ["Hertz", "Decibel", "Ohm", "Tesla"],
            answer: 0,
            explain: "Frequency is measured in hertz (Hz), or cycles per second."
        }
    ],

    "Chemistry": [
        {
            q: "What is the chemical symbol for sodium?",
            options: ["S", "So", "Na", "Sd"],
            answer: 2,
            explain: "Na comes from the Latin name 'natrium'."
        },
        {
            q: "The atomic number of an element is the number of:",
            options: ["Neutrons", "Protons", "Electrons plus neutrons", "Nucleons"],
            answer: 1,
            explain: "Atomic number = number of protons in the nucleus."
        },
        {
            q: "What is the pH of a neutral solution at 25°C?",
            options: ["0", "5", "7", "14"],
            answer: 2,
            explain: "pH 7 is neutral. Below 7 is acidic and above 7 is alkaline."
        },
        {
            q: "Which gas turns lime water milky?",
            options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"],
            answer: 2,
            explain: "Carbon dioxide reacts with lime water to form insoluble calcium carbonate, making it look milky."
        },
        {
            q: "Which gas is the most abundant in the Earth's atmosphere?",
            options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"],
            answer: 1,
            explain: "Nitrogen makes up about 78% of dry air."
        },
        {
            q: "Which of these is a noble gas?",
            options: ["Oxygen", "Nitrogen", "Argon", "Hydrogen"],
            answer: 2,
            explain: "Argon is in Group 18 (the noble gases) and is very unreactive."
        },
        {
            q: "The process of obtaining a pure solvent from a solution by evaporation followed by condensation is:",
            options: ["Filtration", "Distillation", "Decantation", "Sublimation"],
            answer: 1,
            explain: "Distillation boils the liquid off and condenses the vapour back to a pure liquid."
        },
        {
            q: "Rusting of iron requires:",
            options: ["Oxygen only", "Water only", "Oxygen and water", "Carbon dioxide only"],
            answer: 2,
            explain: "Iron rusts when both oxygen and water (moisture) are present."
        },
        {
            q: "Which of the following is an alkali metal?",
            options: ["Calcium", "Potassium", "Magnesium", "Aluminium"],
            answer: 1,
            explain: "Alkali metals are in Group 1: lithium, sodium, potassium and so on."
        },
        {
            q: "What is the valency of oxygen?",
            options: ["1", "2", "3", "4"],
            answer: 1,
            explain: "Oxygen has 6 outer electrons and needs 2 more to be stable, so its valency is 2."
        }
    ],

    "Government": [
        {
            q: "Nigeria gained independence from Britain on:",
            options: ["1 October 1960", "1 January 1914", "1 October 1963", "29 May 1999"],
            answer: 0,
            explain: "Nigeria became independent on 1 October 1960."
        },
        {
            q: "Nigeria became a republic in:",
            options: ["1960", "1963", "1966", "1979"],
            answer: 1,
            explain: "Nigeria became a republic on 1 October 1963, with a Nigerian head of state replacing the Queen."
        },
        {
            q: "How many states does Nigeria have (not counting the FCT)?",
            options: ["30", "32", "36", "37"],
            answer: 2,
            explain: "Nigeria has 36 states plus the Federal Capital Territory, Abuja."
        },
        {
            q: "Which arm of government makes laws?",
            options: ["Executive", "Legislature", "Judiciary", "Civil service"],
            answer: 1,
            explain: "The legislature makes laws, the executive implements them, and the judiciary interprets them."
        },
        {
            q: "The current constitution of Nigeria came into effect in:",
            options: ["1979", "1989", "1999", "2011"],
            answer: 2,
            explain: "The 1999 Constitution took effect on 29 May 1999."
        },
        {
            q: "Which city became Nigeria's capital in 1991, replacing Lagos?",
            options: ["Kaduna", "Abuja", "Ibadan", "Port Harcourt"],
            answer: 1,
            explain: "The capital was officially moved from Lagos to Abuja in 1991."
        },
        {
            q: "Nigeria's national legislature is made up of:",
            options: ["The Senate and the House of Representatives", "The Senate and the Supreme Court", "The Cabinet and the Senate", "The Governors' Forum and the Senate"],
            answer: 0,
            explain: "The National Assembly is bicameral: the Senate and the House of Representatives."
        },
        {
            q: "A system in which power is shared between a central government and regional governments is called:",
            options: ["Unitary system", "Federalism", "Monarchy", "Confederation of states only"],
            answer: 1,
            explain: "In federalism, power is divided between the federal government and state governments."
        },
        {
            q: "'Rule of law' means that:",
            options: ["Only the president obeys the law", "Everyone is equal before the law", "The army makes the law", "Laws apply only to citizens"],
            answer: 1,
            explain: "Rule of law means everyone, including those in government, is subject to the law."
        },
        {
            q: "Which arm of government interprets the law?",
            options: ["Legislature", "Executive", "Judiciary", "Police"],
            answer: 2,
            explain: "The judiciary (the courts) interprets the law and settles disputes."
        }
    ]
};