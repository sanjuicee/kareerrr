# -*- coding: utf-8 -*-
"""
Script to generate the Career Pilot Live Presentation Navigator & Visual Field Guide
and compile it into a print-ready PDF using Edge headless.
"""

import os
import subprocess

def main():
    print("Generating Career Pilot Live Presentation Navigator...")

    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Career Pilot — Live Presentation Navigator & Visual Field Guide</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-center {
      content: "Career Pilot — Presentation Navigator & Visual Field Guide | Page " counter(page);
      font-size: 8pt;
      color: #64748b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.6;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }

  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 85vh;
    padding: 30px 10px;
    border-bottom: 3px solid #00a878;
  }

  .badge-tag {
    display: inline-block;
    padding: 4px 10px;
    background-color: #e6fcf5;
    color: #00875a;
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-radius: 4px;
    margin-bottom: 18px;
    border: 1px solid #b2f2bb;
  }

  .cover h1 {
    font-size: 30pt;
    line-height: 1.15;
    color: #0f172a;
    margin: 0 0 12px 0;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .cover-subtitle {
    font-size: 13.5pt;
    color: #475569;
    margin-bottom: 25px;
    line-height: 1.4;
    max-width: 680px;
  }

  .cover-box {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #00a878;
    padding: 16px 20px;
    border-radius: 6px;
    margin: 20px 0;
    font-size: 9.5pt;
    color: #334155;
  }

  .cover-meta {
    margin-top: 35px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    font-size: 9pt;
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
    font-size: 18pt;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 6px;
    margin-top: 36px;
    margin-bottom: 16px;
    page-break-before: always;
  }

  h1:first-of-type {
    page-break-before: avoid;
  }

  h2 {
    font-size: 13.5pt;
    border-left: 4px solid #00a878;
    padding-left: 10px;
    margin-top: 24px;
    margin-bottom: 10px;
    color: #0f172a;
  }

  h3 {
    font-size: 11pt;
    margin-top: 16px;
    margin-bottom: 6px;
    color: #1e293b;
  }

  p {
    margin: 0 0 10px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 12px 0;
    padding-left: 22px;
  }

  li {
    margin-bottom: 5px;
  }

  /* Presentation Visual Cards */
  .section-banner {
    background-color: #0f172a;
    color: #ffffff;
    padding: 12px 18px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 22px 0 14px 0;
  }

  .section-banner h2 {
    margin: 0;
    padding: 0;
    border: none;
    color: #ffffff;
    font-size: 13pt;
  }

  .section-tab-badge {
    background-color: #00f0b4;
    color: #0f172a;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 8.5pt;
    text-transform: uppercase;
  }

  .grid-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
    page-break-inside: avoid;
  }

  .nav-box {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 16px;
    font-size: 9.5pt;
  }

  .nav-box-header {
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
    margin-bottom: 8px;
    text-transform: uppercase;
    font-size: 8.5pt;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ui-pill {
    display: inline-block;
    padding: 2px 6px;
    background-color: #e2e8f0;
    color: #0f172a;
    border-radius: 3px;
    font-family: monospace;
    font-size: 8.5pt;
    font-weight: 600;
    border: 1px solid #cbd5e1;
  }

  .say-box {
    background-color: #f0fdf4;
    border-left: 4px solid #16a34a;
    padding: 12px 16px;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 9.5pt;
    color: #14532d;
    page-break-inside: avoid;
  }

  .say-title {
    font-weight: 700;
    color: #15803d;
    text-transform: uppercase;
    font-size: 8pt;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
  }

  .wow-box {
    background-color: #fefce8;
    border-left: 4px solid #ca8a04;
    padding: 12px 16px;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 9.5pt;
    color: #713f12;
    page-break-inside: avoid;
  }

  .wow-title {
    font-weight: 700;
    color: #a16207;
    text-transform: uppercase;
    font-size: 8pt;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  th, td {
    padding: 7px 10px;
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

  .badge-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .dot-green { background-color: #10b981; }
  .dot-blue { background-color: #0284c7; }
  .dot-purple { background-color: #8b5cf6; }
  .dot-amber { background-color: #f59e0b; }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="badge-tag">Presentation Companion Guide</div>
  <h1>Career Pilot</h1>
  <div class="cover-subtitle">
    The Live Presentation Navigator & Visual Field Guide
  </div>
  <p style="font-size: 11pt; color: #334155; max-width: 680px;">
    An exact screen-by-screen navigation map designed to help you run the best possible live demo of Career Pilot in front of your class and professor. Explains what to see, where to look, how to click, and what to say under every single section.
  </p>

  <div class="cover-box">
    <strong>How to use this guide:</strong> Keep this PDF open on your phone or print it out as a two-page quick reference during your presentation. When you transition between tabs in Career Pilot, glance at the corresponding section to know exactly what visual elements to highlight and what high-impact words to say.
  </div>

  <div class="cover-meta">
    <div>
      <p><strong>Application URL:</strong> <code>http://127.0.0.1:5173/</code></p>
      <p><strong>Primary Navigation Tabs:</strong> Discover · Profile · Atlas · Pathways · Compare · Roadmap</p>
    </div>
    <div>
      <p><strong>Demo Duration:</strong> 8 to 12 minutes</p>
      <p><strong>Target Visuals:</strong> 3D Exploded Self & Career Universe Constellation</p>
    </div>
  </div>
</div>

<!-- SECTION MAP OVERVIEW TABLE -->
<h1>Quick Reference: Master Presentation Screen Map</h1>
<p>
Career Pilot is structured across six primary destinations in the top navigation bar. Here is the master map of where every visual feature lives and what each section accomplishes:
</p>

<table>
  <thead>
    <tr>
      <th style="width: 15%;">Header Tab</th>
      <th style="width: 25%;">What to Look For On-Screen</th>
      <th style="width: 35%;">Key Interaction During Demo</th>
      <th style="width: 25%;">Core Talking Point</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="ui-pill">Discover</span></td>
      <td>Hero banner, 3 Core Pillars, 9 Dimension Cards, Assessment Console.</td>
      <td>Click <em>"Resume Assessment"</em>. Show a Trade-Off dilemma or Allocation Slider. Click <em>"Why We Ask"</em>.</td>
      <td>"Adaptive self-discovery across 9 life dimensions, not a generic 10-question quiz."</td>
    </tr>
    <tr>
      <td><span class="ui-pill">My Profile</span></td>
      <td>3D Exploded Self Model, Floating Layer Plates, Inspector Dossier, Polarity Spectrum Gauges.</td>
      <td>Drag <em>Expansion Slider</em> (20% to 100%). Click a floating plate. Click <em>"Inspect Evidence"</em> modal.</td>
      <td>"Engineering exploded view of human capability with 100% deterministic traceability."</td>
    </tr>
    <tr>
      <td><span class="ui-pill">Career Atlas</span></td>
      <td>Interactive Career Universe Network graph, category tags, Occupational Detail Drawer.</td>
      <td>Click any career card below the graph. Watch the network lines light up from You to Job!</td>
      <td>"Authoritative labor databases (O*NET, ESCO, NCO) mapping stepping stones to target careers."</td>
    </tr>
    <tr>
      <td><span class="ui-pill">My Pathways</span></td>
      <td>Multi-hop routes (Direct, Bridge, Alternative), sequential milestone timelines, timeframes.</td>
      <td>Select target career from dropdown. Switch priority lenses (Speed, Cost, Risk). Save pathway.</td>
      <td>"How to actually get there from here through progressive stepping-stone roles."</td>
    </tr>
    <tr>
      <td><span class="ui-pill">Compare</span></td>
      <td>Side-by-side career ledger comparing salary, friction, weekly hours, autonomy, barrier.</td>
      <td>Click Priority Lenses: <em>"Max Autonomy"</em>, <em>"Max Salary"</em>, <em>"Low Barrier"</em>.</td>
      <td>"Evaluates real-world career trade-offs under shifting life priorities."</td>
    </tr>
    <tr>
      <td><span class="ui-pill">Roadmap</span></td>
      <td>Action Velocity meter, milestone buckets (Next 7 Days, Next 30 Days, Quarter 1).</td>
      <td>Check off a 7-day milestone box. Watch the action progress bar fill up immediately.</td>
      <td>"Turns distant aspirations into concrete, weekly portfolio and skill actions."</td>
    </tr>
  </tbody>
</table>

<!-- TAB 1: DISCOVER -->
<h1>Section 1: Under the "Discover" Tab (The Entry Salon)</h1>

<div class="section-banner">
  <h2>Header Tab: [ Discover ]</h2>
  <span class="section-tab-badge">URL: / (Default Landing)</span>
</div>

<p>
This is the front door of Career Pilot. When your laptop is connected to the projector, this is the screen your class will see first.
</p>

<div class="grid-2col">
  <div class="nav-box">
    <div class="nav-box-header">1. What You See on the Screen</div>
    <ul>
      <li><strong>Top Hero Header:</strong> Headline: <em>"Discover career paths aligned with who you actually are."</em></li>
      <li><strong>Progress Status Bar:</strong> Shows overall completion percentage (e.g. <em>58% Answered</em>).</li>
      <li><strong>Start / Resume Button:</strong> Large emerald button to launch questionnaire.</li>
      <li><strong>Three Pillars Row:</strong>
        <ul>
          <li><em>Adaptive Inquiry:</em> Dynamic branching without personality boxes.</li>
          <li><em>Authoritative Data:</em> Verified international job classifications.</li>
          <li><em>100% Private:</em> In-browser storage with zero tracking.</li>
        </ul>
      </li>
      <li><strong>Nine Discovery Areas Grid:</strong> 9 cards (Interests, Aptitudes, Skills, Work Style, Values, Lifestyle, Education, Constraints, Ambitions) with completion bars.</li>
    </ul>
  </div>

  <div class="nav-box">
    <div class="nav-box-header">2. Exactly How to Use It in Front of Class</div>
    <ol>
      <li><strong>Scroll slowly:</strong> Show the clean hero header and point out the 3 core pillars.</li>
      <li><strong>Point out the 9 Dimensions:</strong> Explain that real career guidance cannot just look at your major; it must evaluate all 9 areas of life.</li>
      <li><strong>Click the Emerald Button:</strong> Click <em>"Resume Assessment"</em> (or <em>"Start Assessment"</em>). The screen smoothly transitions into the <strong>Adaptive Assessment Console</strong>.</li>
      <li><strong>Demonstrate a Question Type:</strong>
        <ul>
          <li>Show a <em>Priority Ranking</em> (click up/down arrows).</li>
          <li>Or show a <em>Trade-Off</em> (Option A vs. Option B).</li>
          <li>Or show an <em>Allocation Slider</em> (balancing 100% of weekly work).</li>
        </ul>
      </li>
      <li><strong>Click "Why We Ask":</strong> Opens the drawer revealing the psychological reasoning.</li>
      <li><strong>Point to the Uncertainty Checkbox:</strong> <em>"I'm exploring this / not completely sure."</em></li>
    </ol>
  </div>
</div>

<div class="say-box">
  <div class="say-title">What to Say to the Class While Pointing Here</div>
  "Notice that Career Pilot doesn't start with a generic survey. It breaks human capability into nine grounded life dimensions—from what naturally fascinates you, to your financial runway, to how much autonomy you need. And during the assessment, you aren't forced into guessing. If you're unsure about something, Career Pilot treats uncertainty as a legitimate data point to explore later, rather than forcing a false assumption."
</div>

<div class="wow-box">
  <div class="wow-title">The Wow-Factor Interaction</div>
  Click the <strong>"Why We Ask"</strong> button on any question. The audience will see that every single question has a scientific rationale, immediately proving to your professor that this is a thoughtfully engineered system.
</div>

<!-- TAB 2: MY PROFILE -->
<h1>Section 2: Under the "My Profile" Tab (The Exploded Self)</h1>

<div class="section-banner">
  <h2>Header Tab: [ My Profile ]</h2>
  <span class="section-tab-badge">URL: /profile</span>
</div>

<p>
This is the signature centerpiece of Career Pilot. When you click <strong>My Profile</strong>, you have access to four internal tabs: <em>Exploded Self Model</em>, <em>Detailed Profile</em>, <em>Skills Inventory</em>, and <em>Trade-Offs</em>.
</p>

<h2>Sub-Section 2A: The Exploded Self Model (Tab 1)</h2>

<div class="grid-2col">
  <div class="nav-box">
    <div class="nav-box-header">What You See on the Canvas</div>
    <ul>
      <li><strong>Central Profile Core:</strong> Glowing center box with your name, "Profile Core", and verified signal count.</li>
      <li><strong>Six Floating Dimension Plates:</strong>
        <ul>
          <li><span class="badge-dot dot-green"></span><em>Interests & Curiosity</em></li>
          <li><span class="badge-dot dot-blue"></span><em>Aptitudes & Strengths</em></li>
          <li><span class="badge-dot dot-purple"></span><em>Skills Inventory</em></li>
          <li><span class="badge-dot dot-amber"></span><em>Work Preferences</em></li>
          <li><span class="badge-dot dot-green"></span><em>Core Values</em></li>
          <li><span class="badge-dot dot-blue"></span><em>Growth Vectors</em></li>
        </ul>
      </li>
      <li><strong>Top Controls Ribbon:</strong>
        <ul>
          <li><em>Expansion Slider:</em> Slider labeled 20% to 100%.</li>
          <li><em>3D View / 2D View Button:</em> Isometric tilt toggle.</li>
        </ul>
      </li>
      <li><strong>Right Inspector Dossier:</strong> Appears when a layer is clicked. Shows signals, confidence rating, and evidence buttons.</li>
    </ul>
  </div>

  <div class="nav-box">
    <div class="nav-box-header">Exactly How to Use It in Front of Class</div>
    <ol>
      <li><strong>Let the visual sink in:</strong> Pause for 2 seconds. The 3D layout looks striking on a projector screen.</li>
      <li><strong>Drag the Expansion Slider:</strong> Grab the slider and slowly move it from 40% to 90%. Watch all six layers expand outward in 3D space, then pull them back together.</li>
      <li><strong>Toggle 3D View:</strong> Click the <em>"3D View"</em> button to switch between orthographic 2D and isometric 3D tilt.</li>
      <li><strong>Click the "Aptitudes" Plate:</strong> Click the floating plate. It elevates forward with an emerald border.</li>
      <li><strong>Look at the Right Dossier:</strong> The right panel updates with your verified cognitive strengths.</li>
      <li><strong>Click "Inspect Evidence":</strong> Opens the audit modal showing the exact question prompt, your written answer, and the capture timestamp!</li>
    </ol>
  </div>
</div>

<div class="say-box">
  <div class="say-title">What to Say to the Class While Pointing Here</div>
  "In engineering and architecture, an 'exploded view' separates the parts of a complex machine so you can understand how everything connects. We did the exact same thing for a human's career profile. In the center is your core baseline, surrounded by six floating intelligence dimensions. And this isn't just animation—every plate is interactive. When I click 'Aptitudes' and click 'Inspect Evidence', the system shows the exact question I answered and why this trait was inferred. There is zero AI hallucination and 100% auditability."
</div>

<div class="wow-box">
  <div class="wow-title">The Wow-Factor Interaction</div>
  Clicking <strong>"Inspect Evidence"</strong>. Professors love auditability and deterministic traceability. Showing that every conclusion traces back to an actual user answer earns huge academic credibility.
</div>

<h2>Sub-Section 2B: Detailed Profile & Audit Report (Tab 2)</h2>
<p>
Click the <strong>"Detailed Profile"</strong> tab inside My Profile. This opens an executive monograph view:
</p>
<ul>
  <li><strong>Executive Summary Box:</strong> A clean synthesis paragraph explaining your career archetype.</li>
  <li><strong>Four Polarity Spectrum Gauges:</strong> Point to these horizontal balance meters:
    <ul>
      <li><em>Structure vs. Autonomy:</em> Shows whether you need playbooks or creative freedom.</li>
      <li><em>Deep Solo Focus vs. Collaboration:</em> Shows your social working preference.</li>
      <li><em>Empirical Data vs. Conceptual Ideas:</em> Shows analytical vs. abstract orientation.</li>
      <li><em>Predictable Monotasking vs. Dynamic Variety:</em> Shows your preferred daily pace.</li>
    </ul>
  </li>
  <li><strong>Practical Circumstances & Runway:</strong> Highlights your financial runway in months, geographic bounds, and weekly hours available.</li>
</ul>

<!-- TAB 3: CAREER ATLAS -->
<h1>Section 3: Under the "Career Atlas" Tab (Network Constellation)</h1>

<div class="section-banner">
  <h2>Header Tab: [ Career Atlas ]</h2>
  <span class="section-tab-badge">URL: /atlas</span>
</div>

<p>
This screen connects your personal profile to the real labor market. It features the second signature visualization: the <strong>Career Universe Network</strong>.
</p>

<div class="grid-2col">
  <div class="nav-box">
    <div class="nav-box-header">What You See on the Screen</div>
    <ul>
      <li><strong>Top Network Constellation Map:</strong>
        <ul>
          <li><em>Column 0 (Left):</em> <strong>YOU</strong> (Profile Origin node).</li>
          <li><em>Column 1:</em> <strong>Education</strong> nodes (B.S. CS, Bio, Bootcamp).</li>
          <li><em>Column 2:</em> <strong>Key Skills</strong> nodes (Distributed Systems, Pipelines).</li>
          <li><em>Column 3:</em> <strong>Bridge Roles</strong> (Entry stepping stones).</li>
          <li><em>Column 4 (Right):</em> <strong>Destination Careers</strong>.</li>
        </ul>
      </li>
      <li><strong>Network Filter Toolbar:</strong> Buttons for <em>All</em>, <em>Education</em>, <em>Skills</em>, <em>Occupations</em>, and Zoom controls.</li>
      <li><strong>Recommendation Category Badges:</strong>
        <ul>
          <li><span class="badge-dot dot-green"></span>Direct Matches (fits you right now)</li>
          <li><span class="badge-dot dot-blue"></span>Adjacent Matches (70% overlap)</li>
          <li><span class="badge-dot dot-purple"></span>Interdisciplinary (two curiosities combined)</li>
          <li><span class="badge-dot dot-amber"></span>Unexpected Discovery (unconventional fits)</li>
        </ul>
      </li>
      <li><strong>Career Cards Grid & Inspection Drawer:</strong> Cards with match percentage, salary range, and job family.</li>
    </ul>
  </div>

  <div class="nav-box">
    <div class="nav-box-header">Exactly How to Use It in Front of Class</div>
    <ol>
      <li><strong>Explain the 5-Column Network:</strong> Point to the top graph. Explain: <em>"On the left is You. Then Education, Skills, Bridge Roles, and Destination Occupations."</em></li>
      <li><strong>Click an Occupation Card Below:</strong> Scroll down slightly and click a career card (like <em>Distributed Systems Engineer</em> or <em>Bioinformatics Analyst</em>).</li>
      <li><strong>WATCH THE NETWORK ILLUMINATE:</strong> Point to the top graph. The exact lines connecting You → Education → Skills → Bridge Role → Target Career light up in bright emerald and cyan!</li>
      <li><strong>Inspect the Right Drawer:</strong> The occupational drawer opens on the right.
        <ul>
          <li>Show the <strong>Salary percentiles</strong> (10th percentile entry to 90th percentile veteran).</li>
          <li>Toggle between <strong>US ($)</strong>, <strong>EU (€)</strong>, and <strong>India (₹)</strong> currency.</li>
          <li>Point out the <strong>Transferable Skills</strong> list.</li>
        </ul>
      </li>
    </ol>
  </div>
</div>

<div class="say-box">
  <div class="say-title">What to Say to the Class While Pointing Here</div>
  "Notice that Career Pilot doesn't just recommend a job title; it maps the structural journey. Right here in the Career Universe Network, when I click on 'Bioinformatics Analyst', the graph dynamically illuminates the entire path. It shows the computational biology education required, the algorithmic pipeline skills, and the intermediate bridge role that gets you there. Every recommendation is grounded in international taxonomies like O*NET and ESCO."
</div>

<div class="wow-box">
  <div class="wow-title">The Wow-Factor Interaction</div>
  Clicking on an occupation card and watching the network graph automatically highlight the multi-hop trajectory. This immediately proves that Career Pilot understands career progression as a series of stepping stones rather than a blind leap.
</div>

<!-- TAB 4: MY PATHWAYS -->
<h1>Section 4: Under the "My Pathways" Tab (Route Generator)</h1>

<div class="section-banner">
  <h2>Header Tab: [ My Pathways ]</h2>
  <span class="section-tab-badge">URL: /pathways</span>
</div>

<p>
Where the Atlas shows what jobs exist, <strong>My Pathways</strong> shows the step-by-step itinerary to reach any chosen occupation.
</p>

<div class="grid-2col">
  <div class="nav-box">
    <div class="nav-box-header">What You See on the Screen</div>
    <ul>
      <li><strong>Target Career Dropdown:</strong> Lets you choose which destination career to generate routes for.</li>
      <li><strong>Telemetry Bar:</strong> Shows verified career nodes, graph edges, and validated routes.</li>
      <li><strong>Route Category Cards:</strong>
        <ul>
          <li><em>Direct Linear Pathway:</em> Traditional college to junior role.</li>
          <li><em>Skill-Based Bridge Pathway:</em> Portfolio-first stepping stone.</li>
          <li><em>Alternative Education Pathway:</em> Self-directed or bootcamp transition.</li>
          <li><em>Interdisciplinary Pathway:</em> Cross-domain hybrid route.</li>
        </ul>
      </li>
      <li><strong>Sequential Milestone Cards:</strong> Step-by-step cards showing phase duration (e.g. <em>6–12 months</em>), required skills, and potential transition risks.</li>
      <li><strong>Action Buttons:</strong> <em>"Save Pathway"</em> and <em>"Compare Pathway"</em>.</li>
    </ul>
  </div>

  <div class="nav-box">
    <div class="nav-box-header">Exactly How to Use It in Front of Class</div>
    <ol>
      <li><strong>Change the Target Occupation:</strong> Use the dropdown to select a career (e.g. <em>Cloud Security Architect</em>).</li>
      <li><strong>Show the Route Options:</strong> Point out that there is never just one way into a career. Show the <em>Direct Route</em> vs. the <em>Skill-Based Bridge Route</em>.</li>
      <li><strong>Walk through Phase 1 and Phase 2:</strong> Show the milestone steps: <em>"Phase 1: Build foundational key-value store prototype (3 months). Phase 2: Transition into Junior Systems Engineer (12 months)."</em></li>
      <li><strong>Click "Save Pathway":</strong> Shows the badge update indicating it is saved to your personal collection.</li>
    </ol>
  </div>
</div>

<div class="say-box">
  <div class="say-title">What to Say to the Class While Pointing Here</div>
  "Most career advice tells you: 'Just apply for jobs.' Career Pilot generates realistic transit itineraries. For any target career, it generates multiple distinct routes—whether you want a traditional academic path, a portfolio-driven bridge role, or an interdisciplinary transition. Each step has realistic time estimates and flags potential transition risks."
</div>

<!-- TAB 5: COMPARE -->
<h1>Section 5: Under the "Compare" Tab (Trade-Off Simulator)</h1>

<div class="section-banner">
  <h2>Header Tab: [ Compare ]</h2>
  <span class="section-tab-badge">URL: /compare</span>
</div>

<p>
This section allows side-by-side evaluation of up to three careers with dynamic priority simulation.
</p>

<div class="grid-2col">
  <div class="nav-box">
    <div class="nav-box-header">What You See on the Screen</div>
    <ul>
      <li><strong>Side-by-Side Ledger:</strong> 2 to 3 columns displaying selected target careers side by side.</li>
      <li><strong>Direct Attribute Comparison:</strong>
        <ul>
          <li>Salary trajectories (entry to veteran).</li>
          <li>Weekly working hours and pace.</li>
          <li>Autonomy and creative freedom score.</li>
          <li>Barrier to entry and credential requirements.</li>
          <li>Remote work viability.</li>
        </ul>
      </li>
      <li><strong>Priority Lens Simulator Bar:</strong>
        Pill buttons for: <em>Balanced Baseline</em>, <em>Max Compensation</em>, <em>Max Autonomy</em>, <em>Max Remote</em>, <em>Low Entry Barrier</em>, and <em>Values & Impact</em>.</li>
    </ul>
  </div>

  <div class="nav-box">
    <div class="nav-box-header">Exactly How to Use It in Front of Class</div>
    <ol>
      <li><strong>Point to the Side-by-Side Columns:</strong> Show Career A vs. Career B.</li>
      <li><strong>Click "Max Compensation" Lens:</strong> Watch the comparison scores re-order with highest salary winning.</li>
      <li><strong>Click "Max Autonomy" Lens:</strong> Watch the rankings re-balance to favor strategic freedom.</li>
      <li><strong>Explain the Trade-Off:</strong> Show that the highest paying job often has the highest operational friction, while the most autonomous job might have a longer runway requirement.</li>
    </ol>
  </div>
</div>

<div class="say-box">
  <div class="say-title">What to Say to the Class While Pointing Here</div>
  "Every career choice involves trade-offs. You cannot have the highest starting salary, zero stress, total remote freedom, and no entry barrier all at once. In the Compare studio, students can test different life priorities. When I click 'Max Autonomy', the simulation shows which career fits best; when I click 'Low Barrier', the ranking updates instantly."
</div>

<!-- TAB 6: ROADMAP -->
<h1>Section 6: Under the "Roadmap" Tab (Execution Board)</h1>

<div class="section-banner">
  <h2>Header Tab: [ Roadmap ]</h2>
  <span class="section-tab-badge">URL: /roadmap</span>
</div>

<p>
This final tab bridges long-term dreams with immediate weekly execution.
</p>

<div class="grid-2col">
  <div class="nav-box">
    <div class="nav-box-header">What You See on the Screen</div>
    <ul>
      <li><strong>Action Velocity Meter:</strong> Shows completed vs. total action items (e.g. <em>1 of 5 Completed - 20%</em>).</li>
      <li><strong>Three Time Horizon Buckets:</strong>
        <ul>
          <li><em>Next 7 Days:</em> Immediate small wins (reading a paper, auditing a repo).</li>
          <li><em>Next 30 Days:</em> Tangible projects (building an MVP, setting up tools).</li>
          <li><em>Quarter 1 (90 Days):</em> Substantial milestones (completing a verified artifact).</li>
        </ul>
      </li>
      <li><strong>Interactive Checkboxes:</strong> Square check buttons next to each task.</li>
      <li><strong>Print Plan Button:</strong> Clean printer-formatted export.</li>
    </ul>
  </div>

  <div class="nav-box">
    <div class="nav-box-header">Exactly How to Use It in Front of Class</div>
    <ol>
      <li><strong>Scroll through the 7-day items:</strong> Show that these are concrete, doable tasks rather than vague advice.</li>
      <li><strong>Click a Checkbox:</strong> Click a box on a task. Watch the checkmark appear and the <em>Action Velocity meter</em> fill up live on the screen!</li>
      <li><strong>Point to the Print Button:</strong> Mention that students can print their weekly sprint plan and tape it to their desk.</li>
    </ol>
  </div>
</div>

<div class="say-box">
  <div class="say-title">What to Say to the Class While Pointing Here</div>
  "Career planning without immediate action is just wishful thinking. In the Roadmap view, Career Pilot breaks long-term career transitions down into 7-day, 30-day, and quarterly milestones. Checking off items gives you real velocity, turning a distant professional goal into a series of achievable weekly projects."
</div>

<!-- PRINTABLE CHEAT SHEET -->
<h1>Part VII: Master Presenter Cheat Sheet (Print & Keep Near Laptop)</h1>
<p>
Print this single page and place it beside your laptop while presenting. It gives you the exact 10-minute flow at a glance:
</p>

<table>
  <thead>
    <tr>
      <th style="width: 12%;">Minute</th>
      <th style="width: 22%;">Tab to Click</th>
      <th style="width: 36%;">Action to Perform on Screen</th>
      <th>Key Phrase to Say</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>0:00 – 1:30</strong></td>
      <td><span class="ui-pill">Discover</span></td>
      <td>Stand in front. Ask hand-raising question. Show landing page.</td>
      <td>"Traditional 10-question quizzes put us in silly 4-letter boxes."</td>
    </tr>
    <tr>
      <td><strong>1:30 – 3:30</strong></td>
      <td><span class="ui-pill">Discover</span> (Console)</td>
      <td>Click <em>"Resume Assessment"</em>. Show Trade-Off & Allocation slider. Click <em>"Why We Ask"</em>.</td>
      <td>"Evaluates 9 life dimensions; uncertainty is treated as valuable data."</td>
    </tr>
    <tr>
      <td><strong>3:30 – 6:00</strong></td>
      <td><span class="ui-pill">My Profile</span></td>
      <td>Drag <em>Expansion Slider</em> in 3D. Click <em>Aptitudes</em> plate. Click <em>"Inspect Evidence"</em>.</td>
      <td>"Architectural exploded view of capability with 100% deterministic auditability."</td>
    </tr>
    <tr>
      <td><strong>6:00 – 8:30</strong></td>
      <td><span class="ui-pill">Career Atlas</span></td>
      <td>Point to network graph. Click an occupation card below. Watch path light up!</td>
      <td>"Grounded in O*NET/ESCO databases, mapping stepping stones to target careers."</td>
    </tr>
    <tr>
      <td><strong>8:30 – 10:00</strong></td>
      <td><span class="ui-pill">Compare</span> & <span class="ui-pill">Roadmap</span></td>
      <td>Click <em>"Max Autonomy"</em> lens in Compare. Switch to Roadmap, check off an action box.</td>
      <td>"Simulates real trade-offs and converts goals into concrete 7-day milestones."</td>
    </tr>
    <tr>
      <td><strong>10:00+</strong></td>
      <td><span class="ui-pill">Q&A</span></td>
      <td>Step back, smile, invite questions from professor and classmates.</td>
      <td>"Career Pilot gives you a compass and an atlas to navigate your own path."</td>
    </tr>
  </tbody>
</table>

</body>
</html>
"""

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    html_file = os.path.join(project_root, "Career_Pilot_Live_Presentation_Navigator_and_Visual_Field_Guide.html")
    pdf_file = os.path.join(project_root, "Career_Pilot_Live_Presentation_Navigator_and_Visual_Field_Guide.pdf")

    # 1. Write HTML File
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"HTML navigator written to: {html_file}")

    # 2. Compile to PDF using Microsoft Edge headless
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
        print(f"SUCCESS! Presentation Navigator PDF created: {pdf_file} ({pdf_size_kb:.1f} KB)")
    else:
        print(f"PDF creation failed: {result.stderr}")

if __name__ == "__main__":
    main()
