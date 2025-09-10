export const NAV_LINKS = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About us",
    path: "/about-us",
  },
  {
    name: "Treatment & Care",
    path: "/treatment-and-care",
  },
  {
    name: "What to Expect",
    path: "/what-to-expect",
  },
  {
    name: "Contact us",
    path: "/contact-us",
  },
];

type ExpectStep = {
  icon: "clipboard" | "filetext" | "calender";
  heading: string;
  tldr: string;
  paragraphs: string[];
};

export const WHAT_TO_EXPECT_STEPS: ExpectStep[] = [
  {
    heading: "1st Visit - Initial Consult",
    icon: "clipboard",
    tldr: "Thorough history & exam to find what’s really going on.",
    paragraphs: [
      "During your initial consult, we will take a thorough **medical history**, including details about your **current and past concerns**. We will then conduct a **physical exam** to help identify the **cause** of your problem, not just the symptoms you are experiencing.",
      "Once we have a clear understanding, we will provide care tailored to you. This may include **chiropractic adjustments, lifestyle advice, or other therapies** designed to support your recovery and ongoing wellbeing.",
    ],
  },
  {
    icon: "filetext",
    heading: "2nd Visit - Report of Findings",
    tldr: "We review results and agree on a plan.",
    paragraphs: [
      "During the report of findings, we’ll review how you’ve responded to your initial treatment and work together to outline a care plan tailored to your goals. Depending on your specific condition, it may take anywhere from a few sessions to several weeks of treatment to achieve optimal results.",
      "We’ll discuss your individual needs during our meeting, making sure you feel informed about the process. Throughout your care, we’ll work together to monitor your progress, and your feedback will help us adjust the plan as needed to ensure you’re always moving in the right direction.",
    ],
  },
  {
    icon: "calender",
    heading: "3rd and further visits - Regular Appointments",
    tldr: "Care tailored to your goals, with progress check-ins.",
    paragraphs: [
      "This is where we begin implementing your specific care plan, including scheduling your upcoming appointments and, if needed, coordinating with your healthcare team to ensure you receive the most comprehensive support.",
    ],
  },
];
