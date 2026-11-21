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
    kind: 'legit', maxLevel: 'Lower Risk', mustNotFlag: ['fee', 'credentials', 'urgency'],
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

// --- The four "quick sample" buttons on the home page, exactly as CheckerForm sends them ---
// If a demo button gives the wrong verdict, the product looks broken to every visitor.
cases.push(
  {
    name: 'SAMPLE button "Fee Scam" (TCS, gmail, UPI, laptop deposit)',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['fee', 'impersonation'],
    submission: {
      inputType: 'text', companyName: 'Tata Consultancy Services (Placement HR)', role: 'Remote Data Analyst Intern',
      recruiterEmail: 'hr.tcs.placement2026@gmail.com', internshipUrl: '', stipendClaimed: '₹45,000 / month',
      text: 'Congratulations! You have been directly selected for TCS 3-month Remote Data Analytics Internship. Stipend: Rs 45,000/month. No technical interview required. To confirm your joining kit and laptop delivery, deposit a refundable security charge of Rs 1,999 to UPI: tcsrecruitment@okaxis within 2 hours. Send screenshot of payment to complete onboarding.'
    }
  },
  {
    name: 'SAMPLE button "Link / Form Check" (Wipro Google Form)',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['fee'],
    submission: {
      inputType: 'url', companyName: 'Wipro Careers (Alleged)', role: 'Web Developer Intern', recruiterEmail: '',
      internshipUrl: 'https://forms.gle/wipro-hiring-security-deposit-test', stipendClaimed: '₹30,000 / month',
      text: 'Link application demanding candidate submit Aadhaar photo and ₹1,500 registration charge.'
    }
  },
  {
    name: 'SAMPLE button "Header Spoof Check" (Infosys From, gmail Reply-To)',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['impersonation'],
    submission: {
      inputType: 'email', companyName: 'Infosys Technologies', role: 'Cloud Support Intern', recruiterEmail: 'hr@infosys.com',
      internshipUrl: '', stipendClaimed: '₹35,000 / month',
      text: 'From: "Infosys Campus Recruitment" <hr@infosys.com>\nReply-To: "HR Fast Payout" <infosys.recruitment.india@gmail.com>\nSubject: Immediate Selection for Cloud Internship\nDate: Sat, 24 Oct 2026 14:00:00 +0530\n\nDear Student,\nYou have been chosen for the Infosys Cloud Support Internship. You will receive ₹35,000/mo. To accept this position, please respond strictly to our coordinator at infosys.recruitment.india@gmail.com with your contact details and bank IFSC.'
    }
  },
  {
    name: 'SAMPLE button "Legitimate Offer" (Razorpay, "never asks for bank passwords")',
    kind: 'legit', maxLevel: 'Lower Risk', maxScore: 15, mustNotFlag: ['fee', 'credentials', 'impersonation'],
    submission: {
      inputType: 'text', companyName: 'Razorpay Technologies', role: 'Software Engineering Intern',
      recruiterEmail: 'campus-hiring@razorpay.com', internshipUrl: 'https://razorpay.com/jobs/intern-swe', stipendClaimed: '₹35,000 / month',
      text: 'We invite students from engineering disciplines to apply for our Summer 2026 Software Engineering Internship. Candidates will undergo an online coding round followed by 2 technical interviews. Stipend: Rs 35,000/month. Razorpay never asks candidates for any fees, security deposits, or bank passwords at any stage of hiring.'
    }
  }
);

// --- Legitimate offers that mention sensitive words honestly ---
cases.push(
  {
    name: 'Legit: portal sends an OTP to verify your email',
    kind: 'legit', maxLevel: 'Lower Risk', mustNotFlag: ['credentials'],
    submission: {
      inputType: 'text', companyName: 'Freshworks', recruiterEmail: 'campus@freshworks.com',
      text: 'Thank you for clearing the coding round. Log in to our careers portal; you will receive an OTP to verify your email before the interview is scheduled.'
    }
  },
  {
    name: 'Legit: bring Aadhaar and PAN on joining day',
    kind: 'legit', maxLevel: 'Lower Risk', mustNotFlag: ['credentials'],
    submission: {
      inputType: 'text', companyName: 'Paytm', recruiterEmail: 'hr@paytm.com',
      text: 'Following your final interview, your internship starts on 5 January. Please bring your Aadhaar card and PAN card on the joining day for payroll setup at our Noida office.'
    }
  },
  {
    name: 'Legit: "do not share your OTP or bank details with anyone"',
    kind: 'legit', maxLevel: 'Lower Risk', mustNotFlag: ['credentials', 'fee'],
    submission: {
      inputType: 'text', companyName: 'Flipkart', recruiterEmail: 'campushiring@flipkart.com',
      text: 'Your interview is confirmed for Tuesday. Please note: Flipkart will never ask you to share your OTP, bank details, or any payment. Do not share your OTP with anyone claiming to represent us.'
    }
  },
  {
    name: 'Legit: big company named, no email or link given',
    kind: 'legit', maxLevel: 'Caution', maxScore: 25, mustNotFlag: ['impersonation', 'fee'],
    submission: {
      inputType: 'text', companyName: 'Microsoft', role: 'Software Engineering Intern',
      text: 'I cleared the online assessment and two interview rounds for the Microsoft Explore internship and got an offer through my college placement cell.'
    }
  },
  {
    name: 'Legit: known company, LinkedIn job link + official email',
    kind: 'legit', maxLevel: 'Lower Risk', mustNotFlag: ['impersonation', 'fee'],
    submission: {
      inputType: 'text', companyName: 'Google', role: 'STEP Intern',
      recruiterEmail: 'university-recruiting@google.com',
      internshipUrl: 'https://www.linkedin.com/jobs/view/1234567890',
      text: 'Thanks for applying to the STEP internship. Your technical interviews are scheduled for next week; details are in your candidate portal.'
    }
  },
  // --- Scams that the credential rule must still catch ---
  {
    name: 'Scam: send OTP and Aadhaar on WhatsApp',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['secret'],
    submission: {
      inputType: 'text',
      text: 'You are selected. To activate your intern ID, send the OTP you just received and your Aadhaar photo to this number on WhatsApp.'
    }
  },
  {
    name: 'Scam: asks for UPI PIN to "receive stipend"',
    kind: 'scam', expect: 'Very High Risk', mustFlag: ['secret'],
    submission: {
      inputType: 'text',
      text: 'To receive your first stipend instantly, enter your UPI PIN on the link we sent.'
    }
  },
  {
    name: 'Suspicious: send bank details before any interview',
    kind: 'suspicious', expect: 'Caution', mustFlag: ['credentials'],
    submission: {
      inputType: 'text',
      text: 'Congratulations, you are shortlisted. Kindly share your bank account details and PAN card copy so we can process your stipend.'
    }
  }
);

module.exports = { cases, TECHNOVA };
