# SwachhLens

**AI-powered waste detection and civic hazard monitoring system.**

SwachhLens turns citizen waste reports into explainable, prioritized and actionable municipal cleanup decisions. It is a Decision Support System: the engine recommends, and the municipal authority stays in control of the final decision.

> Built for **TechNova Round 2**.

## The problem
Waste reports from citizens are scattered, duplicated (one pile can generate 10-20 complaints) and unprioritized, so authorities cannot tell which incident needs action first.

## Our solution
1. **Capture** - a citizen photographs the waste; GPS and time are attached.
2. **Analyze** - AI modules classify the waste and estimate its approximate volume.
3. **Cluster** - duplicate reports of the same pile are merged into one incident.
4. **Prioritize** - an explainable, multi-factor priority score ranks every incident.
5. **Assign** - the best-matched field crew is recommended to the officer.
6. **Verify** - an after-photo from the crew closes the loop with AI clearance verification.

## Key features
- 8-class waste classification with hazard ratings
- 4-signal geo-spatial duplicate clustering
- Explainable priority scoring and smart resource matching
- Three interfaces: Citizen App, Municipal Command Center, Field Crew App
- GIS map, 3D digital-twin city view, audit trail and "Ask SwachhLens" assistant
- Guided 10-step end-to-end walkthrough

## Project structure
```
SwachhLens/
├── index.html            Main page (open this to run the demo)
├── css/style.css         Design system and styles
├── js/                   Application modules
│   ├── data-store.js         Sample municipal datasets
│   ├── ai-pipeline.js        AI pipeline and decision engine
│   ├── auth.js               Role-based login
│   ├── citizen-app.js        Citizen app
│   ├── municipal-portal.js   Command center portal
│   ├── field-crew-app.js     Field crew app
│   ├── city-3d-map.js        3D city GIS view
│   ├── walkthrough.js        Scripted walkthrough
│   ├── ai-assistant.js       "Ask SwachhLens" assistant
│   ├── intro-3d.js           3D globe intro
│   └── app.js                Main controller
├── docs/                 Full project documentation
├── architecture/         System architecture document
└── presentation/         Project presentation (PPT)
```

## How to run
No installation needed.
1. Download or clone this repository.
2. Open `index.html` in a web browser (Chrome recommended).
3. An internet connection is needed to load the map, font and 3D libraries.

## Tech stack
HTML5, CSS3, JavaScript (vanilla), Leaflet (GIS map), Three.js (3D), Lucide icons.

## Documents
- [Full documentation](docs/SwachhLens_Documentation.docx)
- [System architecture](architecture/SwachhLens_System_Architecture.docx)
- [Presentation](presentation/SwachhLens_PPT.pptx)

## Note
This repository contains the working prototype. AI results in the demo come from a simulated pipeline with sample data; the full production design (mobile app, backend and trained models) is described in the documentation.

## Team
Add your team name and members here.
