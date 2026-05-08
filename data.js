// ============================================================
// data.js — Leadership Challenge
// HLE / Alaya 2026
// ============================================================

// ── SIGNAL MAXES ─────────────────────────────────────────────
var MAX = { T:28, P:32, E:25, A:27 };

// ── DIMENSIONS ───────────────────────────────────────────────
var DIMS = ["T","P","E","A"];
var DIM_ICONS  = { T:"🛡️", P:"👁️", E:"🎯", A:"🔄" };
var DIM_LABELS = { T:"Trust", P:"Proactivity", E:"Empowerment", A:"Adaptability" };
var DIM_KEY_SCENARIOS = { T:[0,3], P:[7,10], E:[2,4], A:[5,8] };

// ── COLOURS ──────────────────────────────────────────────────
var COLORS = ["#f5a623","#60a5fa","#10b981","#f472b6","#a78bfa","#fb923c","#34d399","#e879f9"];

// ── SCENARIOS ────────────────────────────────────────────────
var SCENARIOS = [
  {
    title: "The Company Strategy Pivot",
    situation: "Management just sent an email saying the team is shifting priorities. No explanation, no context — just “we’re shifting gears.” Your team has been heads-down on a project for three weeks. They have no idea this is coming. You’re about to walk into the office.",
    choices: [
      { letter:"A", text:"Pull the team together now. Tell them what you know — even if it’s not much — and work through it with them.",
        outcome:"Your team was frustrated with the announcement — but not with you. They felt heard at a moment when most leaders go quiet. Trust is not built when everything is fine — it is built when the information is incomplete and you show up anyway.",
        scores:{ T:3, P:1, A:1 } },
      { letter:"B", text:"Sit on it for now. Pull one or two trusted people in quietly, get a clearer picture, then speak to the full team.",
        outcome:"Your plan was solid. But by then the team had already heard fragments through the rumour mill and wondered why their leader had gone quiet. A small but real trust gap opened — not because your intent was wrong, but because silence in uncertainty reads as exclusion even when it is care.",
        scores:{ T:1, P:1, E:1, A:2 } },
      { letter:"C", text:"Go up to your manager first. Get the full story before you say a word to your team.",
        outcome:"You brought back better information. But your team found out through informal channels before they heard from you, and that sequence matters. The order in which people receive news tells them something about their position in your thinking.",
        scores:{ T:0, A:1 } }
    ],
    discussPrompt: "When you made your choice — were you thinking about what the team needed to hear, or what you needed to know before you spoke?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Mirror",
    situation: "Your manager pulls you aside after a meeting. They tell you — kindly, but clearly — that some people on your team find it hard to bring problems to you. That you can come across as dismissive when things go wrong. You had no idea. You’re caught off guard.",
    choices: [
      { letter:"A", text:"Ask your manager who said it. Then go directly to those people this week to hear their side.",
        outcome:"You moved immediately and directly — the right instinct. But going to find out who said it can feel like an investigation rather than a reflection. The directness of your response may reinforce rather than disprove the original observation.",
        scores:{ T:0, P:2, A:1 } },
      { letter:"B", text:"Take it seriously. Go back to your team this week — not to explain yourself, but to genuinely ask what you could do better.",
        outcome:"This was the harder move and you made it. Going back to your team to genuinely ask what you could do differently requires vulnerability that most leaders avoid. What it produced was disproportionate to the effort — your team felt heard, respected, and the feedback became the beginning of a conversation rather than a verdict.",
        scores:{ T:2, P:2, A:2 } },
      { letter:"C", text:"Acknowledge it professionally. You’re not sure it’s fully accurate, but you’ll be more mindful going forward.",
        outcome:"You acknowledged without dismissing — better than defensiveness. But acknowledgement without visible action is hard for a team to distinguish from polite dismissal. If your behaviour shifts, it mattered. If it does not, the acknowledgement was a management move rather than a leadership one.",
        scores:{ T:0, A:1 } }
    ],
    discussPrompt: "When you received feedback about how you come across — what was your first instinct: to understand it, or to test whether it was accurate?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Handover",
    situation: "You’re handing over a core process you’ve spent 18 months building to a new team lead. You know every lender policy, every workaround, which applications bounce back and why. They’re smart — but they’re completely new to this.",
    choices: [
      { letter:"A", text:"Build them a thorough document — every step, every exception, every common mistake. Then walk them through it together.",
        outcome:"The document was detailed and your care was evident. But when real problems arrived — judgment calls that required context your words could not carry — they came back to you. The dependency stayed intact. What looked like a handover was a task transfer: you moved the work but not the ownership.",
        scores:{ T:1, P:1 } },
      { letter:"B", text:"Start with the why before the how. Let them ask questions, own the messy parts, and figure some of it out themselves.",
        outcome:"Messier at first. But within a month they were solving problems you had not anticipated — in ways you would not have thought of yourself. The real handover happened. This is what separates leaders who develop people from leaders who manage them.",
        scores:{ T:2, P:1, E:3 } },
      { letter:"C", text:"Give them a list of the top ten mistakes to avoid. Then completely step back and let them run.",
        outcome:"Bold. The ownership transferred because you made it total rather than gradual. Some of your warnings turned out to be context-specific and they learned to tell the difference themselves.",
        scores:{ P:1, E:2, A:2 } }
    ],
    discussPrompt: "If the person you handed to made the process better than you had — how would that feel?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Change You Did Not Choose",
    situation: "A change is rolling out company-wide. Your team didn’t ask for it and isn’t happy about it. Honestly — you have your own doubts too, but you haven’t told anyone.",
    choices: [
      { letter:"A", text:"Get behind it fully. Bring it to your team with confidence and keep your reservations to yourself.",
        outcome:"Your team sensed the gap between what you said and how you said it. Authenticity is read through energy and pace as much as through words. The change landed around your team rather than with them.",
        scores:{ A:1 } },
      { letter:"B", text:"Be honest with your team — tell them you have questions too, but that you’re going to work through it together. Let them have input on how it rolls out.",
        outcome:"Your transparency about your own questions made your team feel less alone in theirs — and that shared uncertainty became the foundation for genuine collaboration rather than managed compliance.",
        scores:{ T:2, P:1, E:1, A:2 } },
      { letter:"C", text:"Champion it fully to your team. Take your questions to your manager privately.",
        outcome:"Your team got behind it and your concerns stayed professional. You built credibility upward while maintaining stability downward. The gap: your team never got to see how you hold private disagreement with a decision while still leading its implementation.",
        scores:{ T:1, P:1, A:2 } }
    ],
    discussPrompt: "Is there a version of presenting a united front that is honest — or does performing confidence you do not feel always cost something?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "Monday Morning",
    situation: "It’s 8:45am Monday. You’ve got three things staring at you: a team member needs an urgent HR conversation, a client loan hitting its settlement deadline needs your sign-off, and your manager wants a project update in 90 minutes. You can’t do all three.",
    choices: [
      { letter:"A", text:"Handle the client sign-off first — it’ll be quick, and then you can give the HR conversation the attention it deserves.",
        outcome:"The client issue resolved quickly. But the HR conversation was pushed to the afternoon. The team member had been carrying something since Friday. When the pattern repeats, your team begins to understand that clients rank above them in your triage hierarchy.",
        scores:{} },
      { letter:"B", text:"Delegate the client sign-off to someone capable on your team. Deal with HR first, then prep the update.",
        outcome:"The team member got your full attention when they needed it. The person you delegated to handled the client sign-off well and grew from the responsibility under pressure. This is what triage leadership looks like: identifying what requires you specifically and what is a development opportunity.",
        scores:{ T:2, P:1, E:3, A:1 } },
      { letter:"C", text:"Message your manager asking for 30 more minutes. Handle HR first, then delegate the client sign-off.",
        outcome:"Your manager respected the transparency. The HR matter got proper attention. The delegation worked. Managing upward proactively — asking for more time before you miss a deadline — earns credibility upward rather than burning it.",
        scores:{ T:2, P:2, E:2, A:1 } }
    ],
    discussPrompt: "If your manager had been watching every choice you made this morning — would you have triaged in the same order?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The 70% Decision",
    situation: "For three weeks you’ve been watching your team’s loan applications come back from lenders with declines more often than they should. You don’t have hard data but your gut is pretty sure what the problem is — and what to do about it. Your manager wants your recommendation in tomorrow’s meeting.",
    choices: [
      { letter:"A", text:"Present it as a working hypothesis. Tell your manager you don’t have data yet, but here’s your reasoning and you’re ready to test it immediately.",
        outcome:"You were honest about what you knew and what you did not — which earned credibility before the recommendation was tested. Framing your instinct as a hypothesis gave your manager something to engage with rather than just approve.",
        scores:{ T:1, P:2, A:1 } },
      { letter:"B", text:"Back yourself. Make the recommendation clearly, put your name on it, and accept that if you’re wrong you’ll adjust.",
        outcome:"You committed. You presented a clear recommendation, put your name on it, and accepted that if you were wrong you would adjust. That is decision velocity — acting at 70% conviction rather than waiting for 95%.",
        scores:{ P:2, A:3 } },
      { letter:"C", text:"Ask for another week. You want to come with real data, not just a hunch.",
        outcome:"You bought another week of certainty and your organisation got another week of a problem you already had enough information to address. Three weeks of watching a pattern is typically enough.",
        scores:{ A:1 } }
    ],
    discussPrompt: "When you’re 70% sure — is the other 30% genuinely missing information, or is it permission you’re waiting for someone else to give you?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Walkout Risk",
    situation: "Your best person just told you they’ve been offered another job — 20% more than they’re on now. They’re not threatening to leave. They’re telling you because they respect you. You have no power over pay. You’ve got ten minutes before your next meeting.",
    choices: [
      { letter:"A", text:"Be straight with them — you can’t match the money and you won’t pretend you can. Then ask what would actually make them want to stay.",
        outcome:"You were direct about the constraint — which was right. Moving immediately to find out what would actually make staying worthwhile is the most proactive response available.",
        scores:{ T:1, P:2 } },
      { letter:"B", text:"Ask for 48 hours. Tell them you’re going to fight for them internally — even though you don’t know what’s on the table yet.",
        outcome:"You bought time with a credible commitment rather than a stall. Whether you retained them depends on what was available. What you controlled — and got right — was demonstrating that you fight for your people within your constraints.",
        scores:{ T:2, P:2, A:1 } },
      { letter:"C", text:"Thank them. Tell them the offer sounds great and you’ll support whatever they decide.",
        outcome:"Gracious, respectful, and a quiet give-up dressed in the language of care. Telling someone you support whatever they decide when you have not tried to find out whether anything could change communicates — below the surface — that you do not believe anything can change.",
        scores:{ T:1 } }
    ],
    discussPrompt: "When you made your choice — were you trying to keep them, or trying to make sure you could live with however it ended?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Difficult Conversation",
    situation: "Someone on your team has missed three deadlines in a row. Others have noticed and they’re quietly frustrated. You’ve been finding reasons to delay the conversation — they’ve had a rough few months and you genuinely like them. This week, another team member comes to you directly and says it’s starting to affect their own work.",
    choices: [
      { letter:"A", text:"Don’t wait for a 1:1. Bring it up the next time you see them. Be specific about what you’ve observed and what needs to change.",
        outcome:"You moved fast and were specific — both of which matter enormously in a performance conversation. Specific feedback tied to observable behaviour is much harder to argue with and much easier to act on.",
        scores:{ T:0, P:3, A:1 } },
      { letter:"B", text:"Bring it up gently in your next 1:1. Frame it more as a check-in on how they’re doing than a performance conversation.",
        outcome:"Your care was evident and genuine. But reframing a performance conversation as a welfare check-in delays the feedback they most need. The hardest truth: the kindest thing you can do for someone who is underperforming is to tell them clearly, specifically, and early.",
        scores:{ T:1, E:1 } },
      { letter:"C", text:"Start by asking what they need to get back on track — let them lead — then share what you’ve been observing.",
        outcome:"Opening with what the person needs rather than what you need from them is a genuine reversal of the typical performance dynamic. The gap: asking what they need is the right opening, but the conversation still needs the clear specific feedback.",
        scores:{ T:1, E:2, A:1 } }
    ],
    discussPrompt: "At what point does giving someone time and space become protection for you rather than care for them?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Approval Loop",
    situation: "Your team has been blocked for six days waiting on a loan structuring decision. The broker who needs to sign off is travelling and completely unreachable. Technically the call sits with them — but it’s straightforward, the delay is visibly hurting team morale, and you know exactly what the right answer is.",
    choices: [
      { letter:"A", text:"Make the call yourself. Document your reasoning clearly, send the broker and your manager a short note explaining what you decided and why, and own whatever happens next.",
        outcome:"You acted. Six days of blocked progress ended in one decision. You documented and communicated — which distinguishes responsible autonomous action from reckless overreach.",
        scores:{ T:1, P:1, A:3 } },
      { letter:"B", text:"Send your manager a concise note — here’s the situation, here’s what you recommend, and you’ll move on this by end of tomorrow if you don’t hear back.",
        outcome:"You created a forcing function rather than an open-ended request. That specificity is what made this effective: you respected your manager’s authority while refusing to let the situation drift indefinitely.",
        scores:{ T:1, P:2, A:1 } },
      { letter:"C", text:"Brief one of your senior brokers on the full context and give them the authority to make the call.",
        outcome:"Six days of waiting ended with someone on your team making the call — someone who needed exactly this kind of responsibility. The decision was made, the team moved, and a team member grew from real authority in a real situation.",
        scores:{ P:1, E:3 } }
    ],
    discussPrompt: "If your manager came back and said you made the wrong call — would you defend the decision, or apologise for making it?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Rebuild",
    situation: "Two people on your team resigned in the same week. You’ve still got four people left — all of them stretched and not in great shape. There’s a major deadline in three weeks. The resignations weren’t completely surprising. It’s been a hard few months. But the timing is brutal.",
    choices: [
      { letter:"A", text:"Get everyone together today. Be honest that this is hard. Ask them what they need. Rebuild the workload plan with them in the room.",
        outcome:"You acknowledged what was real rather than managing the team’s perception of it. Involving your team in figuring out how to move through it converted a destabilising event into an act of collective leadership.",
        scores:{ T:2, P:1, E:2, A:1 } },
      { letter:"B", text:"Triage immediately. Strip everything non-critical. Give the team one clear path to the finish line. Deal with everything else after.",
        outcome:"You made hard fast decisions and gave your team clarity when clarity was what they needed most. When morale is low and workload is heavy, a clear path to a finish line is often more restorative than a conversation about feelings.",
        scores:{ P:2, E:3, A:1 } },
      { letter:"C", text:"Go to your manager first. Push for a deadline extension or extra resources before you commit to anything with your team.",
        outcome:"You were right not to make promises before you knew what was available. The gap is in the sequence: your team is in crisis and going upward first means they are waiting without a signal from you.",
        scores:{ T:1, P:2, A:2 } }
    ],
    discussPrompt: "When two people resign in the same week — is your first responsibility to the deliverable, to the people who stayed, or to understanding why they left?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Feedback You Did Not Give",
    situation: "Three weeks ago, a team member cut off a client on a call and dismissed their concern about their loan application — in a way that was clearly noticed by everyone in the room. You didn’t say anything at the time. Life moved on. They have a client call tomorrow. It’s still sitting with you.",
    choices: [
      { letter:"A", text:"Bring it up today. Yes, it’s three weeks late. Be specific about what happened and why it matters before tomorrow’s call.",
        outcome:"You broke the delay. Three weeks late is not ideal — but late specific feedback is worth more than timely vague feedback. Feedback has a half-life but it does not expire.",
        scores:{ T:0, P:3, E:1 } },
      { letter:"B", text:"Let that specific incident go. Watch tomorrow’s call closely and give feedback straight after if anything comes up.",
        outcome:"You avoided an ambush — which was considerate. But in doing so you gave up the most directly relevant piece of feedback available before the call.",
        scores:{ T:0, A:1 } },
      { letter:"C", text:"Have a broader conversation about client communication today — without bringing up the specific incident.",
        outcome:"You found a way to give them something useful without the awkwardness of the specific timing. The gap is in what they did not get: the grounded specific example that makes abstract principles concrete and actionable.",
        scores:{ T:1, P:1, E:2, A:1 } }
    ],
    discussPrompt: "When you delayed the feedback — were you protecting them from an awkward conversation, or protecting yourself from having to initiate one?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Credit Question",
    situation: "Your team just delivered a great result on a high-profile project. In the debrief with senior leadership, your manager attributes most of the success to decisions made above your team level. Your team is in the room. They notice. Afterwards, two of them come to you separately.",
    choices: [
      { letter:"A", text:"Say something before the meeting ends. Name your team’s specific contributions clearly — even if it means gently correcting what was said.",
        outcome:"You made the move most leaders calculate and then decide against. What it produced for your team was immediate and unambiguous: they saw their leader go to bat for them, publicly, in the room, when it mattered most.",
        scores:{ T:1, P:2, A:1 } },
      { letter:"B", text:"Let the meeting finish. Then go straight to your manager and tell them what you noticed and why it matters.",
        outcome:"You chose the moment when you had your manager alone — without social pressure — to have the most important part of the conversation. Following up with your team directly about their contributions closes the gap.",
        scores:{ T:2, P:2, E:1 } },
      { letter:"C", text:"Don’t escalate it. Make sure every single team member hears directly from you how you saw their contribution.",
        outcome:"Your team heard directly from you that their contribution was real and that you saw it. The gap: your manager’s narrative did not change, and in the next high-visibility moment the same pattern may repeat.",
        scores:{ T:1, E:1, A:1 } }
    ],
    discussPrompt: "What would need to be true about your relationship with your manager for you to have made a different choice in that room?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Rookie Who Can’t Seem to Get It Right",
    situation: "You’ve been mentoring a new loan analyst for two months. She’s eager, asks good questions, and genuinely wants to do well. But she keeps making the same kind of error — missing fields in client loan files, submitting incomplete applications that bounce back from the lender. You’ve mentioned it twice in passing. It just happened again, this time holding up a client’s approval by three days. The client called to complain. You were the one who apologised.",
    choices: [
      { letter:"A", text:"Sit down with her properly this week — not in passing. Walk through the specific errors, show her the pattern you’ve been seeing, and set a clear standard for what “done” looks like before anything gets submitted.",
        outcome:"You sat down properly and named the pattern — not in passing, but as a specific recurring problem with a clear standard attached. That shift from casual mention to structured conversation is what the situation required. The gap: setting a standard for someone to meet is different from building a habit. Asking her to walk you through her own checklist before she submits moves the check from you to her.",
        scores:{ T:2, P:3, E:1 } },
      { letter:"B", text:"Assign her to shadow a senior loan analyst for two weeks so she can see the quality standard in practice before she works independently again.",
        outcome:"You gave her a better environment to learn from — a genuine development instinct. The gap is in what you stepped around: the direct conversation about the pattern you have been watching. She now has exposure to a higher quality standard. She does not know you have seen a recurring problem, what that pattern looks like, or where the line is. Shadowing develops skill. It does not replace the feedback.",
        scores:{ T:1, P:1, E:3 } },
      { letter:"C", text:"Give her a written summary of the errors and what needs to improve so she has a reference she can check herself before submitting future files.",
        outcome:"A written reference is more useful than another passing mention. The gap is in what the medium cannot carry: how seriously this landed with the client, what the consequences were, and what happens if the pattern continues. She now has a checklist. She does not have your read on how significant this has become.",
        scores:{ P:2, A:2 } }
    ],
    discussPrompt: "At what point does covering for someone stop being kindness and start being the reason they never improve?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Manager Who Goes Sharp Under Pressure",
    situation: "A manager on your team runs one of the more technically capable pods. Their team delivers accurate work and rarely misses deadlines. But a pattern has been building. When things go wrong — a file is rejected, a process is missed — this manager reacts sharply. Last week a team member made an error and the manager responded in the team meeting: “How many times does this need to be explained? This is basic.” They send short, cutting messages in the team chat that the whole pod can see. Two analysts from their team have separately found quiet moments to tell you they now avoid flagging problems to their manager because of how they react — which means issues are being hidden rather than surfaced.",
    choices: [
      { letter:"A", text:"Address it directly with the manager this week. Share specifically what you have observed and what you have heard from their team — without naming who came to you. Name it clearly: this behaviour is not acceptable here, regardless of how strong their team’s output appears.",
        outcome:"You named the behaviour directly and made clear this was not a style preference. That clarity is necessary when a pattern is established and a team is already adjusting their behaviour around it. The gap: opening with a direct call-out before the manager has had any chance to reflect can produce defensiveness rather than change. The information landed — whether it shifts the behaviour depends on whether they could hear it.",
        scores:{ T:2, P:3, A:1 } },
      { letter:"B", text:"Start with genuine curiosity. Ask the manager how they feel the team dynamic is going and whether they are aware of how they come across when things go wrong. Give them the chance to surface it themselves before you share what you know.",
        outcome:"You opened with genuine curiosity rather than a verdict — which is the harder choice when you are already holding specific information about someone’s team. Giving someone the chance to name a problem themselves produces more durable change than being told about it. The gap is in what you left unspoken: the specific observations you are already holding. If the manager is not self-aware enough to surface it themselves, you leave the conversation without naming what you know — and the people who came to you are still unprotected.",
        scores:{ T:3, P:1, E:1 } },
      { letter:"C", text:"Quietly adjust how their team escalates problems — route sensitive issues through you or another senior person for now — while you prepare for a more formal conversation later.",
        outcome:"Quietly rerouting issues is not a preparation for a harder conversation — it is the avoidance of one. The manager continues as before. The analysts who came to you are still working in the same environment. The longer you work around the behaviour rather than through it, the harder the eventual conversation becomes and the more credibility you lose with the people who chose to tell you.",
        scores:{ A:1 } }
    ],
    discussPrompt: "When someone’s results are strong but their behaviour is damaging — how long is it fair to wait before saying something?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  },
  {
    title: "The Two Accounts That Don’t Match",
    situation: "Two loan analysts on your team — both solid performers — came to you separately this week. One says the other took credit for a referral she sourced, which meant the wrong person received the commission. He says the referral came through his own network and her involvement was minimal. You were not in the room when it happened. Both are frustrated. Both are waiting for you to do something. The commission has already been paid out.",
    choices: [
      { letter:"A", text:"Bring both of them into the same room together. Tell them directly: you have two accounts that don’t match and you need to understand what actually happened. Ask them to walk through it in front of each other.",
        outcome:"Bringing both of them into the same room is direct and produces the most information fastest. The gap is in what the dynamic creates: two people defending their account to each other in front of you tends to produce entrenchment before it produces clarity. It works best when both parties are genuinely oriented toward resolution. When one or both feel accused, the room can close down faster than it opens up.",
        scores:{ T:2, P:2, A:1 } },
      { letter:"B", text:"Speak to each of them separately and thoroughly first — go through emails, call logs, referral records — before drawing any conclusion or saying anything definitive to either of them.",
        outcome:"You built the most complete picture before drawing any conclusions — the right instinct when two accounts are genuinely irreconcilable and a commission has already been paid. The gap: both people are waiting. The longer a thorough investigation runs without a signal from you, the more each of them fills the silence with their own conclusions about where you stand. Thoroughness and timeliness are both required here — and this situation needed both at the same time.",
        scores:{ T:1, P:3, A:1 } },
      { letter:"C", text:"Tell both of them honestly that the situation is too unclear to resolve fairly after the fact. Shift the conversation to how referrals get attributed going forward — put a clear, agreed process in place so this cannot happen again.",
        outcome:"You read the situation correctly: when evidence is incomplete and money has already moved, attempting retrospective justice often creates more damage than the original dispute. Moving to a clear forward process is the adaptive call. The gap is in what neither person received: an acknowledgement that their specific experience mattered, even if the outcome could not be fairly resolved. Without that, the process conversation can feel like it came at the cost of being heard.",
        scores:{ T:1, E:2, A:3 } }
    ],
    discussPrompt: "When you can’t find a clear answer — is moving forward without one a leadership decision or an avoidance of one?",
    splitPrompt: "What did the people who chose differently see in that situation that you did not?"
  }
];

// ── CASCADE HELPERS ───────────────────────────────────────────
function _topArr(s, mx) {
  return ["T","P","E","A"]
    .map(d => ({ d, p: pct(s[d]||0, mx[d]) }))
    .sort((a,b) => b.p - a.p);
}
function _avg4(s, mx) {
  return (pct(s.T||0,mx.T)+pct(s.P||0,mx.P)+pct(s.E||0,mx.E)+pct(s.A||0,mx.A))/4;
}
function _isDualSpike(s, mx) {
  const [d1,d2,d3,d4] = _topArr(s,mx);
  return (d1.p+d2.p)/2 - (d3.p+d4.p)/2 >= 25 && d1.p>=55 && d2.p>=55 && d4.p<=50;
}
function _isSingleSpike(s, mx) {
  const [d1,d2,d3,d4] = _topArr(s,mx);
  const avgOthers = (d2.p+d3.p+d4.p)/3;
  return d1.p>=56 && (d1.p-avgOthers)>=18 && avgOthers<=64;
}
function _isSteadyHand(s, mx) {
  const arr = _topArr(s,mx);
  const top3 = (arr[0].p+arr[1].p+arr[2].p)/3;
  return !_isDualSpike(s,mx) && !_isSingleSpike(s,mx) && !(top3>=68 && _avg4(s,mx)>=60) && _avg4(s,mx)>44;
}

// ── PROFILES ─────────────────────────────────────────────────
var PROFILES = [
  { id:"visionary", name:"The Visionary", emoji:"🌟",
    desc:"You have built something genuinely rare. Your team trusts you enough to tell you the hard things. You notice problems before they escalate. You develop people rather than depending on them. When conditions shift, you lead through the change rather than managing around it. The risk at this level: leaders who are strong everywhere sometimes stop growing anywhere.",
    actions:{ T:"Your team feels safe with you. The next level is using that safety to have the conversations that are genuinely difficult. Once a month, initiate a conversation with a team member about something you have been avoiding.", P:"In your next team meeting, name something you are watching — not a problem yet, just a signal — and ask your team what they see. You are teaching the habit by modelling it out loud.", E:"You develop people well. The next level is developing people who develop people. Identify one team member ready to start coaching others. Give them a specific person to develop and a specific outcome to aim for.", A:"When change lands, narrate your first 24 hours: here is what I know, here is what I do not know, and here is what I am doing about it." },
    match(s,mx){ mx=mx||MAX; const t=pct(s.T||0,mx.T),p=pct(s.P||0,mx.P),e=pct(s.E||0,mx.E),a=pct(s.A||0,mx.A); return t>=65&&p>=65&&e>=65&&a>=65; } },

  { id:"rising", name:"The Rising Leader", emoji:"🌱",
    desc:"You are close. Across most of what leadership demands — building trust, catching things early, developing others, moving through change — you are performing genuinely well. The gap between where you are and where the best leaders operate is smaller than it has ever been. One or two dimensions are still running slightly behind the others.",
    actions:{ T:"The growth edge is consistency under pressure. Before your next difficult week, make one commitment to your team: no matter what is happening, I will check in with each of you at least once. Then keep it.", P:"The gap is typically in acting before you are certain. This week, identify one thing that feels slightly off and act on it today. Act before you are sure.", E:"The stretch is delegating something that makes you genuinely uncomfortable to let go of. Hand it over with: the outcome is yours — come to me only if you hit a wall you cannot move.", A:"Next time something shifts unexpectedly, communicate to your team within two hours, even if all you can say is that you have heard this and are working on what it means." },
    match(s,mx){ mx=mx||MAX; const arr=_topArr(s,mx); const top3=(arr[0].p+arr[1].p+arr[2].p)/3; return top3>=68&&_avg4(s,mx)>=60&&arr[3].p>=40&&!_isDualSpike(s,mx)&&!_isSingleSpike(s,mx); } },

  { id:"firefighter", name:"The Firefighter", emoji:"🔥",
    desc:"You are in reactive mode — not because you are a poor leader, but because conditions have created a pattern of responding rather than leading. Something is always on fire. By the time you notice a problem it has already grown. Do not try to fix all four dimensions at once. Pick one signal. Build one habit. Give it 60 days before you touch anything else.",
    actions:{ T:"Every Monday morning, send each team member a single message: how are you doing this week — anything I should know about? The act of asking, consistently, is what builds the safety. Start this Monday.", P:"Block 15 minutes every Monday before anything else. One question only: what could go wrong this week that I could prevent right now? Act on the first answer before 10am.", E:"Identify one task you have been carrying for more than a week that someone else could own. Today, hand it to someone with: this is yours now. Here is the outcome I need. Come to me if you hit something you cannot solve.", A:"When change lands, give your team 60 seconds of honest thinking: here is what just happened, here is what I think it means for us, and here is what we are doing today." },
    match(s,mx){ mx=mx||MAX; return _avg4(s,mx)<=44; } },

  { id:"protector", name:"The Protector", emoji:"🛡️",
    desc:"Your team trusts you — because of how you show up, not because of a title. You are consistent when the environment is not. You show up for people before they have to ask. The gap is that your reliability has quietly created a dependency. When everything flows through you, your presence becomes load-bearing. That is not a trust problem — it is an empowerment problem, and it is the next frontier.",
    actions:{ T:"The growth edge is using that trust to have the harder conversations. This week, tell one team member directly: I think you are operating below what you are capable of. I want to talk about what is holding that back.", P:"The next time something feels slightly wrong, act on it the same day before it becomes a confirmed problem. Early and light beats late and heavy every time.", E:"The next time someone brings you a problem, before you respond with a solution, ask them: what do you think you should do? Wait for the full answer. Then ask: what would you need to actually do that?", A:"Within two hours of receiving news, send your team a message — even if it only says that you have heard this and are getting clarity and will talk this afternoon." },
    match(s,mx){ mx=mx||MAX; return _topArr(s,mx)[0].d==="T" && _isSingleSpike(s,mx) && !(_topArr(s,mx)[1].d==="A" && (pct(s.A||0,mx.A)-pct(s.P||0,mx.P))>=15); } },

  { id:"cornerstone", name:"The Cornerstone", emoji:"🧱",
    desc:"Your team trusts you — and they rely on you especially when things are uncertain. When change lands, when the plan falls apart — people look at you. And you hold steady. That combination of relational trust and situational steadiness is what makes you the person the team orients around when everything else is moving. The gap: because you hold things together so reliably, the team has not had to develop the same steadiness themselves.",
    actions:{ T:"The next time you navigate something uncertain, narrate your thinking out loud to at least one team member: here is what I am feeling, here is how I am thinking about it, here is what I am doing. Your calm is a skill they can learn.", P:"Once a week, ask yourself: what is building up in my team right now that has not surfaced yet? Then act on the first thing that comes to mind while it is still small enough for a conversation to resolve it.", E:"Choose one area where you are currently the point of stability and ask: who on my team could own this? Then explicitly transfer that ownership: when things get uncertain in this area, I want you to be the one who holds it steady — not me.", A:"The next time a change requires you to shift your approach, make the shift visible: I was planning to do X — because of this change I am now doing Y, and here is why." },
    match(s,mx){ mx=mx||MAX; const arr=_topArr(s,mx); const isTA=[arr[0].d,arr[1].d].sort().join("")==="AT"; return (isTA&&_isDualSpike(s,mx))||(arr[0].d==="T"&&arr[1].d==="A"&&_isSingleSpike(s,mx)&&(pct(s.A||0,mx.A)-pct(s.P||0,mx.P))>=15); } },

  { id:"lookout", name:"The Lookout", emoji:"👁️",
    desc:"You see things before other people do. You notice when someone goes quiet, when a process is quietly failing, when a decision is being delayed for the wrong reasons. The gap is in what happens after you notice. You tend to move fast — sometimes faster than your team’s trust in your intentions can carry. When you act on something before others have seen it, your action can feel like surveillance rather than care.",
    actions:{ T:"The next time you notice something about a team member, before you act on it, name it to them and explain why: I have noticed you seem quieter this week. I am asking because I pay attention to my team and I want to make sure you are okay — not because there is a performance concern.", P:"This is your signature strength. The growth edge is making it a team capability. In your next team meeting, name something early that you are watching and ask: does anyone else see this?", E:"When you spot a problem, bring the person closest to it into the diagnosis: I have been watching this and something feels off — what are you seeing?", A:"The next time you change course, slow down the communication by one step: before you announce the new direction, spend 60 seconds explaining what changed and why." },
    match(s,mx){ mx=mx||MAX; return _topArr(s,mx)[0].d==="P" && _isSingleSpike(s,mx); } },

  { id:"catalyst", name:"The Catalyst", emoji:"⚡",
    desc:"You see problems coming and your team trusts you enough to come to you before those problems escalate. That combination — early warning instinct and genuine relational safety — makes you one of the most valuable leaders a team can have. Things do not fester on your watch. The gap is in what happens with what you see and hear. You tend to carry the response yourself. Over time this creates a subtle dependency.",
    actions:{ T:"The growth edge is using that trust to deliver harder messages. The next time you have feedback that would genuinely help someone but feels risky to give, give it. Your trust account is high enough to absorb the discomfort.", P:"The next time you act on something early, tell your team what you saw and why you moved: I noticed X three days ago and it told me Y was coming — so here is what I did.", E:"The next time someone brings you a problem you could solve in five minutes, do not solve it. Instead say: what do you think the right move is? Wait. Then: what would you need to make that happen?", A:"Your growth edge is being honest about uncertainty without transmitting anxiety. Try: I do not have the full picture yet — but here is what I know, here is what I am doing, and here is what you should focus on in the meantime." },
    match(s,mx){ mx=mx||MAX; const arr=_topArr(s,mx); return [arr[0].d,arr[1].d].sort().join("")==="PT"&&_isDualSpike(s,mx); } },

  { id:"builder", name:"The Builder", emoji:"🎯",
    desc:"You grow people. You know how to hand things over in a way that genuinely develops capability — not just transfers a task. You know the difference between delegating the what and delegating the why. The people who have worked with you are more capable than when they arrived. The gap is in the relationship infrastructure around that development — who is struggling emotionally, who is quietly disengaged.",
    actions:{ T:"Once a week, have a five-minute conversation with a team member that has nothing to do with work or development. Just genuine curiosity about them as a person.", P:"Start scanning for a different signal: who seems less energised than usual? Who has gone quieter? Act on one this week — not with a development conversation, but with a genuine check-in.", E:"This is your signature strength. Identify one team lead and explicitly coach them on how you hand things over. Walk them through a real handover in real time: watch what I do here and then we will debrief.", A:"When things change, communicate the why before you restructure. Next time you restructure in response to change, spend five minutes with the team explaining the shift before you announce the new plan." },
    match(s,mx){ mx=mx||MAX; return _topArr(s,mx)[0].d==="E" && _isSingleSpike(s,mx); } },

  { id:"compass", name:"The Compass", emoji:"🧭",
    desc:"You move through change better than almost anyone in the room. When things shift you pivot cleanly. You do not get destabilised by uncertainty. You make decisions with incomplete information, adjust as new information arrives, and keep moving. The gap is that your fluidity with change can outpace your team’s ability to follow.",
    actions:{ T:"Create the second kind of trust by actively inviting pushback: before we move — what am I missing? What would you do differently? When someone pushes back well, thank them specifically for it.", P:"Once a week, ask yourself: what is likely to shift in the next 30 days that I am not yet preparing for?", E:"The next time a change requires a pivot, walk your team through how you are thinking about it: here is what changed, here is how I assessed the options, here is why I chose this direction.", A:"This is your signature strength. When you hand something to a team member during or after a change, spend five minutes checking they have genuinely landed in the new reality." },
    match(s,mx){ mx=mx||MAX; return _topArr(s,mx)[0].d==="A" && _isSingleSpike(s,mx); } },

  { id:"enabler", name:"The Enabler", emoji:"🔑",
    desc:"You build deep relationships and you genuinely develop the people around you. Your team trusts you and they grow because of you. You know how to hand things over with the why intact. The gap is in peripheral awareness: the team member who is struggling but has not come to you, the process that is quietly breaking down.",
    actions:{ T:"Make a list of the people you have had the fewest meaningful conversations with in the last month. Reach out to one of them this week. The goal: every person on your team feels equally known.", P:"Once a week, scan your team from the outside: who seems different this week? Act on one observation before it becomes something you are asked about.", E:"The next time you have a successful handover, debrief it with the person: what did I do in that process that made it possible for you to own this?", A:"When change lands, ask: what does this change require of my team, and how do I develop them for that? Frame every change as a development opportunity first." },
    match(s,mx){ mx=mx||MAX; return [_topArr(s,mx)[0].d,_topArr(s,mx)[1].d].sort().join("")==="ET"&&_isDualSpike(s,mx); } },

  { id:"driver", name:"The Driver", emoji:"🚀",
    desc:"You catch things early and you build people’s capacity to handle what you catch. You are not the bottleneck — you actively move problems to the people best placed to own them. The gap is in the relational foundation underneath all that energy and capability. Your team experiences your investment in their capability more than your investment in them as people.",
    actions:{ T:"Once a week, have one conversation that is entirely about how someone is doing, not what they are working on. No coaching. No feedback. Just: how are you — really?", P:"When you act on an early signal, tell your team what you saw and why you moved. You are showing them that acting before certainty is a legitimate and valuable leadership behaviour.", E:"This is a genuine strength. Before you explain what you need in a handover, ask: what do you already know about this area? Build the handover around the gaps in their knowledge.", A:"When change lands, before you move, take 60 seconds to acknowledge the change out loud: this is a significant shift — here is how I am thinking about it." },
    match(s,mx){ mx=mx||MAX; return [_topArr(s,mx)[0].d,_topArr(s,mx)[1].d].sort().join("")==="EP"&&_isDualSpike(s,mx); } },

  { id:"pathfinder", name:"The Pathfinder", emoji:"🌊",
    desc:"You read situations faster than almost anyone and you pivot cleanly when they change. Your early-warning instinct combines with genuine adaptability to make you one of the most situationally effective leaders in the room. The gap is in the depth of the relationships and development that sit underneath all that movement.",
    actions:{ T:"The next time you make a significant decision, tell one or two team members your thinking and explicitly ask: what am I missing? When someone pushes back well, acknowledge it publicly.", P:"In your next team meeting, share one early signal you are watching and ask: what is everyone else seeing?", E:"Before you hand something over, slow down by one step: I am giving you this because I believe you are ready for it. Here is the outcome I need and here is why it matters. Tell me how you are thinking about it.", A:"This is your signature strength. The next time you pivot, narrate it: here is what changed, here is how I assessed it, here is why I moved this way rather than another." },
    match(s,mx){ mx=mx||MAX; return [_topArr(s,mx)[0].d,_topArr(s,mx)[1].d].sort().join("")==="AP"&&_isDualSpike(s,mx); } },

  { id:"architect", name:"The Architect", emoji:"🏛️",
    desc:"You build capability and you move with change. You know how to develop people and you know how to pivot when the environment shifts. Those two qualities together mean your team is both more capable and more resilient than most. The gap is in the early-warning and relational layers that make those capabilities feel safe rather than efficient.",
    actions:{ T:"Once a week: before a 1:1, the first five minutes are only about how the person is doing as a human, not about any work topic.", P:"Once a week, scan your team for personal rather than systemic signals: who seems different this week? Act on one observation before it becomes something you are asked to deal with.", E:"Identify one team lead who is ready for this. Walk them through a real handover — let them watch you do it, then debrief: what did I do in that process and why?", A:"When change requires a pivot, add one step: before you announce the restructure, acknowledge the human dimension — I know this is a significant shift and it will feel disruptive for a while." },
    match(s,mx){ mx=mx||MAX; return [_topArr(s,mx)[0].d,_topArr(s,mx)[1].d].sort().join("")==="AE"&&_isDualSpike(s,mx); } },

  { id:"steady-T", name:"The Steady Hand", emoji:"🤝",
    desc:"You are consistent, reliable, and thoughtful — and Trust is your strongest instinct. When things are uncertain, your team finds someone steady when they look to you. The work now is going deeper on Trust — turning a natural instinct into a deliberate, developed strength.",
    actions:{ T:"Try one bold trust-building move this week: be genuinely vulnerable about something you are finding difficult. Not a polished admission — a real one.", P:"This week, act on the first thing that feels slightly off — without waiting for confirmation. Acting early and being slightly wrong occasionally is better than acting late and being right.", E:"The growth edge is handing over something that genuinely makes you uncomfortable to let go of. The discomfort you feel is the signal that the development is real.", A:"Next time something shifts, narrate your thinking out loud to at least one team member before you have it fully worked out." },
    match(s,mx){ mx=mx||MAX; return _topArr(s,mx)[0].d==="T" && _isSteadyHand(s,mx); } },

  { id:"steady-P", name:"The Steady Hand", emoji:"🤝",
    desc:"You are consistent and thoughtful — and your sharpest instinct is noticing things early. That awareness is a genuine asset. It has not yet become a dominant signal — the habit is there, but not yet fully built into how you lead.",
    actions:{ T:"The next time you notice something about a team member, name it to them directly: I noticed you seem different this week. Is everything okay?", P:"This is your strongest instinct — develop it into a habit. Block 15 minutes every Monday: what could go wrong this week that I could prevent right now? Act on the first answer before 10am.", E:"The next time you notice something, bring the relevant team member into the observation: I have been watching this and something feels off — what are you seeing?", A:"Next time change lands, be the first voice: here is what I think this means for us and here is what I think we should do this week." },
    match(s,mx){ mx=mx||MAX; return _topArr(s,mx)[0].d==="P" && _isSteadyHand(s,mx); } },

  { id:"steady-E", name:"The Steady Hand", emoji:"🤝",
    desc:"You are consistent and thoughtful — and your natural instinct leans toward developing the people around you. That instinct is the foundation of genuine empowerment — it just has not yet been built into a strong consistent signal.",
    actions:{ T:"Once a week, have one conversation with a team member that has nothing to do with their development or their work — just check in on them as a person.", P:"Once a week, scan your team for personal signals rather than performance signals: who seems different? Who is quieter than usual?", E:"This is your strongest instinct — build it into a consistent method. The next five times you hand something over: explain the why before the what, ask what they would do first, then step back completely.", A:"The next time something shifts, your first communication to your team should include: what new capabilities will this require of each of you?" },
    match(s,mx){ mx=mx||MAX; return _topArr(s,mx)[0].d==="E" && _isSteadyHand(s,mx); } },

  { id:"steady-A", name:"The Steady Hand", emoji:"🤝",
    desc:"You are consistent and thoughtful — and when things change, you tend to handle it better than most. You do not get destabilised by uncertainty. The work is building the other signals to match your adaptability.",
    actions:{ T:"Once a week, do something that signals reliability — follow up on something you committed to, keep a promise that would have been easy to let slide.", P:"Once a week ask yourself: what is likely to shift in the next 30 days? Then take one action today that gets ahead of it.", E:"The next time you restructure, involve the team in the design: given what has changed, how do you think we should redistribute this work?", A:"This is your strongest instinct — make it deliberate and visible. The next time you adapt successfully, debrief it explicitly: here is what changed, here is how I assessed the options, here is why I chose this direction." },
    match(s,mx){ mx=mx||MAX; return _topArr(s,mx)[0].d==="A" && _isSteadyHand(s,mx); } }
];

// ── GROWTH INSIGHTS ───────────────────────────────────────────
// Named DIM_INSIGHTS to match existing script.js
// Format: DIM_INSIGHTS[dimension][scenario_index][choice_index]
var DIM_INSIGHTS = {
  T: {
    0: [
      { insight:"Even though you called your team together immediately, Trust is still showing as a growth area. The instinct to show up in uncertainty is there — but it may not yet be consistent across all the situations that require it. Trust is built through a pattern, not a single moment.",
        action:"Before your next 1:1 this week, ask yourself whether there is something you have been meaning to raise but have been waiting for the right moment. Say: there is something I want to bring up — not because it is urgent, but because I think it matters to you." },
      { insight:"You took time to process before communicating — a reasonable instinct. But the gap between when you heard the news and when your team heard it created a real trust cost. Your team’s question during that gap was not what is happening — it was why has our leader gone quiet?",
        action:"The next time you receive news that will affect your team, send a holding message within 60 minutes: I have just heard about this. I am getting clarity on what it means for us and will come back to you by [specific time]." },
      { insight:"Going to management for more context was reasonable. But while you were gathering it, your team heard fragments through informal channels. The sequence in which people receive news tells them something about where they sit in your thinking. You protected the message but lost the moment.",
        action:"Before you escalate for information, take 90 seconds to message your team: I have seen the announcement. I am speaking to [manager] to get more clarity for us — I will come back by [time]." }
    ],
    3: [
      { insight:"You kept your doubts private to present a united front — a professional instinct. But your team sensed the gap between what you said and how you said it. Authenticity is read through register, pace, and energy as much as through words. The change landed around your team rather than with them.",
        action:"The next time you are asked to lead a change you have private questions about, find one sentence that is both honest and forward-moving: I have some questions about this that I am still working through — and here is what I am confident about." },
      { insight:"You made the harder choice and it produced more than a polished united front would have. Your transparency about your own questions made your team feel less alone in theirs. Trust is still showing as a growth area overall, which means this behaviour is not yet consistent.",
        action:"Once a month, share something with your team that is genuinely unresolved — a decision you are still working through. Say: I want to think through something with you — I do not have a clear answer yet." },
      { insight:"Your team got behind the change and your concerns stayed professional. The cost is in what your team missed: seeing how you hold private disagreement with a decision while still leading its implementation. The deeper trust that would have come from the more honest version is still available to you.",
        action:"Find a lower-stakes version of this scenario in your current work and try the more honest approach: I have some questions I am still working through about this direction. Here is what I do believe — and here is how I am thinking about making it work for us." }
    ]
  },
  P: {
    7: [
      { insight:"You moved on the performance issue without delay and without softening the specificity. Proactivity is still showing as a growth area overall — the instinct is there but may not yet be consistent. The hardest proactivity is not in the moments that force action — it is in the moments where nothing has yet forced it.",
        action:"This week, identify one team member or situation where something feels slightly off — not a confirmed problem. Act on it today with a direct specific observation: I have noticed [specific thing] and I wanted to check in before it became something we needed to deal with." },
      { insight:"You reframed the performance conversation as a welfare check-in — which feels kind and is kind. But it delayed the feedback the person most needed. The hardest truth about difficult conversations: the kindest thing you can do for someone who is underperforming is to tell them clearly, specifically, and early.",
        action:"Before your next difficult conversation, prepare one specific example and write it down: the exact situation, the exact behaviour you observed, and the exact change you need to see. Then open the conversation with that example directly: I want to talk about [specific situation]. Here is what I observed and here is why it matters to me." },
      { insight:"Opening with what the person needs is a genuinely empowering instinct. The gap is that it came at the cost of the direct proactive feedback the situation required. Asking what do you need is the right opening, but the conversation still needs the clear specific feedback.",
        action:"Practice a two-step opening for difficult conversations. Step one: I have noticed [X]. Step two: I want to understand what is happening for you — what do you need? The order matters. Step one signals you are not avoiding the issue. Step two signals you are not just issuing a directive." }
    ],
    10: [
      { insight:"You broke the delay and gave the feedback directly before a high-stakes client call — even though three weeks had passed. Proactivity is still showing as a growth area overall, which tells us the capacity is there but the habit is not yet consistent.",
        action:"After your next team meeting or client interaction, identify one thing you observed that would be useful for someone to hear. Give it to them the same day — just a direct specific observation: I noticed [thing] in that meeting. I wanted to mention it because [reason it matters]." },
      { insight:"You let the specific incident go and planned to give feedback from tomorrow’s call if needed. That is avoidance framed as strategy. The person goes into tomorrow’s client call without the single most relevant piece of feedback available to them.",
        action:"Feedback has a half-life but it does not expire. The next time you have delayed feedback that still matters, give it with this framing: I have been meaning to raise something and I realise I have waited — I want to give it to you now because it is still relevant." },
      { insight:"You found a way to give the person something useful without the awkwardness of referencing the specific incident. The gap is in what they did not get: the grounded specific example that makes abstract principles concrete and actionable.",
        action:"The next time you find yourself coaching on a principle that is directly connected to a specific observation, make the connection explicit: I want to talk about client communication — and I want to be direct that there is a specific situation I have in mind. Then reference the incident before moving to the principle." }
    ]
  },
  E: {
    2: [
      { insight:"You prepared carefully and your care was evident. The gap is that a document transfers information but not capability. When real problems arrived — judgment calls that required context your words could not carry — they came back to you. What looked like a handover was a task transfer: you moved the work but not the ownership.",
        action:"Before your next handover, have one conversation the document cannot replace. Ask the person: in your own words, what is this process trying to achieve? What problem does it solve? Then walk them through your reasoning: here is why we do it this way rather than another way." },
      { insight:"You transferred the reasoning before the steps and then stepped back and let them own it. Within a month they were solving problems you had not anticipated. Empowerment is still showing as a growth area overall, which means this capability exists but is not yet deployed consistently.",
        action:"This week, find one smaller version of the handover moment in your day-to-day work — a task you are planning to do yourself that someone else could handle with a ten-minute explanation of the why. If yes — take the ten minutes." },
      { insight:"You made the ownership total rather than gradual — and that totality prevented the slow re-dependency that often follows gentler handovers. The gap is in the absence of the why: they know what not to do but not always why those were the most important mistakes to avoid.",
        action:"Before your next step-back delegation, add one conversation: before I give you the list of things to watch for, I want to tell you the reasoning behind the top three. Five minutes on the why behind the most important restrictions converts your step-back delegation from supervised ownership to genuine capability transfer." }
    ],
    4: [
      { insight:"You handled the client sign-off yourself and the HR conversation waited. The client sign-off was something a capable team member could have handled and grown from. The HR conversation was something only you could provide. That choice made an implicit decision about what requires you specifically — and got it wrong in both directions.",
        action:"Build a triage habit for your busiest mornings. Before you act on anything, spend two minutes asking: what on this list requires me specifically — my authority, my relationship, my judgment? And what would a capable team member benefit from owning?" },
      { insight:"You identified what required you specifically and what could be owned by someone else — and acted on that assessment under real Monday morning pressure. The person you delegated to handled the client sign-off well and grew from the responsibility. Empowerment is still showing as a growth area overall.",
        action:"Before each week, identify one task or decision you are currently planning to handle yourself that a team member could own — not because you are too busy, but because owning it would develop them. Hand it over with this framing: I am giving you this because I think you are ready for it — not because I do not have time for it." },
      { insight:"You got the sequencing right and the delegation worked. You identified what required you directly, what could be owned by someone else, and managed all three directions simultaneously. The Empowerment score is slightly lower because the act of messaging your manager first introduced a small delay before the delegation decision.",
        action:"The growth edge is pre-emptive delegation — building the empowerment habit before Monday mornings create the urgency. Identify one recurring task or decision that regularly lands on your desk. This week, explicitly transfer it: going forward, this is yours. Here is what good looks like, here is when to involve me, and here is what I trust you to handle independently." }
    ]
  },
  A: {
    5: [
      { insight:"You presented your instinct honestly and framed it as a hypothesis. The gap is that framing an instinct as a hypothesis when you already have enough information introduces unnecessary uncertainty. You had three weeks of observation — that is enough to make a recommendation. The adaptability gap is the distance between what you know and what you are prepared to commit to.",
        action:"Before your next recommendation, ask yourself: do I actually have enough information to make a clear call? If you have enough — say the recommendation clearly and own it: based on what I have been watching for three weeks, my recommendation is X. I am ready to test it this week and adjust if I am wrong." },
      { insight:"You committed. You put your name on a recommendation made with incomplete data, accepted that you might be wrong, and moved anyway. Adaptability is still showing as a growth area overall, which means this decisiveness is not yet consistent across the full range of situations where it is available.",
        action:"This week, identify one decision you have been waiting to make until you have more information. Ask yourself: what specifically would additional data change about my recommendation? If the answer is unclear — you already have enough. Make the call today, document your reasoning, and communicate it." },
      { insight:"You asked for another week to gather data. The problem is that you had been watching the pattern for three weeks. That is not thin information — that is a well-developed instinct waiting for permission to act. The week of delay has a real cost that is invisible because it does not show up as an event.",
        action:"Before your next request for more time, ask yourself one question: what specifically would I do differently with more data? If you cannot answer that concretely, you already have what you need. When more data would only make you feel more certain about a recommendation you already have — give the recommendation you have." }
    ],
    8: [
      { insight:"You acted. Six days of blocked progress ended in one decision. You documented and communicated — which distinguishes responsible autonomous action from reckless overreach. Adaptability is still showing as a growth area overall, which means this quality of decisive action under ambiguity is not yet consistent.",
        action:"The next time you are waiting for a decision that is technically above your authority, ask yourself: could I make a defensible version of this call, document my reasoning, and inform my manager? If yes — and if the cost of waiting is real — make the call. The key is always the documentation and the communication." },
      { insight:"You created a forcing function rather than an open-ended request — flagging a specific deadline gave your manager something actionable. The gap is in the six days that preceded that message: the team was blocked, morale was declining. The proactive version is sending the forcing-function message on day two — not day six.",
        action:"Build a personal rule for approval loops: if a decision has been waiting more than 48 hours and the cost of the delay is visible, escalate with a forcing function — I need a decision on X by [specific time], or I will proceed with [specific default approach]." },
      { insight:"You gave a team member real authority to make the call — a powerful empowerment move. The gap is that in doing so, you removed yourself from the adaptive decision entirely. By passing the ownership fully to a team member, you converted an adaptability challenge into an empowerment opportunity — the adaptive learning went to them rather than to you.",
        action:"The next time you are tempted to fully delegate a decision made under genuine ambiguity, pause and ask: is this primarily a development opportunity for them, or is this primarily a test of my own adaptive judgment? When it is both — stay in it yourself, make the call, then debrief with them afterwards." }
    ]
  }
};

// ── DISCUSS COMPANION QUESTION ────────────────────────────────
var COMPANION_QUESTION = "Is this what you would actually do — or what you know you should do?";

// ── STATE ─────────────────────────────────────────────────────
var S = {
  players: [],
  step: 0,
  scenarioOrder: [],
  roundChoices: [],
  pickerIdx: 0,
  tutSlide: 0,
  fromTutorial: true,
  timerInterval: null,
  timerRemaining: 150
};
