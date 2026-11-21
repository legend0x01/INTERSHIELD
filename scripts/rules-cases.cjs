'use strict';

// Real-world test corpus for the InternShield rules engine.
// `expect` is the MINIMUM acceptable risk level for scams, or the MAXIMUM for legit offers.

const TECHNOVA = `Congratulations! You Have Been Selected for an Internship!

Dear Student,

We are pleased to inform you that your profile has been shortlisted for our Data Science & AI Internship Program 2026.

Company: TechNova Global Solutions Pvt. Ltd.
Position: AI/ML Intern
Duration: 3 Months
Stipend: ₹25,000 – ₹40,000/month
Certificate: Guaranteed
Mode: Work From Home

Important Selection Requirement:

To confirm your internship seat, you must pay a refundable registration and onboarding fee of ₹1,499.

Limited seats available! Complete your registration within 2 hours.

Payment Link: technova-careers.example/register

Reply "YES" immediately to secure your position.

Regards,
HR Recruitment Team
TechNova Global Solutions`;

const cases = [
  {
    name: 'TechNova (user-reported false negative)',
    kind: 'scam',
    expect: 'Very High Risk',
    mustFlag: ['fee', 'urgency'],
    submission: { id: 't1', inputType: 'text', text: TECHNOVA, consent: true }
  },
  {
    name: 'Fee worded as "onboarding charges"',
    kind: 'scam',
    expect: 'Very High Risk',
    mustFlag: ['fee'],
    submission: {
      id: 't2', inputType: 'text', consent: true,
      text: 'You have been selected. Kindly deposit onboarding charges of INR 2500 to confirm your slot.'
    }
  },
  {
    name: 'Refundable security amount + UPI',
    kind: 'scam',
    expect: 'Very High Risk',
    mustFlag: ['fee'],
    submission: {
      id: 't3', inputType: 'text', consent: true,
      text: 'Pay a refundable security amount of 1500 rupees on our UPI id scamguy@ybl to receive the laptop.'
    }
  },
  {
    name: 'Brand impersonation via gmail',
    kind: 'scam',
    expect: 'Very High Risk',
    mustFlag: ['impersonation'],
    submission: {
      id: 't4', inputType: 'company', consent: true, companyName: 'Infosys',
      recruiterEmail: 'infosys.hr.team@gmail.com',
      text: 'Infosys internship offer. Reply for joining letter.'
    }
  },
  {
    name: 'OTP / Aadhaar harvesting',
    kind: 'scam',
    expect: 'Very High Risk',
    mustFlag: ['credentials'],
    submission: {
      id: 't5', inputType: 'text', consent: true,
      text: 'Share the OTP you received and your Aadhaar number to complete document verification.'
    }
  },
  {
    name: 'Urgency only, no fee',
    kind: 'suspicious',
    expect: 'Caution',
    mustFlag: ['urgency'],
    submission: {
      id: 't6', inputType: 'text', consent: true,
      text: 'Hurry! Only 3 seats left, confirm within 24 hours.'
    }
  },
  {
    name: 'Genuine corporate offer',
    kind: 'legit',
    maxLevel: 'Caution',
    mustNotFlag: ['fee', 'credentials', 'impersonation'],
    submission: {
      id: 't7', inputType: 'company', consent: true,
      companyName: 'Zoho Corporation', role: 'Backend Engineering Intern',
      recruiterEmail: 'campus.hiring@zohocorp.com',
      stipendClaimed: '25,000/month',
      text: 'Following your campus interview and technical assessment round, we are pleased to extend an internship offer. Your reporting manager will share onboarding documents through our HR portal. There is no fee at any stage of this process.'
    }
  },
  {
    name: 'Legit offer that merely mentions a stipend figure',
    kind: 'legit',
    maxLevel: 'Caution',
    mustNotFlag: ['fee'],
    submission: {
      id: 't8', inputType: 'text', consent: true,
      companyName: 'Hexaware Technologies',
      recruiterEmail: 'talent@hexaware.com',
      text: 'Stipend is Rs 40,000 per month. Candidates clear three interview rounds. Our survey of past interns shows strong conversion to full time roles.'
    }
  },
  {
    name: 'Legit text containing the word "money" (regression: 2-letter brand match)',
    kind: 'legit',
    maxLevel: 'Caution',
    mustNotFlag: ['impersonation'],
    submission: {
      id: 't9', inputType: 'text', consent: true,
      companyName: 'Bright Analytics LLP',
      recruiterEmail: 'hr@brightanalytics.in',
      text: 'We never ask interns for money. Your journey with us starts after the key technical survey round.'
    }
  }
];

// --- Adversarial cases: text that LOOKS like it should trip a rule but must not ---
cases.push(
  {
    name: 'Legit: "no registration fee is charged"',
    kind: 'legit', maxLevel: 'Caution', mustNotFlag: ['fee'],
    submission: {
      id: 'a1', inputType: 'text', consent: true,
      companyName: 'Persistent Systems', recruiterEmail: 'campus@persistent.com',
      text: 'You cleared the technical interview. No registration fee is charged at any point of our hiring process.'
    }
  },
  {
    name: 'Legit: "we never ask for a security deposit"',
    kind: 'legit', maxLevel: 'Caution', mustNotFlag: ['fee'],
    submission: {
      id: 'a2', inputType: 'text', consent: true,
      companyName: 'Mindtree', recruiterEmail: 'hr@mindtree.com',
      text: 'A reminder from our recruitment team: we never ask candidates for a security deposit or any training fee. Your interview is scheduled for Monday.'
    }
  },
  {
    name: 'Legit: company paying the intern a high stipend',
    kind: 'legit', maxLevel: 'Caution', mustNotFlag: ['fee'],
    submission: {
      id: 'a3', inputType: 'text', consent: true,
      companyName: 'Swiggy', recruiterEmail: 'talent@swiggy.in',
      text: 'Following your coding round, stipend payment of Rs 60,000 per month will be processed monthly after you join. We will pay via payroll transfer.'
    }
  },
  {
    name: 'Legit: routine 48-hour document deadline',
    kind: 'legit', maxLevel: 'Caution', mustNotFlag: ['fee', 'credentials'],
    submission: {
      id: 'a4', inputType: 'text', consent: true,
      companyName: 'Siemens', recruiterEmail: 'recruitment@siemens.com',
      text: 'Congratulations on clearing your final interview round. Kindly complete the documentation within 48 hours so we can proceed.'
    }
  },
  // --- More scam phrasings that must be caught ---
  {
    name: 'Scam: pay to download offer letter',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['fee'],
    submission: {
      id: 'a5', inputType: 'text', consent: true,
      text: 'Your offer letter is ready. Please pay Rs 999 to download your offer letter from our portal.'
    }
  },
  {
    name: 'Scam: advance training charges',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['fee'],
    submission: {
      id: 'a6', inputType: 'text', consent: true,
      text: 'Training charges of 5000 are applicable. Candidates must pay in advance before the batch starts.'
    }
  },
  {
    name: 'Scam: QR code for seat confirmation',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['fee'],
    submission: {
      id: 'a7', inputType: 'text', consent: true,
      text: 'Scan the QR code below to pay the seat confirmation amount and your joining letter will be issued.'
    }
  },
  {
    name: 'Scam: "registeration" typo + ID card fee',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['fee'],
    submission: {
      id: 'a8', inputType: 'text', consent: true,
      text: 'Complete registeration by paying the ID card and kit charges of 750 rupees.'
    }
  }
);

module.exports = { cases, TECHNOVA };
