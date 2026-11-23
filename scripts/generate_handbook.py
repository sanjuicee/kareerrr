# -*- coding: utf-8 -*-
"""
Career Pilot: Complete User Guide & Classroom Presentation Handbook
Generates both HTML and PDF formats.
"""

import os
import subprocess
import sys

def main():
    print("Compiling Career Pilot Handbook...")

    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Career Pilot — Complete User Guide & Classroom Presentation Handbook</title>
<style>
  @page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
    @bottom-center {
      content: "Career Pilot — Complete User Guide & Presentation Handbook | Page " counter(page);
      font-size: 8pt;
      color: #64748b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.65;
    font-size: 10.5pt;
    margin: 0;
    padding: 0;
  }

  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 85vh;
    padding: 40px 20px;
    border-bottom: 2px solid #00a878;
  }

  .cover-badge {
    display: inline-block;
    padding: 4px 12px;
    background-color: #e6fcf5;
    color: #00875a;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #b2f2bb;
  }

  .cover h1 {
    font-size: 32pt;
    line-height: 1.15;
    color: #0f172a;
    margin: 0 0 15px 0;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .cover-subtitle {
    font-size: 14pt;
    color: #475569;
    margin-bottom: 35px;
    line-height: 1.4;
    max-width: 650px;
  }

  .cover-meta {
    margin-top: 40px;
    padding-top: 25px;
    border-top: 1px solid #e2e8f0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    font-size: 9.5pt;
    color: #64748b;
  }

  .cover-meta strong {
    color: #0f172a;
  }

  h1, h2, h3, h4 {
    color: #0f172a;
    font-weight: 700;
    page-break-after: avoid;
  }

  h1 {
    font-size: 20pt;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 8px;
    margin-top: 40px;
    margin-bottom: 18px;
    page-break-before: always;
  }

  h1:first-of-type {
    page-break-before: avoid;
  }

  h2 {
    font-size: 14.5pt;
    border-left: 4px solid #00a878;
    padding-left: 10px;
    margin-top: 28px;
    margin-bottom: 12px;
    color: #0f172a;
  }

  h3 {
    font-size: 12pt;
    margin-top: 20px;
    margin-bottom: 8px;
    color: #1e293b;
  }

  p {
    margin: 0 0 12px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 14px 0;
    padding-left: 24px;
  }

  li {
    margin-bottom: 6px;
  }

  /* Callout Boxes */
  .callout {
    padding: 14px 18px;
    margin: 16px 0;
    border-radius: 6px;
    font-size: 10pt;
    page-break-inside: avoid;
  }

  .script-box {
    background-color: #f8fafc;
    border-left: 4px solid #3b82f6;
    color: #1e293b;
  }

  .script-speaker {
    font-weight: 700;
    color: #1d4ed8;
    text-transform: uppercase;
    font-size: 8.5pt;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .stage-direction {
    display: inline-block;
    padding: 2px 6px;
    background-color: #e2e8f0;
    color: #475569;
    border-radius: 3px;
    font-size: 8.5pt;
    font-style: italic;
    font-family: monospace;
    margin-right: 4px;
  }

  .tip-box {
    background-color: #f0fdf4;
    border-left: 4px solid #16a34a;
    color: #166534;
  }

  .demo-box {
    background-color: #fefce8;
    border-left: 4px solid #ca8a04;
    color: #854d0e;
  }

  .qa-box {
    background-color: #fdf2f8;
    border-left: 4px solid #db2777;
    margin-bottom: 16px;
  }

  .qa-q {
    font-weight: 700;
    color: #9d174d;
    margin-bottom: 4px;
  }

  .qa-a {
    color: #334155;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 18px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }

  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background-color: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    border-bottom: 2px solid #cbd5e1;
  }

  tr:nth-child(even) td {
    background-color: #fbfcfd;
  }

  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: 600;
    text-transform: uppercase;
  }

  .badge-emerald { background-color: #d1fae5; color: #065f46; }
  .badge-sky { background-color: #e0f2fe; color: #0369a1; }
  .badge-amber { background-color: #fef3c7; color: #92400e; }
  .badge-purple { background-color: #f3e8ff; color: #6b21a8; }

  .toc {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px 24px;
    margin: 25px 0 35px 0;
  }

  .toc-title {
    font-size: 13pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
  }

  .toc-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 10pt;
  }

  .toc-item a {
    color: #2563eb;
    text-decoration: none;
  }

  .step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #0f172a;
    color: #ffffff;
    font-size: 9pt;
    font-weight: 700;
    margin-right: 8px;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-badge">Academic Project Documentation & Presentation Guide</div>
  <h1>Career Pilot</h1>
  <div class="cover-subtitle">
    The Complete User Manual, Non-Technical Operating Guide, and Classroom Presentation Masterclass
  </div>
  <p style="font-size: 11pt; color: #334155; max-width: 650px;">
    An end-to-end handbook designed to help you master every screen of Career Pilot, understand the practical human science behind it, and deliver a captivating, confident presentation to your professor and entire class.
  </p>

  <div class="cover-meta">
    <div>
      <p><strong>Project Type:</strong> Independent Software Engineering & UX Project</p>
      <p><strong>System Name:</strong> Career Pilot (Interactive Discovery & Atlas Platform)</p>
      <p><strong>Target Audience:</strong> College Students, Classmates, Academic Evaluators</p>
    </div>
    <div>
      <p><strong>Key Visual Features:</strong> Exploded Self 3D Model & Career Universe Network</p>
      <p><strong>Privacy Architecture:</strong> 100% Client-Side Local Execution</p>
      <p><strong>Document Version:</strong> 2.0 (Complete Presentation Handbook)</p>
    </div>
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="toc">
  <div class="toc-title">Handbook Table of Contents</div>
  <div class="toc-item"><span><strong>Part I:</strong> The Big Picture — Why Career Pilot Exists & The Human Problem It Solves</span></div>
  <div class="toc-item"><span><strong>Part II:</strong> Complete Screen-by-Screen User Manual (How Anyone Can Use It)</span></div>
  <div class="toc-item"><span><strong>Part III:</strong> Masterclass on Giving a Flawless Classroom Presentation</span></div>
  <div class="toc-item"><span><strong>Part IV:</strong> Verbatim Word-for-Word Presentation Speech Script</span></div>
  <div class="toc-item"><span><strong>Part V:</strong> Live Screen Demo Choreography (Click-by-Click Guide)</span></div>
  <div class="toc-item"><span><strong>Part VI:</strong> Professor Defense Guide & Tough Q&A Responses</span></div>
  <div class="toc-item"><span><strong>Part VII:</strong> Student Take-Home Workshop & Reflection Prompts</span></div>
</div>

<!-- PART I -->
<h1>Part I: The Big Picture — Why Career Pilot Exists & The Problem It Solves</h1>

<h2>1. The Real-World Dilemma Every College Student Experiences</h2>
<p>
If you walk into any university lecture hall or student cafeteria and ask people: <em>"Do you know exactly what you want to do after graduation, and do you know how to get there?"</em>, you will notice something fascinating. Most people will smile nervously, look down at their shoes, or give you a generic, rehearsed answer like: <em>"Oh, I guess I'll do software engineering,"</em> or <em>"I'll probably just apply for corporate consulting jobs."</em>
</p>
<p>
The truth is that college students today are experiencing unprecedented career anxiety. On one hand, we are constantly told that the world is changing rapidly, that artificial intelligence is reshaping industries, that degrees alone don't guarantee jobs, and that career paths are no longer straight linear ladders. On the other hand, the tools available to help us figure out our future are surprisingly terrible.
</p>
<p>
Think about what happens when an ordinary student tries to figure out their career direction today:
</p>
<ul>
  <li><strong>The Generic Online Personality Quiz:</strong> You answer 10 questions about whether you prefer reading books at a party or talking to strangers. At the end, it tells you that you are an "INFJ" or an "Enneagram Type 4" and solemnly declares: <em>"You should be a high school librarian or an event planner."</em> This is absurd. Real human beings cannot be boiled down to a 4-letter personality box. We have complex curiosities, specific financial needs, different family constraints, and skills that change over time.</li>
  <li><strong>The Overwhelming Job Boards:</strong> You go onto LinkedIn or Indeed, type in a keyword, and are immediately hit with 40,000 job postings filled with buzzwords like <em>"fast-paced agile ninja"</em> and <em>"requires 5 years of experience for an entry-level position."</em> These platforms tell you what jobs exist right now for experienced professionals, but they do nothing to help you understand who you are or whether you would actually enjoy waking up on a Tuesday morning to do that work.</li>
  <li><strong>The Conventional Resume Scanner:</strong> Other websites simply parse your existing resume and tell you what keywords you are missing. But if you're 20 or 21 years old in college, your resume is still being written! You don't just want to know what jobs fit the three bullet points of your past internship; you want to know what paths could shape your next 10 years.</li>
</ul>

<h2>2. What Makes Career Pilot Fundamentally Different?</h2>
<p>
<strong>Career Pilot is not another personality quiz, not an AI chatbot, and not a standard resume scanner.</strong> It was designed from the ground up as an interactive exploration instrument. It is built around three core principles that solve the exact pitfalls of traditional career advice:
</p>
<ol>
  <li><strong>Adaptive Self-Discovery Across Nine Life Dimensions:</strong> Instead of asking superficial questions, Career Pilot evaluates your interests, your natural aptitudes, your demonstrated skills, your preferred daily work style (like how much autonomy you need or whether you prefer deep solo focus vs. constant team brainstorming), your core values, your lifestyle expectations, your education, your practical constraints (like money and time), and your long-term ambitions.</li>
  <li><strong>Connecting Self-Knowledge to Real Labor Market Data:</strong> Career Pilot doesn't guess or make up job descriptions. It connects your profile directly to authoritative international occupational databases (including O*NET, ESCO, and NCO). Every recommendation comes with clear, plain-English explanations of <em>why</em> it fits you, what trade-offs you would have to make, what skills you need, and what the salary percentiles look like in the real world.</li>
  <li><strong>Mapping Realistic Stepping-Stone Pathways:</strong> A career change or initial job entry is rarely a blind leap across a giant canyon. You cannot just jump from being a biology student to being a senior computational bioinformatician overnight. Career Pilot generates <em>multi-hop pathways</em>: step-by-step journeys showing the education you need, the foundational skills to build, the entry-level "bridge roles" you can take, and how each step leads to your target career.</li>
  <li><strong>100% Client-Side Privacy:</strong> Your career reflections, your honest fears about money, your doubts, and your personal trade-offs stay completely private in your own web browser. No accounts are required, no personal data is sold, and your private reflections are never used to train an external AI model.</li>
</ol>

<div class="callout tip-box">
  <strong>Key Presentation Takeaway for Your Class:</strong> When explaining Career Pilot, emphasize that it's designed to give students <em>clarity, honesty, and an actionable roadmap</em> rather than a simplistic fortune-cookie label.
</div>

<!-- PART II -->
<h1>Part II: Complete Screen-by-Screen User Manual</h1>
<p>
This section is your reference guide to every screen, button, and interaction in Career Pilot. You can use this to learn the application yourself or hand it to classmates who want to try the app on their laptops.
</p>

<h2>1. The Landing & Discovery Overview</h2>
<p>
When you open Career Pilot (at <code>http://127.0.0.1:5173/</code>), you are greeted by the <strong>Discovery Overview</strong>. This screen is designed to feel welcoming, calm, and uncluttered.
</p>
<ul>
  <li><strong>The Header Banner:</strong> Clearly identifies the application and shows your overall assessment progress percentage. As you answer questions, this progress bar fills up smoothly.</li>
  <li><strong>The Start Assessment Button:</strong> A prominent emerald button that launches the interactive questionnaire. If you've already answered some questions, it automatically says <em>"Resume Assessment"</em> so you never lose your spot.</li>
  <li><strong>The Three Core Guarantees:</strong>
    <ul>
      <li><em>Adaptive Inquiry:</em> Explains that the questions adapt dynamically to your answers rather than giving everyone the same rigid test.</li>
      <li><em>Authoritative Data:</em> Explains that occupations are mapped to real-world labor market data and official job classification taxonomies.</li>
      <li><em>100% Private:</em> Explains that your data is stored locally in your browser with zero third-party tracking.</li>
    </ul>
  </li>
  <li><strong>The Nine Areas of Discovery Grid:</strong> Below the hero banner, you see cards representing the 9 dimensions of your profile (Interests, Aptitudes, Skills, Work Style, Values, Lifestyle, Education, Constraints, Ambitions). Each card shows how many questions you have completed in that area (for example: <em>"3 of 5 answered"</em>). Clicking any card takes you directly to that section.</li>
</ul>

<h2>2. Taking the Adaptive Questionnaire</h2>
<p>
Clicking <em>"Start Assessment"</em> opens the <strong>Adaptive Assessment Console</strong>. The assessment contains 34 core questions with up to 6 adaptive follow-ups. You will immediately notice that this is nothing like a dull survey.
</p>

<h3>A. Diverse, Engaging Question Formats</h3>
<p>Career Pilot uses different interactive inputs tailored to the type of thought being asked:</p>
<ul>
  <li><strong>Single & Multi-Choice Plates:</strong> Clean, tactile cards for selecting topics of interest or previous experiences. When you select an item, it lights up with a subtle emerald border and a satisfying click response.</li>
  <li><strong>Priority Ranking Lists:</strong> For questions about your values, you are given a list of options (such as high income, job security, creative autonomy, or work-life balance). You use up and down chevrons to arrange them in your exact personal priority order from 1 to 5.</li>
  <li><strong>Side-by-Side Trade-Off Dilemmas:</strong> Real life is full of compromises. Career Pilot presents realistic dilemmas: for instance, <em>Option A: High initial salary at a massive corporation with rigid hierarchies</em> vs. <em>Option B: Lower starting salary at a dynamic startup with total creative freedom</em>. You click the option that matches your natural instinct.</li>
  <li><strong>Proportional Allocation Sliders:</strong> For questions about your ideal daily schedule, you are given a 100% distribution bar. You adjust sliders to allocate percentages of your week between analytical deep work, creative writing, team meetings, and strategic planning. The bar shows your live percentage balance.</li>
  <li><strong>Situational Scenario Cases:</strong> Real workplace situations are described in a narrative box (for example, handling a high-stakes team deadline conflict). You choose which reaction best describes what you would actually do.</li>
</ul>

<h3>B. Helpful Supportive Features on Every Question</h3>
<ul>
  <li><strong>"Why We Ask" Expandable Drawer:</strong> If you are curious why a question is being asked, clicking the "Why We Ask" button opens a short, helpful explanation explaining the psychological or practical reason behind the question.</li>
  <li><strong>"I'm exploring this / not completely sure" Checkbox:</strong> This is one of Career Pilot's most human features. If you don't know the answer or aren't certain, checking this box tells the engine: <em>"The user is uncertain here."</em> Instead of forcing a false guess, Career Pilot notes this as an "Exploration Area" in your final profile so you can investigate it later.</li>
  <li><strong>The Linear Question Stepper:</strong> At the top of the assessment, you can see numbered buttons (01 to 34). You can click on any previous number at any time to go back and revise an earlier answer.</li>
</ul>

<h2>3. The Exploded Self 3D Model (Signature Feature #1)</h2>
<p>
Once you answer questions, navigating to <strong>My Profile</strong> reveals the <strong>Exploded Self Model</strong>. This is one of the two standout visual features of Career Pilot.
</p>
<div class="callout demo-box">
  <strong>What is an "Exploded View"?</strong> In engineering and architecture, an exploded-view diagram shows all the individual parts of a complex mechanism slightly separated in space so you can see how everything connects and fits together. Career Pilot does the exact same thing for your career identity!
</div>
<ul>
  <li><strong>The Central Profile Core:</strong> In the center sits a glowing box representing <em>You</em>. It displays your name, your profile baseline, and the total count of verified signals collected from your questionnaire.</li>
  <li><strong>The Six Floating Dimension Plates:</strong> Arranged around the core are six interactive floating plates representing your core intelligence dimensions:
    <ol>
      <li><em>Interests & Curiosity:</em> What subjects and domains naturally fascinate you.</li>
      <li><em>Aptitudes & Strengths:</em> Your natural cognitive instincts and problem-solving styles.</li>
      <li><em>Skills Inventory:</em> Tangible abilities you have already practiced or studied.</li>
      <li><em>Work Preferences:</em> Your rhythm, pace, and whether you thrive alone or in groups.</li>
      <li><em>Core Values:</em> Your non-negotiable principles and multi-year motivators.</li>
      <li><em>Growth Vectors:</em> High-potential areas where learning would unlock new careers.</li>
    </ol>
  </li>
  <li><strong>Interactive Spatial Controls:</strong>
    <ul>
      <li><strong>Expansion Slider:</strong> Drag the slider from 20% to 100% to watch the layers smoothly separate further from the core or assemble back into a compact nucleus.</li>
      <li><strong>3D View / 2D View Toggle:</strong> Click this button to tilt the canvas into a perspective 3D isometric view or flatten it into a 2D orthographic diagram.</li>
      <li><strong>Clicking to Inspect:</strong> Clicking on any floating plate brings it forward in full focus and opens the <em>Inspector Dossier</em> on the right side of the screen.</li>
    </ul>
  </li>
  <li><strong>The Inspector Dossier:</strong> Displays the specific traits discovered in that layer, their confidence scores, and an <em>"Inspect Evidence"</em> button. Clicking it opens a modal showing the exact question you answered, what you typed, and the date and time it was captured!</li>
</ul>

<h2>4. The Personal Intelligence Profile & Audit Report</h2>
<p>
Clicking the <em>"Detailed Profile"</em> tab inside <strong>My Profile</strong> takes you to a comprehensive report that summarizes everything Career Pilot learned about you:
</p>
<ul>
  <li><strong>Executive Summary:</strong> A narrative paragraph that synthesizes your profile in clear, encouraging prose.</li>
  <li><strong>Polarity Spectrum Gauges:</strong> Four horizontal balance bars showing where you fall on key workplace spectrums:
    <ul>
      <li><em>Structure vs. Autonomy:</em> Do you thrive with established playbooks or total strategic independence?</li>
      <li><em>Deep Solo Focus vs. Collaboration:</em> Do you prefer quiet individual focus or constant social interaction?</li>
      <li><em>Empirical Data vs. Conceptual Ideas:</em> Are you drawn to concrete metrics or abstract creative concepts?</li>
      <li><em>Predictable Monotasking vs. Dynamic Variety:</em> Do you prefer steady routines or fast-paced shifting days?</li>
    </ul>
  </li>
  <li><strong>Skills Inventory:</strong> A structured list of your verified technical, analytical, and interpersonal skills. You can even click <em>"Add Verified Skill"</em> to manually record a skill you learned outside the classroom.</li>
  <li><strong>Practical Reality Bounds:</strong> Displays your financial runway (in months), geographic mobility preferences, and weekly hours available for career development.</li>
  <li><strong>Identified Trade-Offs & Decisions:</strong> Surfaces any healthy tensions in your answers (for example: wanting high startup autonomy while having low financial risk tolerance) and suggests constructive ways to resolve them.</li>
</ul>

<h2>5. The Curated Career Atlas (Signature Feature #2)</h2>
<p>
Clicking on <strong>Career Atlas</strong> in the top navigation bar opens the career exploration engine. Here, the platform connects your profile to real-world occupations.
</p>
<ul>
  <li><strong>Match Categories:</strong> Careers are organized into meaningful buckets:
    <ul>
      <li><span class="badge badge-emerald">Direct Matches</span>: Careers that fit your existing skills, interests, and preferences immediately.</li>
      <li><span class="badge badge-sky">Adjacent Matches</span>: Careers that share 70% of your current profile and require only minor bridging.</li>
      <li><span class="badge badge-purple">Interdisciplinary</span>: Unique roles that sit at the intersection of two different curiosities (e.g., technology + environmental biology).</li>
      <li><span class="badge badge-amber">Unexpected Discovery</span>: Less obvious careers you might never have considered, but which strongly match your cognitive instincts.</li>
    </ul>
  </li>
  <li><strong>The Interactive Career Universe Network:</strong> A visual constellation graph at the top of the page. It maps your personal profile on the far left, connecting through required Education nodes, essential Skill nodes, practical Bridge Roles (stepping-stone jobs), and final Target Destination Occupations on the right.
    <p><em>Try this:</em> Click on any career card in the list below, and watch the network map automatically trace and highlight the exact path connecting you to that job!</p>
  </li>
  <li><strong>The Occupational Detail Drawer:</strong> Clicking any career card opens an extensive inspection drawer showing:
    <ul>
      <li>Realistic day-in-the-life work activities.</li>
      <li>Salary bands (from entry-level 10th percentile to senior 90th percentile, toggleable between US Dollars, Euros, and Indian Rupees).</li>
      <li>Workplace friction scores (stress levels, physical demands, collaboration intensity).</li>
      <li>Transferable skills you already possess vs. skills you need to build.</li>
      <li>Actions to <em>"Bookmark Career"</em>, <em>"Add to Compare"</em>, or <em>"Generate Pathways"</em>.</li>
    </ul>
  </li>
</ul>

<h2>6. Dynamic Career Pathways</h2>
<p>
Clicking on <strong>My Pathways</strong> moves beyond just naming job titles to answering: <em>"How do I actually get there from where I am today?"</em>
</p>
<ul>
  <li><strong>Multiple Route Options:</strong> For any chosen target occupation, the engine generates several distinct ways to reach it:
    <ul>
      <li><em>Direct Linear Route:</em> Standard degree and entry-level progression.</li>
      <li><em>Skill-Based Bridge Route:</em> Focusing on building a portfolio and taking a transitional stepping-stone job.</li>
      <li><em>Alternative Education Route:</em> Using bootcamps, certifications, or self-directed projects.</li>
      <li><em>Interdisciplinary Route:</em> Leveraging an unconventional background as a unique advantage.</li>
    </ul>
  </li>
  <li><strong>Milestone Breakdown:</strong> Each route breaks down the journey into sequential phases, estimating the time commitment (e.g. 6 to 18 months), primary skills to acquire, and potential risks to watch out for.</li>
  <li><strong>Save Pathway:</strong> You can click <em>"Save Pathway"</em> to store your favorite routes in your personal collection.</li>
</ul>

<h2>7. Side-by-Side Career Comparison</h2>
<p>
Clicking on <strong>Compare</strong> in the header allows you to evaluate up to three careers side-by-side in a clean comparative ledger:
</p>
<ul>
  <li><strong>Direct Contrast:</strong> Directly compares salary trajectories, weekly working hours, barrier to entry, autonomy scores, and remote work viability.</li>
  <li><strong>Interactive Priority Lens Simulator:</strong> You can click different priority lenses (such as <em>"Max Compensation"</em>, <em>"Max Autonomy"</em>, <em>"Max Remote"</em>, or <em>"Low Entry Barrier"</em>) to see which career wins when your life priorities change.</li>
</ul>

<h2>8. The Strategic Career Roadmap</h2>
<p>
Clicking on <strong>Roadmap</strong> turns long-term career dreams into immediate, realistic weekly actions:
</p>
<ul>
  <li><strong>Milestone Horizon Buckets:</strong> Actions are organized into:
    <ul>
      <li><em>Next 7 Days:</em> Quick, immediate wins (e.g., reading an industry paper, exploring an open-source project, or auditing foundational terminology).</li>
      <li><em>Next 30 Days:</em> Meaningful projects (e.g., building a small software prototype, setting up a portfolio repository, or attending a local seminar).</li>
      <li><em>Quarter 1 (Next 90 Days):</em> Substantial capabilities (e.g., completing an independent milestone or shadowing a professional).</li>
    </ul>
  </li>
  <li><strong>Interactive Checkboxes:</strong> Checking off items updates your <em>Action Velocity</em> meter in real time, giving you tangible momentum.</li>
  <li><strong>Print Plan:</strong> A handy button that formats your active roadmap cleanly so you can print it out or save it as a local planning sheet.</li>
</ul>

<!-- PART III -->
<h1>Part III: Masterclass on Giving a Flawless Classroom Presentation</h1>

<h2>1. The Presentation Mindset: You Are Telling a Human Story</h2>
<p>
Most student software presentations fail for one simple reason: the presenter opens their laptop, shows five slides filled with bullet points of code libraries, and then clicks through their website like they are running through a checklist: <em>"Here is the database, here is the login button, here is the table."</em> The audience tunes out within two minutes, and the professor starts checking their email.
</p>
<p>
To get an outstanding grade and receive genuine applause from your classmates, you must understand the psychology of your audience:
</p>
<ul>
  <li><strong>Your classmates are stressed about their careers right now.</strong> If you frame your project as a solution to a problem they personally feel, you will have their complete attention from the very first sentence.</li>
  <li><strong>Your professor wants to see independent thought, clean execution, and purposeful design.</strong> They don't want to see a generic AI-generated template; they want to see a thoughtful developer who made intentional decisions about usability, architecture, and visual clarity.</li>
  <li><strong>Show, don't just tell.</strong> Spend only 2 to 3 minutes on introductory context, and spend the remaining 8 to 10 minutes doing an engaging, live interactive demonstration on the projector.</li>
</ul>

<h2>2. Ideal 12-Minute Classroom Presentation Blueprint</h2>
<table>
  <thead>
    <tr>
      <th style="width: 15%;">Time</th>
      <th style="width: 25%;">Section</th>
      <th>Presenter Objective & Focus</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>0:00 – 1:30</strong></td>
      <td><strong>The Emotional Hook</strong></td>
      <td>Ask the audience an engaging question. Expose why traditional career quizzes are broken. Introduce the concept of Career Pilot.</td>
    </tr>
    <tr>
      <td><strong>1:30 – 3:30</strong></td>
      <td><strong>The Core Architecture</strong></td>
      <td>Explain the 9 dimensions of discovery, explain why no AI API or external tracking is needed, and highlight 100% client-side privacy.</td>
    </tr>
    <tr>
      <td><strong>3:30 – 6:30</strong></td>
      <td><strong>Live Demo: Assessment & Exploded Self</strong></td>
      <td>Open the browser. Show 2 or 3 interactive question types. Navigate to the Exploded Self 3D model, move the expansion slider, and click a layer plate to inspect underlying evidence.</td>
    </tr>
    <tr>
      <td><strong>6:30 – 9:30</strong></td>
      <td><strong>Live Demo: Career Atlas & Pathways</strong></td>
      <td>Navigate to the Career Atlas. Click a career and show how the network graph lights up the path from education to skills to target job. Show side-by-side comparison.</td>
    </tr>
    <tr>
      <td><strong>9:30 – 11:00</strong></td>
      <td><strong>Technical & Design Decisions</strong></td>
      <td>Explain why you chose a clean, minimal design instead of an overengineered corporate template. Highlight the deterministic scoring logic and authoritative databases.</td>
    </tr>
    <tr>
      <td><strong>11:00 – 12:00+</strong></td>
      <td><strong>Conclusion & Open Q&A</strong></td>
      <td>Deliver a memorable closing sentence and invite questions from the professor and peers.</td>
    </tr>
  </tbody>
</table>

<h2>3. Technical Checklist Before You Plug into the Projector</h2>
<ul>
  <li><strong>Browser Zoom:</strong> Ensure your browser zoom is set to 100% or 110% so text is easily readable from the back of the lecture room.</li>
  <li><strong>Full-Screen Mode:</strong> Press <code>F11</code> in Chrome or Edge to enter clean full-screen mode, hiding browser tabs and search bars.</li>
  <li><strong>Pre-Populated Data:</strong> Make sure you have completed at least 15 to 20 questions in the assessment prior to the presentation so that your Profile, Exploded Self, and Atlas are rich with data. You can always click "Answer More Questions" to show the questionnaire live!</li>
  <li><strong>Display Contrast:</strong> Because Career Pilot uses a modern dark theme, make sure the classroom projector is in high-contrast or presentation mode so the emerald and cyan accents pop brightly on the screen.</li>
</ul>

<!-- PART IV -->
<h1>Part IV: Verbatim Word-for-Word Spoken Presentation Script</h1>
<p>
Here is an exact, word-for-word script you can rehearse and deliver. It is written in a natural, confident, and conversational style. Notice the bracketed stage directions showing you exactly when to click, pause, or gesture.
</p>

<div class="callout script-box">
  <div class="script-speaker">Presenter Speech (Minutes 0:00 – 2:00) — The Opening Hook</div>
  <p>
    <span class="stage-direction">[Stand at the front of the room, smile, make eye contact, and do not touch the computer yet.]</span>
  </p>
  <p>
    "Good morning everyone, and good morning Professor. Let me start with a quick question: Raise your hand if you’ve ever taken an online career quiz or personality test."
  </p>
  <p>
    <span class="stage-direction">[Wait 2 seconds as hands go up across the room. Smile and nod.]</span>
  </p>
  <p>
    "Almost every single hand in this room. Now keep your hand up if that quiz actually changed your life, gave you a clear roadmap, and made you feel 100% confident about your future."
  </p>
  <p>
    <span class="stage-direction">[Watch all hands drop. Chuckle slightly.]</span>
  </p>
  <p>
    "Exactly. Zero hands. Because we all know what happens when you take those quizzes. You answer 10 vague questions about whether you like parties or quiet rooms, and at the end it spits out: <em>'You are an INTJ. You should be a database administrator.'</em>
  </p>
  <p>
    It feels like a fortune cookie. It doesn't know who you are, it doesn't know what skills you actually have, it doesn't know your financial constraints, and it tells you nothing about how to actually get from where you're sitting today to that career.
  </p>
  <p>
    That frustration is why I built <strong>Career Pilot</strong>. Career Pilot is an interactive, privacy-first career discovery and planning instrument designed specifically for students who want honest self-understanding, real labor market data, and actionable pathways."
  </p>
</div>

<div class="callout script-box">
  <div class="script-speaker">Presenter Speech (Minutes 2:00 – 4:30) — The Philosophy & Questionnaire</div>
  <p>
    <span class="stage-direction">[Switch projector screen to Career Pilot's Landing page: Discovery Overview.]</span>
  </p>
  <p>
    "Here is the application. When you open Career Pilot, you immediately notice that it doesn't look like a generic corporate website. It’s clean, minimal, and focused.
  </p>
  <p>
    Instead of asking a few superficial questions, Career Pilot evaluates nine fundamental dimensions of a person's life: your natural curiosities, your cognitive aptitudes, your demonstrated skills, your daily work preferences, your core values, your lifestyle expectations, your formal education, your practical financial and time constraints, and your long-term ambitions.
  </p>
  <p>
    <span class="stage-direction">[Click 'Resume Assessment' or 'Start Assessment' to bring up the Adaptive Assessment Console.]</span>
  </p>
  <p>
    Let's look at the assessment itself. Notice that this is never a boring multiple-choice survey.
  </p>
  <p>
    <span class="stage-direction">[Point to the screen at a Trade-Off or Allocation question.]</span>
  </p>
  <p>
    Here, the user isn't just picking random answers. They are ranking real priorities using tactile reordering chevrons. They are making realistic trade-offs between starting salaries and creative autonomy. They are allocating percentages of their ideal work week.
  </p>
  <p>
    And notice this little checkbox right here at the bottom: <em>'I’m exploring this / not completely sure.'</em> Traditional career tests force you to make a false guess. Career Pilot recognizes that uncertainty is valuable data! If you check this box, the platform remembers that you are exploring this area, and surfaces it later as a growth question rather than making a false assumption."
  </p>
</div>

<div class="callout script-box">
  <div class="script-speaker">Presenter Speech (Minutes 4:30 – 7:30) — The Exploded Self 3D Model</div>
  <p>
    <span class="stage-direction">[Click 'My Profile' in the top header. The Exploded Self 3D Canvas appears.]</span>
  </p>
  <p>
    "Now, what happens to all that information? In typical apps, it disappears into a black box. In Career Pilot, it transforms into this: <strong>The Exploded Self Model</strong>.
  </p>
  <p>
    <span class="stage-direction">[Pause for 2 seconds to let the class take in the visual layout.]</span>
  </p>
  <p>
    In architectural drafting and mechanical engineering, an 'exploded view' separates the individual components of a complex machine in space so you can examine how every piece functions together. That is exactly what we are doing here for human capability.
  </p>
  <p>
    In the center is your Profile Core, displaying your baseline and verified signal count. Floating around it are six distinct intelligence layers: Interests, Aptitudes, Skills, Work Style, Core Values, and Growth Vectors.
  </p>
  <p>
    <span class="stage-direction">[Drag the Expansion slider from 30% to 90% and back. Click the '3D View' toggle to show the perspective tilt.]</span>
  </p>
  <p>
    We can interactively expand or assemble these layers, view them in perspective 3D or flat 2D. But this isn't just eye candy. Every single plate is interactive. Watch what happens when I click on <strong>Aptitudes & Strengths</strong>.
  </p>
  <p>
    <span class="stage-direction">[Click the Aptitudes plate. It smoothly elevates forward, and the Inspector Dossier appears on the right.]</span>
  </p>
  <p>
    The plate comes forward, and the dossier shows the specific traits inferred by the system. And if I click <em>'Inspect Evidence'</em>...
  </p>
  <p>
    <span class="stage-direction">[Click 'Inspect Evidence' to show the modal dialog.]</span>
  </p>
  <p>
    ...it opens complete deterministic traceability! It shows the exact question I answered, the exact text I wrote, and the timestamp it was recorded. There is zero guessing and zero hallucination. If you disagree with an insight, you can click <em>'Refine'</em> and update it immediately."
  </p>
</div>

<div class="callout script-box">
  <div class="script-speaker">Presenter Speech (Minutes 7:30 – 10:00) — The Career Atlas & Interactive Network</div>
  <p>
    <span class="stage-direction">[Close modal, click 'Career Atlas' in the top navigation bar.]</span>
  </p>
  <p>
    "Next, let's look at how Career Pilot connects self-knowledge to the real world: <strong>The Career Atlas</strong>.
  </p>
  <p>
    Rather than dumping thousands of irrelevant job postings, Career Pilot evaluates your profile against authoritative international labor databases—specifically O*NET from the US, ESCO from Europe, and NCO from India.
  </p>
  <p>
    It categorizes recommendations into direct matches, adjacent matches, interdisciplinary opportunities, and unexpected discoveries.
  </p>
  <p>
    <span class="stage-direction">[Point to the Career Universe Network graph at the top.]</span>
  </p>
  <p>
    Right here at the top is the <strong>Career Universe Network</strong>. On the left is You. Next are your required Education paths, your core Skills, practical Bridge Roles—which are entry-level stepping stones—and on the far right are the Destination Careers.
  </p>
  <p>
    Watch what happens when I select an occupation, like <em>Distributed Systems Engineer</em> or <em>Bioinformatics Analyst</em>.
  </p>
  <p>
    <span class="stage-direction">[Click an occupation card below. Watch the network lines light up in emerald and sky blue.]</span>
  </p>
  <p>
    The network graph dynamically illuminates the entire path! It shows the exact degree background, the specific kernel and algorithmic skills, and the bridge role that leads to that position.
  </p>
  <p>
    And if we open the career drawer on the right, we get real salary bands from the 10th percentile to the 90th percentile, workplace friction metrics, and transferable skill overlays."
  </p>
</div>

<div class="callout script-box">
  <div class="script-speaker">Presenter Speech (Minutes 10:00 – 12:00) — Comparison, Roadmap & Closing</div>
  <p>
    <span class="stage-direction">[Click 'Compare' in the header to briefly show the side-by-side view, then click 'Roadmap'.]</span>
  </p>
  <p>
    "Finally, Career Pilot understands that career planning without an execution plan is just daydreaming.
  </p>
  <p>
    In the <strong>Roadmap</strong> view, long-term aspirations are broken down into realistic milestones: what you can accomplish in the Next 7 Days, the Next 30 Days, and Quarter 1. Checking off items updates your action momentum in real time.
  </p>
  <p>
    To wrap up: As students, we often feel overwhelmed by career choices because the existing tools either treat us like simple stereotypes or bury us in meaningless job boards.
  </p>
  <p>
    Career Pilot proves that software can be thoughtful, transparent, visually engaging, and completely private. It doesn't tell you who you have to be—it gives you a compass and an atlas so you can navigate your own path.
  </p>
  <p>
    Thank you very much, and I would love to answer any questions!"
  </p>
  <p>
    <span class="stage-direction">[Smile, step back, and look at the professor and class.]</span>
  </p>
</div>

<!-- PART V -->
<h1>Part V: Live Screen Demo Choreography</h1>
<p>
When doing a live demo in front of a class, never wonder <em>"What should I click next?"</em>. Follow this exact 7-step choreography:
</p>

<table>
  <thead>
    <tr>
      <th style="width: 10%;">Step</th>
      <th style="width: 25%;">Screen / Tab</th>
      <th style="width: 35%;">Action You Perform</th>
      <th>What the Audience Sees</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="step-number">1</span></td>
      <td><strong>Discover</strong></td>
      <td>Open homepage. Scroll smoothly past the 3 pillars to the 9 dimension cards.</td>
      <td>Clean, polished landing page. Shows 9 distinct areas with completion bars.</td>
    </tr>
    <tr>
      <td><span class="step-number">2</span></td>
      <td><strong>Assessment</strong></td>
      <td>Click <em>"Resume Assessment"</em>. Select a slider or trade-off option. Click <em>"Why We Ask"</em>.</td>
      <td>Shows interactive question inputs and the psychological rationale drawer.</td>
    </tr>
    <tr>
      <td><span class="step-number">3</span></td>
      <td><strong>My Profile</strong></td>
      <td>Click <em>"My Profile"</em> tab. Move the <em>Expansion slider</em> left and right.</td>
      <td>The 3D Exploded Self layers smoothly expand and contract around the user core.</td>
    </tr>
    <tr>
      <td><span class="step-number">4</span></td>
      <td><strong>Exploded Self</strong></td>
      <td>Click any floating plate (e.g. <em>Aptitudes</em>). Click <em>"Inspect Evidence"</em>.</td>
      <td>The layer plate elevates forward. A clean modal reveals exact question traceability.</td>
    </tr>
    <tr>
      <td><span class="step-number">5</span></td>
      <td><strong>Career Atlas</strong></td>
      <td>Click <em>"Career Atlas"</em>. Point to the network graph. Click on an occupation card.</td>
      <td>The network constellation lights up, tracing education, skills, and bridge roles to the job.</td>
    </tr>
    <tr>
      <td><span class="step-number">6</span></td>
      <td><strong>Compare</strong></td>
      <td>Click <em>"Compare"</em>. Click the <em>"Max Autonomy"</em> and <em>"Max Salary"</em> lenses.</td>
      <td>Side-by-side career comparison updates dynamically based on the chosen life priority.</td>
    </tr>
    <tr>
      <td><span class="step-number">7</span></td>
      <td><strong>Roadmap</strong></td>
      <td>Click <em>"Roadmap"</em>. Check off a 7-day milestone box.</td>
      <td>The velocity progress bar fills up instantly, proving immediate execution.</td>
    </tr>
  </tbody>
</table>

<!-- PART VI -->
<h1>Part VI: Professor Defense Guide & Tough Q&A Responses</h1>
<p>
Professors and sharp classmates love to ask challenging questions during software engineering, HCI, and product design presentations. Here are the 8 most common questions and how to answer them with authority:
</p>

<div class="callout qa-box">
  <div class="qa-q">Q1: "Is this just an API wrapper around OpenAI or an LLM chatbot?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "No, absolutely not. That was one of our primary design decisions. Most modern apps are just superficial prompt wrappers around an external LLM, which means your personal answers are sent across the internet, the results can hallucinate, and the advice is non-deterministic. Career Pilot runs 100% locally in the browser using deterministic scoring algorithms, structured graph traversal, and verified labor database taxonomies. It is consistent, explainable, and private."
  </div>
</div>

<div class="callout qa-box">
  <div class="qa-q">Q2: "Where is user data stored? How do you guarantee privacy?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "All user responses, profile signals, bookmarked careers, and saved roadmaps are stored entirely client-side in the browser's local storage and memory context. There is no remote tracking database, no user account creation required, and zero network calls sending personal information to third parties. If you close your browser or click 'Start Over', you have full ownership of your data."
  </div>
</div>

<div class="callout qa-box">
  <div class="qa-q">Q3: "How does the matching algorithm work if you aren't using a black-box AI model?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "We use a multi-dimensional weighted compatibility engine. Each occupation in our database carries structured benchmark vectors across skills, cognitive demands, work environment friction, and education baseline. When a user completes the assessment, the engine evaluates compatibility across all dimensions simultaneously, calculating dimensional sub-scores and identifying potential friction points. This is why every career match can explain <em>exactly</em> why it was recommended."
  </div>
</div>

<div class="callout qa-box">
  <div class="qa-q">Q4: "What international databases or standards are you using for the occupations?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "We grounded our occupational taxonomy in three respected international standards: the United States O*NET system (v29.1), the European Commission's ESCO classification (v1.2), and India's National Classification of Occupations (NCO-2015). This ensures our salary bands, day-to-day task descriptions, and skill requirements reflect verified labor market structures rather than arbitrary assumptions."
  </div>
</div>

<div class="callout qa-box">
  <div class="qa-q">Q5: "What happens if a user is young or has very little work experience?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "That is precisely why the assessment distinguishes between 'Self-Reported Aptitudes' and 'Demonstrated Capabilities'. Career Pilot does not penalize you for not having a 10-year resume. It identifies your natural problem-solving instincts, matches you with entry-level stepping stones (bridge roles), and surfaces 'Potential Growth Areas' where building a single project or learning one skill opens up new career pathways."
  </div>
</div>

<div class="callout qa-box">
  <div class="qa-q">Q6: "How did you design the Exploded Self visualization?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "We built a customized CSS 3D perspective canvas combined with an interactive SVG vector overlay. The coordinate math calculates spatial angles and depth offsets for each of the six intelligence dimension plates, allowing users to smoothly transition between a 3D isometric tilt and a 2D orthographic diagram without heavy external 3D libraries like Three.js. This keeps the bundle lightweight, fast, and accessible on any device."
  </div>
</div>

<div class="callout qa-box">
  <div class="qa-q">Q7: "Why did you choose a minimalist technical-editorial design instead of standard SaaS components?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "Most commercial websites use generic templates—identical rounded cards, random purple gradients, and generic stock illustrations. We wanted Career Pilot to feel like an authentic, thoughtfully engineered software instrument. By using clean typography, restrained dark surfaces, a single emerald accent, and tactile button feedback, the visual focus stays where it belongs: on the user's data and career choices."
  </div>
</div>

<div class="callout qa-box">
  <div class="qa-q">Q8: "What are the next planned steps for this project?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "The current platform features six fully integrated engines. For future expansion, we plan to support peer-to-peer anonymized profile comparison for college project teams, exportable portfolio roadmaps integrated with GitHub repositories, and dynamic regional salary adjustment calculators across additional countries."
  </div>
</div>

<!-- PART VII -->
<h1>Part VII: Student Take-Home Workshop & Reflection Prompts</h1>
<p>
If you want to engage your classmates in a 5-minute interactive exercise after your presentation, invite them to test their instincts with these three thought experiments:
</p>
<ol>
  <li><strong>The Autonomy vs. Structure Dilemma:</strong> <em>"If you were offered two jobs tomorrow—one offering a $100,000 salary where your boss writes a strict daily checklist of tasks, and one offering $70,000 where you are given complete freedom to define your own projects—which one do you take?"</em> Notice how the room splits 50/50! Career Pilot uses this exact trade-off to match workplace culture.</li>
  <li><strong>The Stepping-Stone Test:</strong> <em>"Pick a dream job that feels impossible right now. What is the one entry-level bridge role that would teach you 60% of what you need?"</em> Career Pilot's Career Universe Network answers this question automatically.</li>
  <li><strong>The Uncertainty Audit:</strong> <em>"What is one career direction you are curious about, but too afraid to admit you know nothing about?"</em> Career Pilot's uncertainty checkboxes allow you to explore those curiosities with zero judgment.</li>
</ol>

<div class="callout tip-box" style="margin-top: 30px;">
  <strong>Final Words of Encouragement:</strong> You built an exceptional, thoughtful, and unique project. Stand tall, speak clearly, smile, and enjoy showing your class something genuinely original!
</div>

</body>
</html>
"""

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    html_file = os.path.join(project_root, "Career_Pilot_Complete_User_Guide_and_Presentation_Handbook.html")
    pdf_file = os.path.join(project_root, "Career_Pilot_Complete_User_Guide_and_Presentation_Handbook.pdf")

    # 1. Write HTML File
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"HTML handbook written to: {html_file}")

    # 2. Count words
    text_only = ' '.join(html_content.replace('<', ' <').replace('>', '> ').split())
    # rough tag strip
    import re
    clean_text = re.sub(r'<[^>]+>', ' ', html_content)
    words = clean_text.split()
    word_count = len(words)
    print(f"Total handbook word count: ~{word_count} words")

    # 3. Compile to PDF using Microsoft Edge headless
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    edge_exe = None
    for p in edge_paths:
        if os.path.exists(p):
            edge_exe = p
            break

    if not edge_exe:
        print("Microsoft Edge not found in standard paths.")
        return

    print(f"Compiling PDF via Edge: {edge_exe}")
    cmd = [
        edge_exe,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        html_file,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_file) and os.path.getsize(pdf_file) > 0:
        pdf_size_kb = os.path.getsize(pdf_file) / 1024
        print(f"SUCCESS! PDF created: {pdf_file} ({pdf_size_kb:.1f} KB)")
    else:
        print(f"PDF creation failed: {result.stderr}")

if __name__ == "__main__":
    main()
