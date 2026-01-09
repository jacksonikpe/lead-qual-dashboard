import type { Lead } from "./types.ts";

export const mockLeads: Lead[] = [
  {
    id: "1",
    source: "email",
    timestamp: new Date("2025-01-02T10:30:00"),
    rawData: {
      name: "Sarah Johnson",
      email: "sarah.j@techstartup.io",
      company: "TechStartup Inc",
      message: `Hi, we're a 15-person SaaS company looking for a CRM solution. 
      Our current setup (Excel + email) is breaking down as we scale. 
      Budget is around $3-5k/month. Need something up and running by Q2. 
      I'm the Head of Sales. Can we schedule a demo?`,
    },
  },
  {
    id: "2",
    source: "typeform",
    timestamp: new Date("2025-01-02T14:15:00"),
    rawData: {
      name: "Mike Chen",
      email: "mike@example.com",
      message: `Just exploring options for now. Not sure what we need yet. 
      Maybe some automation tools? We're a small team.`,
    },
  },
  {
    id: "3",
    source: "whatsapp",
    timestamp: new Date("2025-01-02T16:45:00"),
    rawData: {
      name: "Amaka Obi",
      phone: "+234 801 234 5678",
      company: "Obi Logistics",
      message: `Good afternoon. We need fleet management software urgently. 
      Our current vendor's system crashed and we're losing money daily. 
      Managing 50 vehicles across Lagos. Budget approved up to ₦5M. 
      I'm the Operations Director. Please call me ASAP.`,
    },
  },
  {
    id: "4",
    source: "linkedin",
    timestamp: new Date("2025-01-03T09:20:00"),
    rawData: {
      name: "David Kim",
      email: "d.kim@enterprise.com",
      company: "Enterprise Corp",
      message: `Saw your post about workflow automation. Interesting stuff. 
      We might need something like this eventually. I'm just an intern doing research.`,
    },
  },
  {
    id: "5",
    source: "email",
    timestamp: new Date("2025-01-03T11:00:00"),
    rawData: {
      name: "Fatima Al-Rahman",
      email: "fatima@healthtech.ae",
      company: "HealthTech Solutions",
      message: `We're a healthcare provider in Dubai expanding to Nigeria. 
      Need HIPAA-compliant patient management system. 150+ staff will use it. 
      Timeline: pilot in 8 weeks, full rollout by April. 
      I'm the CTO. Budget is flexible for the right solution. 
      Can you handle enterprise deployments?`,
    },
  },
  {
    id: "6",
    source: "typeform",
    timestamp: new Date("2025-01-03T13:30:00"),
    rawData: {
      name: "John Doe",
      email: "john@example.org",
      message: `Hey, do you offer free trials? Just want to test things out.`,
    },
  },
  {
    id: "7",
    source: "email",
    timestamp: new Date("2025-01-03T15:45:00"),
    rawData: {
      name: "Priya Sharma",
      email: "priya.sharma@fintech.in",
      company: "Mumbai FinTech Ltd",
      message: `We're launching a new payment gateway and need customer onboarding automation. 
      Must integrate with our existing KYC provider. 
      Processing 500+ applications daily. VP of Product here. 
      Ideally under $10k/month. Compliance is critical. 
      Available for a call this week?`,
    },
  },
  {
    id: "8",
    source: "whatsapp",
    timestamp: new Date("2025-01-04T08:10:00"),
    rawData: {
      name: "Chidi Nwosu",
      phone: "+234 803 987 6543",
      message: `Abeg, you dey do website design? My cousin say make I check you out.`,
    },
  },
  {
    id: "9",
    source: "linkedin",
    timestamp: new Date("2025-01-04T10:30:00"),
    rawData: {
      name: "Elena Rodriguez",
      email: "e.rodriguez@retail.mx",
      company: "Retail Solutions Mexico",
      message: `We run 20 retail stores and inventory management is a nightmare. 
      Losing products to theft and mismanagement. 
      CEO asked me (COO) to find a solution by end of month. 
      Saw your automation work - can this help with retail? 
      Budget: $50-80k for first year.`,
    },
  },
  {
    id: "10",
    source: "email",
    timestamp: new Date("2025-01-04T14:20:00"),
    rawData: {
      name: "Anonymous",
      email: "info@request.com",
      message: `I need information about your pricing.`,
    },
  },
  {
    id: "11",
    source: "typeform",
    timestamp: new Date("2025-01-04T16:00:00"),
    rawData: {
      name: "Yuki Tanaka",
      email: "yuki@manufacturing.jp",
      company: "Tanaka Manufacturing",
      message: `Exploring ERP options for our factory. 
      200 employees, multiple departments. 
      Current system is 15 years old. 
      I'm the Plant Manager. Board meeting in 2 months - need recommendations. 
      Budget discussion comes after technical fit.`,
    },
  },
  {
    id: "12",
    source: "whatsapp",
    timestamp: new Date("2025-01-05T09:15:00"),
    rawData: {
      name: "Blessing Okoro",
      phone: "+234 805 111 2222",
      company: "Okoro Fashion House",
      message: `Morning! Friend recommended you. 
      I sell clothes online (Instagram mainly). 
      Want to start taking orders properly, not just DMs. 
      Can you build something simple? Not too expensive sha, maybe ₦200k?`,
    },
  },
  {
    id: "13",
    source: "email",
    timestamp: new Date("2025-01-05T11:45:00"),
    rawData: {
      name: "Dr. Ahmed Hassan",
      email: "a.hassan@university.edu.sa",
      company: "King Abdullah University",
      message: `We're digitizing our research grant application process. 
      Currently 100% paper-based, processing 300+ applications per cycle. 
      Need secure document management + review workflows. 
      I'm the Research Director. Government-funded project, budget allocated. 
      Prefer local vendors for data sovereignty. Timeline: 6 months implementation.`,
    },
  },
  {
    id: "14",
    source: "linkedin",
    timestamp: new Date("2025-01-05T14:00:00"),
    rawData: {
      name: "Tom Anderson",
      email: "tom@agency.co.uk",
      company: "Anderson Digital Agency",
      message: `Cool projects! We're also in the agency space. 
      Maybe we could collaborate sometime? Not looking for anything specific right now.`,
    },
  },
  {
    id: "15",
    source: "email",
    timestamp: new Date("2025-01-05T16:30:00"),
    rawData: {
      name: "Sophia Martinez",
      email: "sophia.m@nonprofit.org",
      company: "Community Action Network",
      message: `We're a nonprofit managing volunteer programs across 5 cities. 
      Scheduling and communication is chaotic. 
      Executive Director here. Grant approved for tech upgrades - $15k available. 
      Need solution deployed before summer program starts (May). 
      Must be user-friendly for non-tech volunteers.`,
    },
  },
  {
    id: "16",
    source: "typeform",
    timestamp: new Date("2025-01-06T10:00:00"),
    rawData: {
      name: "Raj Patel",
      email: "raj@unknown.com",
      message: `What's your hourly rate?`,
    },
  },
  {
    id: "17",
    source: "whatsapp",
    timestamp: new Date("2025-01-06T12:15:00"),
    rawData: {
      name: "Ngozi Eze",
      phone: "+234 807 333 4444",
      company: "Eze Real Estate",
      message: `We manage 100+ properties. Tenant complaints, maintenance requests all over the place. 
      I'm the Managing Partner. Need proper system. 
      Saw property management software costs ₦500k-₦2M. 
      Can you build custom for less? Need it in 3 months for audit.`,
    },
  },
  {
    id: "18",
    source: "email",
    timestamp: new Date("2025-01-06T15:30:00"),
    rawData: {
      name: "Linda Wu",
      email: "linda.wu@logistics.sg",
      company: "Pacific Logistics Hub",
      message: `Expanding our warehouse operations to West Africa. 
      Need inventory + shipment tracking integrated with customs systems. 
      I'm the Regional Operations Lead. Corporate has allocated $120k for tech setup. 
      Must go live before Q3. Experience with cross-border compliance required.`,
    },
  },
  {
    id: "19",
    source: "linkedin",
    timestamp: new Date("2025-01-06T17:00:00"),
    rawData: {
      name: "Student Name",
      email: "student@university.edu",
      message: `Hi! I'm a computer science student doing a project on AI automation. 
      Can I interview you for my thesis? Just need 30 minutes of your time.`,
    },
  },
  {
    id: "20",
    source: "email",
    timestamp: new Date("2025-01-07T09:00:00"),
    rawData: {
      name: "Marcus Johnson",
      email: "m.johnson@insurance.ca",
      company: "Johnson & Partners Insurance",
      message: `Claims processing is killing us. 10-15 days average, customers furious. 
      CFO here. Board approved $200k for automation POC. 
      Need 50% faster processing by Q4 or we lose major clients. 
      Integrations needed: our policy database + external verification APIs. 
      Can we start with a scoping call next week?`,
    },
  },
];
