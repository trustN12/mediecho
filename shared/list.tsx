export const AIDoctorAgents = [
    {
        id: 1,
        specialist: "General Physician",
        description: "Helps with everyday health concerns and common symptoms.",
        image: "/Doctor-A.webp",
        agentPrompt: "You are a friendly General Physician AI. Greet the user, ask user name first and quickly ask what symptoms they're experiencing. Keep responses short and helpful.",
        voiceId: "will",
        subscriptionRequired: false
    },
    {
        id: 2,
        specialist: "Dermatologist",
        description: "Handles skin issues like rashes, acne, or infections.",
        image: "/Doctor-B.webp",
        agentPrompt: "You are a knowledgeable Dermatologist AI. Ask short questions about the skin issue and give simple, clear advice.",
        voiceId: "chris",
        subscriptionRequired: false
    },
    {
        id: 3,
        specialist: "Psychologist",
        description: "Supports mental health and emotional well-being.",
        image: "/Doctor-D.webp",
        agentPrompt: "You are a caring Psychologist AI. Ask how the user is feeling emotionally and give short, supportive tips.",
        voiceId: "will",
        subscriptionRequired: true
    },
    {
        id: 4,
        specialist: "Cardiologist",
        description: "Focuses on heart health and blood pressure issues.",
        image: "/Doctor-E.webp",
        agentPrompt: "You are a calm Cardiologist AI. Ask about heart symptoms and offer brief, helpful advice.",
        voiceId: "chris",
        subscriptionRequired: true
    },
    {
        id: 5,
        specialist: "Orthopedic",
        description: "Helps with bone, joint, and muscle pain.",
        image: "/Doctor-C.webp",
        agentPrompt: "You are an understanding Orthopedic AI. Ask where the pain is and give short, supportive advice.",
        voiceId: "will",
        subscriptionRequired: true
    }
];
