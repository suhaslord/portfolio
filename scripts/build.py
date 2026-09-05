#!/usr/bin/env python3
"""Build committed static pages. Python standard library only."""
from pathlib import Path
import html
import hashlib
import json
import math

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://suhaslord.github.io/portfolio/"
DATA = json.loads((ROOT / "content/projects.json").read_text())
E = html.escape

def revision(path):
    """Keep repeat visitors from combining fresh HTML with cached assets."""
    return hashlib.sha256((ROOT/path).read_bytes()).hexdigest()[:10]

def nav(prefix="", active="", is_home=False):
    home = prefix + "index.html"
    links = [("Home", home), ("Selected work", home+"#work"), ("All work", home+"#all-work"), ("About", home+"#about"), ("Résumé", prefix+"resume.html"), ("GitHub", "https://github.com/suhaslord")]
    items = "".join(f'<a href="{url}"' + (' aria-current="page"' if label == active else '') + f'>{label}</a>' for label, url in links)
    return f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header{' is-over-hero' if is_home else ''}"><nav class="nav" aria-label="Primary">
<a class="brand" href="{home}" aria-label="Suhas Beemineni"><span class="brand-full">Suhas Beemineni</span><span class="brand-short" aria-hidden="true">Suhas B.</span></a>
<div class="nav-dock"><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links"><span class="menu-symbol" aria-hidden="true"></span><span class="menu-label">Menu</span></button><a class="button dock-work" href="{home}#work">Selected work ↗</a>
<div class="nav-links" id="nav-links">{items}<a class="nav-contact" href="{home}#contact">Get in touch ↗</a></div></div>
<div class="header-actions"><a class="button header-resume" href="{prefix}resume.html">Résumé ↗</a><button class="theme-toggle" type="button" aria-label="Dark theme" aria-pressed="false" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.2A8.7 8.7 0 0 1 9.8 4 8.7 8.7 0 1 0 20 14.2Z"/></svg></button></div>
</nav></header>'''

def footer(prefix=""):
    return f'''<footer class="site-footer wrap"><span><span class="footer-brand">Suhas Beemineni</span><br>© 2026 · Aerospace &amp; AI</span><div><a href="https://github.com/suhaslord" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="{prefix}resume.html">Résumé ↗</a><a href="mailto:suhas.aug20@gmail.com">Contact ↗</a></div></footer>'''

def page(path, title, description, body, active=""):
    prefix = "/portfolio/" if path == "404.html" else ("../" if "/" in path else "")
    canonical = BASE + ("" if path == "index.html" else path)
    kind = "website" if path == "index.html" else "article"
    structured = {"@context":"https://schema.org", "@type":"Person", "name":"Suhas Beemineni", "url":BASE,
                  "sameAs":["https://github.com/suhaslord"], "description":"Student building aerospace simulations and reliable AI systems."}
    extras = ''
    if path == "index.html":
        extras += '<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"}}</script>'
    if path == "index.html":
        extras += f'<script type="module" src="js/voyager.js?v={revision("js/voyager.js")}" defer></script>'
    elif path == "work/aegisland.html":
        extras += f'<script src="../js/aegis.js?v={revision("js/aegis.js")}" defer></script>'
    markup = f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)}</title><meta name="description" content="{E(description, quote=True)}">
<meta name="author" content="Suhas Beemineni"><meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff"><link rel="canonical" href="{canonical}">
<meta property="og:type" content="{kind}"><meta property="og:title" content="{E(title, quote=True)}">
<meta property="og:description" content="{E(description, quote=True)}"><meta property="og:url" content="{canonical}">
<meta property="og:image" content="{BASE}assets/og/portfolio.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Suhas Beemineni — aerospace and AI portfolio, over NASA Earthrise photography"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="{prefix}assets/fonts/space-regular.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="{prefix}assets/fonts/lora.woff" as="font" type="font/woff" crossorigin>
<script src="{prefix}js/theme.js?v={revision('js/theme.js')}"></script><link rel="stylesheet" href="{prefix}css/portfolio.css?v={revision('css/portfolio.css')}">
<script type="application/ld+json">{json.dumps(structured)}</script>{extras}
</head><body>{nav(prefix, active, path == "index.html")}{body}{footer(prefix)}<script src="{prefix}js/portfolio.js?v={revision('js/portfolio.js')}" defer></script></body></html>'''
    (ROOT / path).write_text(markup)

def project_link(p):
    return f'<a class="text-link" href="work/{p["slug"]}.html">Read the case study <span aria-hidden="true">↗</span><span class="sr-only">: {E(p["name"])}</span></a>'

def home():
    a, v, b = DATA["projects"]
    featured = f'''<article class="featured-project">
<a class="featured-image" href="work/aegisland.html" aria-label="Read the AegisLand case study"><img src="{a["image"]}" alt="{a["alt"]}" width="900" height="840" loading="lazy"></a>
<div class="featured-copy"><p class="project-type">{a["category"]}</p><h3>{a["name"]}</h3><p class="project-hook">{a["headline"]}</p>
<p>{E(a["summary"])}</p><p class="result-note">The early synthetic result was promising. The harder camera holdout exposed the limits.</p>
{project_link(a)}<p class="caption">Independent research. Simulation only.</p></div></article>'''
    pair = ""
    for p in (v, b):
        pair += f'''<article class="project"><a class="project-image {p["slug"]}-image" href="work/{p["slug"]}.html" aria-label="Read the {E(p["name"])} case study">
<img src="{p["image"]}" alt="{E(p["alt"])}" width="{p["image_width"]}" height="{p["image_height"]}" loading="lazy"></a><p class="project-type">{p["category"]}</p>
<h3>{p["name"]}</h3><p>{E(p["summary"])}</p>{project_link(p)}</article>'''
    body = (ROOT/"templates/home.html").read_text().replace("{{featured}}", featured).replace("{{project_pair}}", pair)
    page("index.html", "Suhas Beemineni | Aerospace & AI", "Student building aerospace simulations and reliable AI systems. Explore AegisLand, merged Voyager contributions, and AbstainBench.", body)

def outbound(link):
    external = link["url"].startswith("https://")
    attrs = ' target="_blank" rel="noopener noreferrer"' if external else ""
    return f'<a href="{E(link["url"],quote=True)}"{attrs}>{E(link["label"])} <span aria-hidden="true">↗</span></a>'

def case(p):
    actions = "".join(outbound(x) for x in p["links"])
    sections = ""
    for s in p["sections"]:
        paragraphs = "".join(f'<p>{E(t)}</p>' for t in s["paragraphs"])
        if s["title"] == "The harder test":
            rows = "".join(f'<tr><th scope="row">{E(r[0])}</th><td>{E(r[1])}</td><td>{E(r[2])}</td></tr>' for r in p["results"])
            paragraphs += f'<div class="table-scroll" role="region" aria-label="Phase 10R results" tabindex="0"><table><caption>Selected Phase 10R results</caption><thead><tr><th scope="col">Measure</th><th scope="col">Result</th><th scope="col">Gate</th></tr></thead><tbody>{rows}</tbody></table></div><p>Both p95 improvement gates also failed. The complete protocol and result record are linked below.</p>'
        sections += f'<section class="case-section"><h2>{E(s["title"])}</h2>{paragraphs}</section>'
    if p["slug"] == "voyager":
        sections += '''<section class="case-section" id="illustration"><h2>About the flyby illustration</h2><p>The homepage draws a hyperbolic trajectory in a Jupiter-centered frame. Changing the closest-approach radius changes the eccentricity and total turning angle. Distances are to the planet's center.</p><p>The illustrative model fixes Jupiter's gravitational parameter at 126,686,531.9 km³/s² and the incoming excess speed at 16 km/s. Jupiter's GM and 71,492 km equatorial radius follow the <a href="https://ssd.jpl.nasa.gov/sats/phys_par/">JPL gravitational-parameter table</a> and <a href="https://ssd.jpl.nasa.gov/planets/phys_par.html">planetary physical parameters</a>. It uses e = 1 + rₚv∞²/μ and δ = 2 arcsin(1/e). The drawing clips the trajectory to the visible area; the planet and path use the same distance scale.</p><p>Playback traces the shape at an illustrative pace, not physical elapsed time. This is a teaching graphic, separate from the SPICE-based Voyager work.</p></section>'''
    if p["slug"] == "aegisland":
        sections += '''<section class="case-section case-exhibit" id="interactive-exhibit"><h2>See the ambiguity</h2><p>This small educational model shows why a landing-marker estimate can become difficult when viewpoint and visibility change. Adjust the camera angle or cover part of the marker. The scene explains the geometry; it is separate from the measured Phase 10R results above.</p><div class="aegis-exhibit"><div class="aegis-stage"><canvas id="aegisCanvas" width="720" height="480" aria-hidden="true"></canvas><div class="aegis-stage-label">Illustrative geometry · not flight data</div></div><div class="aegis-controls"><div class="aegis-control"><label for="aegisAngle">Camera angle <output id="aegisAngleValue">18°</output></label><input id="aegisAngle" type="range" min="0" max="70" step="1" value="18" aria-describedby="aegisExplain"></div><div class="aegis-control"><label for="aegisOcclusion">Marker occlusion <output id="aegisOcclusionValue">12%</output></label><input id="aegisOcclusion" type="range" min="0" max="80" step="1" value="12" aria-describedby="aegisExplain"></div><p id="aegisExplain" class="aegis-reading" role="status">Mostly visible: the marker outline is easy to interpret.</p><button type="button" class="quiet-button" id="aegisReset">Reset view</button></div></div><p class="caption">Teaching model only. It does not replay AegisLand measurements, replace a camera model, or change the published holdout result.</p></section>'''
    sources = "".join(f"<li>{outbound(x)}</li>" for x in p["sources"])
    body = f'''<main id="main"><header class="case-header wrap"><a class="back-link" href="../index.html#work">← Selected work</a><p class="project-type">{p["category"]}</p><h1>{p["name"]}</h1><p class="case-lede">{E(p["headline"])}</p><div class="case-actions">{actions}</div></header>
<figure class="case-image wrap"><img src="../{p["image"]}" alt="{E(p["alt"])}" width="{p["image_width"]}" height="{p["image_height"]}"><figcaption>{E(p["caption"])}</figcaption></figure>
<div class="case-layout wrap"><aside class="case-meta"><dl><dt>My role</dt><dd>{E(p["role"])}</dd><dt>Tools</dt><dd>{E(p["stack"])}</dd><dt>Status</dt><dd>{E(p["status"])}</dd></dl><p class="caption">Checked September 5, 2026</p></aside><article class="case-body">{sections}<section class="case-section sources"><h2>Code &amp; evidence</h2><ul>{sources}</ul></section></article></div>
<div class="case-end wrap"><a class="text-link" href="../index.html#work">← All selected work</a><a class="text-link" href="mailto:suhas.aug20@gmail.com">Contact ↗</a></div></main>'''
    page(f'work/{p["slug"]}.html', p["name"]+" | Suhas Beemineni", p["summary"], body)

def resume():
    entries = ""
    for p in DATA["projects"]:
        entries += f'''<section class="resume-entry"><h2>{p["name"]}</h2><p class="resume-role">{p["role"]}</p><p>{E(p["summary"])}</p><p>{E(p["status"])}</p><a href="work/{p["slug"]}.html">Project details and evidence ↗</a></section>'''
    body = f'''<main id="main" class="resume wrap"><header class="case-header"><h1>Suhas Beemineni</h1><p class="case-lede">Student building software for aerospace and AI.</p><div class="case-actions"><a href="mailto:suhas.aug20@gmail.com">suhas.aug20@gmail.com</a><a href="https://github.com/suhaslord">GitHub ↗</a><a href="suhas-beemineni.pdf">Download PDF ↓</a><button class="quiet-button print-button" type="button">Print résumé</button></div></header>
<div class="resume-layout"><aside><h2>Focus</h2><p>Aerospace simulation<br>Perception reliability<br>Language-model evaluation</p><h2>Tools</h2><p>Python, JavaScript, SPICE, Elodin, computer vision, PX4/Gazebo, WebLLM</p><h2>Education</h2><p>High school student<br>River Islands High School</p></aside><article><h2 class="resume-section-title">Selected engineering work</h2>{entries}<section class="resume-entry"><h2>Seagulls / OpenStage</h2><p class="resume-role">AI engineering intern</p><p>Work on model routing, memory boundaries, tracing, guardrails, and QA. Focus on how assistant behavior holds up through real product paths.</p></section></article></div></main>'''
    page("resume.html", "Résumé | Suhas Beemineni", "Suhas Beemineni's selected engineering work, open-source contributions, and projects.", body, "Résumé")

def echo():
    body = '''<main id="main"><header class="case-header wrap"><a class="back-link" href="../index.html#about">← Portfolio</a><p class="project-type">Creative coding</p><h1>ECHO / FIELD</h1><p class="case-lede">A browser instrument shaped by sound and motion.</p><div class="case-actions"><a href="https://suhaslord.github.io/ECHO-FIELD/" target="_blank" rel="noopener noreferrer">Open the experiment ↗</a></div></header><figure class="case-image wrap"><img src="../assets/echo/cover.jpg" alt="ECHO / FIELD generative visual field" width="1600" height="900"><figcaption>Generative visual experiment using canvas and audio input.</figcaption></figure><article class="narrow section"><h2>A different kind of feedback loop</h2><p>I built ECHO / FIELD as a creative coding experiment. Microphone input and motion change a live visual field in the browser.</p><p>It gave me a way to explore interaction, sound, and rendering outside my simulation work.</p><a class="text-link" href="../index.html#about">← Back to the portfolio</a></article></main>'''
    page("work/echo-field.html", "ECHO / FIELD | Suhas Beemineni", "A creative coding experiment with canvas, audio, and motion.", body)

def fallback_flyby():
    mu, speed, rp, radius = 126686531.9, 16, 180000, 71492
    e = 1 + rp * speed**2 / mu
    p = rp * (1 + e)
    limit = math.acos(-1/e) * .96
    scale, cx, cy, rotation = .00079, 260, 218, -.50
    coords = []
    for i in range(301):
        theta = -limit + 2*limit*i/300
        r = p/(1+e*math.cos(theta))
        x,y = r*math.cos(theta), r*math.sin(theta)
        coords.append(f'{cx+scale*(x*math.cos(rotation)-y*math.sin(rotation)):.2f},{cy+scale*(x*math.sin(rotation)+y*math.cos(rotation)):.2f}')
    path = "M"+" L".join(coords)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440"><style>.line{{stroke:#694183}} .planet{{stroke:#8a949c}} @media(prefers-color-scheme:dark){{.line{{stroke:#dfbafa}}.planet{{stroke:#83909a}}}}</style><g fill="none" class="planet" stroke-width="1"><circle cx="{cx}" cy="{cy}" r="{radius*scale}"/>'''
    for ratio in (.25,.55,.82):
        svg += f'<ellipse cx="{cx}" cy="{cy}" rx="{radius*scale*ratio}" ry="{radius*scale}"/><ellipse cx="{cx}" cy="{cy}" rx="{radius*scale}" ry="{radius*scale*ratio}"/>'
    svg += f'</g><path d="{path}" class="line" fill="none" stroke-width="2"/></svg>'
    (ROOT/"assets/flyby.svg").write_text(svg)

def main():
    home()
    for p in DATA["projects"]: case(p)
    resume()
    echo()
    fallback_flyby()
    page("404.html", "Page not found | Suhas Beemineni", "Return to Suhas Beemineni's portfolio.", '<main id="main" class="not-found wrap"><p class="eyebrow">404</p><h1>This page has moved.</h1><p>You can find my projects back on the portfolio.</p><a class="button primary" href="/portfolio/">Back to portfolio ↗</a></main>')
    paths = ["", "resume.html"]+[f'work/{p["slug"]}.html' for p in DATA["projects"]]+["work/echo-field.html"]
    sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+"".join(f'<url><loc>{BASE+p}</loc></url>' for p in paths)+'</urlset>'
    (ROOT/"sitemap.xml").write_text(sitemap)
    (ROOT/"robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n")
    print("Built homepage, three case studies, résumé, 404, sitemap, and flyby fallback.")

if __name__ == "__main__": main()
