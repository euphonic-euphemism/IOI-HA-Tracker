// Norms Data (Cox, Alexander, & Beyer, 2002)
// Ranges represent the "middle 50%" of individual clients
export const NORMS = {
    // Group A: Subjective problems = none, mild, moderate
    mildModerate: {
        1: [3, 5], // Use
        2: [3, 4], // Benefit
        3: [3, 4], // RAL
        4: [2, 4], // Satisfaction
        5: [3, 4], // RPR
        6: [3, 5], // Impact on Others
        7: [3, 4]  // Quality of Life
    },
    // Group B: Subjective problems = moderately-severe, severe
    modSevere: {
        1: [4, 5],
        2: [3, 4],
        3: [2, 4],
        4: [3, 5],
        5: [3, 4],
        6: [2, 4],
        7: [3, 4]
    }
};

// Full IOI-HA Questions and Answers
export const ioiData = [
    {
        id: 1,
        title: "1. Daily Use",
        question: "Think about how much you used your present hearing aid(s) over the past two weeks. On an average day, how many hours did you use the hearing aid(s)?",
        options: [
            { val: 1, label: "None" },
            { val: 2, label: "Less than 1 hour a day" },
            { val: 3, label: "1 to 4 hours a day" },
            { val: 4, label: "4 to 8 hours a day" },
            { val: 5, label: "More than 8 hours a day" }
        ]
    },
    {
        id: 2,
        title: "2. Benefit",
        question: "Think about the situation where you most wanted to hear better, before you got your present hearing aid(s). Over the past two weeks, how much has the hearing aid helped in those situations?",
        options: [
            { val: 1, label: "Helped not at all" },
            { val: 2, label: "Helped slightly" },
            { val: 3, label: "Helped moderately" },
            { val: 4, label: "Helped quite a lot" },
            { val: 5, label: "Helped very much" }
        ]
    },
    {
        id: 3,
        title: "3. Residual Activity Limitation",
        question: "Think again about the situation where you most wanted to hear better. When you use your present hearing aid(s), how much difficulty do you still have in that situation?",
        options: [
            { val: 1, label: "Very much difficulty" },
            { val: 2, label: "Quite a lot of difficulty" },
            { val: 3, label: "Moderate difficulty" },
            { val: 4, label: "Slight difficulty" },
            { val: 5, label: "No difficulty" }
        ]
    },
    {
        id: 4,
        title: "4. Satisfaction",
        question: "Considering everything, do you think your present hearing aid(s) is worth the trouble?",
        options: [
            { val: 1, label: "Not at all worth it" },
            { val: 2, label: "Slightly worth it" },
            { val: 3, label: "Moderately worth it" },
            { val: 4, label: "Quite a lot worth it" },
            { val: 5, label: "Very much worth it" }
        ]
    },
    {
        id: 5,
        title: "5. Residual Participation Restriction",
        question: "Over the last two weeks, with your present hearing aid(s), how much have your hearing difficulties affected the things you can do or the places you can go?",
        options: [
            { val: 1, label: "Affected very much" },
            { val: 2, label: "Affected quite a lot" },
            { val: 3, label: "Affected moderately" },
            { val: 4, label: "Affected slightly" },
            { val: 5, label: "Affected not at all" }
        ]
    },
    {
        id: 6,
        title: "6. Impact on Others",
        question: "Over the last two weeks, with your present hearing aid(s), how much do you think other people were bothered by your hearing difficulties?",
        options: [
            { val: 1, label: "Bothered very much" },
            { val: 2, label: "Bothered quite a lot" },
            { val: 3, label: "Bothered moderately" },
            { val: 4, label: "Bothered slightly" },
            { val: 5, label: "Bothered not at all" }
        ]
    },
    {
        id: 7,
        title: "7. Quality of Life",
        question: "Considering everything, how much has your present hearing aid(s) changed your enjoyment of life?",
        options: [
            { val: 1, label: "Worse" },
            { val: 2, label: "No change" },
            { val: 3, label: "Slightly better" },
            { val: 4, label: "Quite a lot better" },
            { val: 5, label: "Very much better" }
        ]
    }
];

// Question 8 Data (The Classifier)
export const q8Data = {
    id: 8,
    title: "8. Unaided Difficulty",
    question: "How much hearing difficulty do you have when you are not wearing a hearing aid?",
    options: [
        { val: 1, label: "None", group: 'mildModerate' },
        { val: 2, label: "Mild", group: 'mildModerate' },
        { val: 3, label: "Moderate", group: 'mildModerate' },
        { val: 4, label: "Moderately-severe", group: 'modSevere' },
        { val: 5, label: "Severe", group: 'modSevere' }
    ]
};

// Determine which norm group applies
export const getNormGroup = (q8Val) => {
    if (!q8Val) return null;
    return q8Val <= 3 ? 'mildModerate' : 'modSevere';
};

// Check if a specific score is within norms
export const getNormStatus = (qId, val, q8Val) => {
    if (!q8Val || !val) return 'unknown';
    const group = getNormGroup(q8Val);
    const range = NORMS[group][qId];
    if (val < range[0]) return 'below';
    if (val > range[1]) return 'above'; // Rarely used as "bad", but "outside norm"
    return 'within';
};

export const isValInNorm = (qId, val, q8Val) => {
    if (!q8Val) return false;
    const group = getNormGroup(q8Val);
    const range = NORMS[group][qId];
    return val >= range[0] && val <= range[1];
};
