export const dashboardData = {
  healthScore: {
    value: 85,
    status: "Excellent",
    message: "Your health is in great condition.",
  },

  routine: {
  completion: 82,
  sleep: { value: "7h 20m", progress: 85 },
  water: { value: "1.8L", progress: 72 },
  steps: { value: "8,432", progress: 84 },
  workout: { value: "45m", progress: 100 },
},

  alerts: [
  { id: 1, label: "Blood Pressure", level: "high" },
  { id: 2, label: "Glucose Levels", level: "medium" },
  { id: 3, label: "Cholesterol", level: "low" },
],

  weeklyTrend: [
  { day: "Mon", value: 60 },
  { day: "Tue", value: 80 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 95 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 85 },
  { day: "Sun", value: 35 },
],

  recentActivities: [
  {
    id: 1,
    type: "activity",
    title: "Cardio Session Sync",
    subtitle: "Apple Watch • 45 mins • 320 kcal",
    time: "2h ago",
  },
  {
    id: 2,
    type: "report",
    title: "Lab Results Uploaded",
    subtitle: "Annual Checkup • PDF available",
    time: "Yesterday",
  },
  {
    id: 3,
    type: "profile",
    title: "Profile Update",
    subtitle: "New allergy information synchronized",
    time: "Yesterday",
  },
],

  medications: [
    {
      id: 1,
      name: "Lisinopril 10mg",
      time: "After breakfast • 8:00 AM",
      status: "Done",
    },
    {
      id: 2,
      name: "Vitamin D3",
      time: "With lunch • 1:00 PM",
      status: "Pending",
    },
  ],

  aiSummary: {
    overview:
      "Your health metrics are stable. Sleep and hydration levels are good, but physical activity can be improved.",
    insights: [
      "Sleep pattern is consistent",
      "Water intake is adequate",
      "Step count is below recommended level",
      "Mild risk detected for blood pressure",
    ],
  },

  

  familyHistory: [
    {
      id: 1,
      condition: "Type 2 Diabetes",
      relation: "Mother",
      risk: "high",
      ageOfOnset: "Age 48",
      status: "Ongoing",
      notes: "Family trend suggests regular sugar monitoring is important.",
    },
    {
      id: 2,
      condition: "Hypertension",
      relation: "Father",
      risk: "medium",
      ageOfOnset: "Age 52",
      status: "Managed",
      notes: "Blood pressure checks should remain consistent.",
    },
    {
      id: 3,
      condition: "Thyroid Disorder",
      relation: "Maternal Aunt",
      risk: "low",
      ageOfOnset: "Age 40",
      status: "Recorded",
      notes: "Useful for long-term preventive screening.",
    },
  ],

  medicationSchedule: [
    {
      id: 1,
      name: "Vitamin D3",
      type: "Tablet",
      dosage: "1 tablet after breakfast",
      time: "08:00 AM",
      status: "taken",
      note: "Completed",
    },
    {
      id: 2,
      name: "Metformin",
      type: "Tablet",
      dosage: "500 mg",
      time: "01:00 PM",
      status: "pending",
      note: "After lunch",
    },
    {
      id: 3,
      name: "Calcium Supplement",
      type: "Capsule",
      dosage: "1 capsule",
      time: "08:00 PM",
      status: "missed",
      note: "Evening dose",
    },
  ],
  

  aiHealthSummary: {
    headline: "Your routine is stable, but hydration needs attention",
    overview:
      "Based on recent logs, sleep consistency and medication adherence are improving. Water intake remains slightly below target, which may affect energy and focus over time.",
    priority: "medium",
    suggestions: [
      {
        id: 1,
        type: "insight",
        title: "Routine consistency is improving",
        description:
          "Your sleep and medication completion patterns have become more stable over the last few days.",
        tag: "Trend",
        tagVariant: "accent",
      },
      {
        id: 2,
        type: "recommendation",
        title: "Increase water intake reminders",
        description:
          "Adding one more hydration reminder in the afternoon may help you reach your daily target.",
        tag: "Action",
        tagVariant: "primary",
      },
      {
        id: 3,
        type: "alert",
        title: "Watch evening fatigue pattern",
        description:
          "Low hydration and missed evening supplements may be contributing to reduced energy at night.",
        tag: "Attention",
        tagVariant: "danger",
      },
    ],
  },

};

export const profileData = {
  fullName: "Pratibha Jaiswal",
  email: "pratibha@example.com",
  phone: "+91 9876543210",
  dob: "15 Aug 2004",
  bloodGroup: "B+",
  address: "Kanpur, Uttar Pradesh",
  height: "162 cm",
  weight: "54 kg",
};
export const familyMembers = [
  { name: "Mother", relation: "Parent", access: "Full" },
  { name: "Father", relation: "Parent", access: "Full" },
  { name: "Brother", relation: "Sibling", access: "Limited" },
];
export const routineData = {
  completed: 76,
  sleepHours: 7.5,
  waterIntake: 2.4,
  steps: 8421,
  workout: 35,
  todayRoutine: [
    {
      id: 1,
      title: "Morning medication",
      description: "Take Vitamin D and iron supplements after breakfast.",
      time: "8:00 AM",
      category: "Medication",
      completed: true,
    },
  ],
  weeklyOverview: [
    {
      id: 1,
      day: "Monday",
      label: "Strong consistency",
      progress: 82,
      completedTasks: 5,
      totalTasks: 6,
    },
    {
      id: 2,
      day: "Tuesday",
      label: "Moderate progress",
      progress: 64,
      completedTasks: 4,
      totalTasks: 6,
    },
    {
      id: 3,
      day: "Wednesday",
      label: "Needs attention",
      progress: 35,
      completedTasks: 2,
      totalTasks: 6,
    },
    {
      id: 4,
      day: "Thursday",
      label: "Good balance",
      progress: 76,
      completedTasks: 5,
      totalTasks: 6,
    },
    {
      id: 5,
      day: "Friday",
      label: "Improving",
      progress: 58,
      completedTasks: 3,
      totalTasks: 6,
    },
  ],
};
export const analysisData = {
  overallScore: {
    value: 84,
    status: "Good",
    note: "Your health indicators are stable, with a few areas to improve.",
  },
  metrics: [
    { label: "Sleep Quality", value: "82%" },
    { label: "Heart Health", value: "88%" },
    { label: "Hydration", value: "76%" },
    { label: "Activity Level", value: "71%" },
  ],
  recommendations: [
    "Increase daily steps by 1,500.",
    "Reduce caffeine intake after evening hours.",
    "Improve hydration consistency during the afternoon.",
  ],
  conditionRecommendation: {
    title: "Blood Pressure Focus",
    description:
      "Monitor sodium intake and maintain regular evening walks to support healthy blood pressure trends.",
  },
  summary: {
    title: "AI Analysis Summary",
    text:
      "Your recent routine suggests good sleep consistency, but physical activity and hydration can be improved for better recovery and long-term cardiovascular health.",
  },
};



export const familyData = [
  {
    id: 1,
    name: "Sunita Jaiswal",
    relation: "Mother",
    age: 48,
    gender: "Female",
    accessLevel: "full",
    conditions: ["Type 2 Diabetes", "Hypertension"],
  },
  {
    id: 2,
    name: "Rajesh Jaiswal",
    relation: "Father",
    age: 52,
    gender: "Male",
    accessLevel: "limited",
    conditions: ["Hypertension"],
  },
  {
    id: 3,
    name: "Anjali Jaiswal",
    relation: "Sister",
    age: 21,
    gender: "Female",
    accessLevel: "emergency",
    conditions: [],
  },
];
export const analysisStats = [
  {
    title: "Health Trend",
    value: "+12%",
    subtitle: "Improved this month",
    icon: "TrendingUp",
  },
  {
    title: "Heart Score",
    value: "84",
    subtitle: "Stable condition",
    icon: "HeartPulse",
  },
  {
    title: "Mental Wellness",
    value: "Good",
    subtitle: "Stress under control",
    icon: "Brain",
  },
];

export const chartData = [
  {
    label: "Heart Health",
    value: 84,
    note: "Very good recovery trend",
    icon: "HeartPulse",
  },
  {
    label: "Sleep Quality",
    value: 72,
    note: "Needs slightly better consistency",
    icon: "Moon",
  },
  {
    label: "Hydration",
    value: 68,
    note: "Increase daily water intake",
    icon: "Droplets",
  },
  {
    label: "Physical Activity",
    value: 91,
    note: "Excellent performance level",
    icon: "Activity",
  },
];

export const recentReports = [
  {
    title: "Weekly Wellness Report",
    date: "15 Apr 2026",
    status: "Completed",
    summary: "Overall health indicators improved compared to last week.",
  },
  {
    title: "Sleep Pattern Analysis",
    date: "12 Apr 2026",
    status: "Reviewed",
    summary: "Sleep duration is healthy, but consistency can be improved.",
  },
  {
    title: "Cardiac Activity Report",
    date: "09 Apr 2026",
    status: "Stable",
    summary: "Heart rate and physical activity trends remain balanced.",
  },
];

export const recommendations = [
  "Maintain at least 7–8 hours of sleep daily",
  "Drink 2.5L to 3L water regularly",
  "Continue daily light workout or walking",
  "Track stress and mental wellness weekly",
];

export const healthTimeline = [
  {
    day: "Mon",
    update: "Routine completed with strong hydration and sleep score.",
  },
  {
    day: "Wed",
    update: "Physical activity improved by 8% from previous session.",
  },
  {
    day: "Fri",
    update: "AI analysis suggested improving bedtime consistency.",
  },
  {
    day: "Sun",
    update: "Overall weekly wellness score increased significantly.",
  },
];
export const timelineData = {
  events: [
    {
      id: 1,
      title: "General Health Checkup",
      type: "checkup",
      date: "15 Apr 2026",
      time: "10:00 AM",
      doctor: "Dr. Mehta",
      location: "City Clinic",
      description: "Routine consultation and vitals assessment completed.",
    },
    {
      id: 2,
      title: "Blood Test Report Uploaded",
      type: "report",
      date: "12 Apr 2026",
      time: "5:00 PM",
      doctor: "Lab Report",
      location: "Diagnostic Center",
      description: "CBC and vitamin profile added to medical records.",
    },
    {
      id: 3,
      title: "Evening Medication Reminder",
      type: "medication",
      date: "10 Apr 2026",
      time: "8:00 PM",
      doctor: "",
      location: "",
      description: "Calcium and vitamin D dose recorded.",
    },
    {
      id: 4,
      title: "Low Hydration Alert",
      type: "alert",
      date: "08 Apr 2026",
      time: "3:15 PM",
      doctor: "",
      location: "",
      description: "Water intake was below target for the day.",
    },
    {
      id: 5,
      title: "Morning Walk Logged",
      type: "routine",
      date: "07 Apr 2026",
      time: "7:00 AM",
      doctor: "",
      location: "Neighborhood Park",
      description: "25-minute walk added to routine history.",
    },
  ],
};
export const emergencyData = {
  bloodGroup: "B+",
  allergies: [
    {
      id: 1,
      name: "Penicillin",
      severity: "High",
      note: "Avoid penicillin-based antibiotics due to prior allergic reaction.",
    },
    {
      id: 2,
      name: "Dust Allergy",
      severity: "Medium",
      note: "May trigger sneezing and breathing discomfort.",
    },
  ],
  contacts: [
    {
      id: 1,
      name: "Sunita Jaiswal",
      relation: "Mother",
      phone: "+91 9876543210",
      altPhone: "+91 9123456780",
      priority: 1,
    },
    {
      id: 2,
      name: "Rajesh Jaiswal",
      relation: "Father",
      phone: "+91 9988776655",
      altPhone: "",
      priority: 2,
    },
  ],
  primaryDoctor: {
    name: "Dr. Mehta",
    specialization: "General Physician",
    phone: "+91 9012345678",
    hospital: "City Care Hospital, Kanpur",
  },
};
export const privacyData = {
  permissions: [
    {
      id: 1,
      label: "Doctor Access",
      description: "Allow doctor to view full records",
      enabled: true,
    },
    {
      id: 2,
      label: "Family Access",
      description: "Allow family to view limited data",
      enabled: false,
    },
  ],
  logs: [
    {
      action: "Doctor accessed medical report",
      time: "2 hours ago",
    },
    {
      action: "Data downloaded",
      time: "Yesterday",
    },
  ],
};