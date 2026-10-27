#!/usr/bin/env python3
"""Build the static portfolio. Python standard library only."""
from pathlib import Path
import hashlib
import html
import json

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://suhaslord.github.io/portfolio/'
DATA = json.loads((ROOT / 'content/projects.json').read_text())
E = html.escape


def rev(path):
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()[:10]


def navigation(prefix='', home=False):
    href = prefix + 'index.html'
    return f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="brand magnetic" href="{href}"><span class="brand-mark" aria-hidden="true">©</span><span>Suhas Beemineni</span></a><nav class="desktop-nav" aria-label="Primary"><a class="magnetic" href="{href}#work">Work</a><a class="magnetic" href="{href}#about">About</a><a class="magnetic" href="#contact">Contact</a></nav></header>
<button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="menu-panel"><span></span><span></span></button>
<div class="menu-scrim" aria-hidden="true"></div><aside class="menu-panel" id="menu-panel" data-lenis-prevent role="dialog" aria-modal="true" aria-label="Navigation" aria-hidden="true" inert><div class="menu-curve" aria-hidden="true"></div><p class="menu-label">Navigation</p><nav><a class="magnetic" href="{href}">Home</a><a class="magnetic" href="{href}#work">Work</a><a class="magnetic" href="{href}#about">About</a><a class="magnetic" href="#contact">Contact</a></nav><div class="menu-bottom"><a href="{prefix}resume.html">Résumé</a><a href="https://github.com/suhaslord" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></aside><div class="page-transition" aria-hidden="true"><span>Hello</span><div class="transition-curve"></div></div>'''


def footer(prefix=''):
    return f'''<section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="contact-curve" aria-hidden="true"></div><div class="contact-inner wrap"><h2 class="contact-title" id="contact-title">Let's make<br>something useful.</h2><div class="contact-line"><a class="circle-button magnetic" href="mailto:suhas.aug20@gmail.com"><span>Get in touch</span><span aria-hidden="true">↗</span></a><div class="contact-details"><a class="outline-link" href="mailto:suhas.aug20@gmail.com">suhas.aug20@gmail.com</a></div></div></div><footer class="site-footer"><span class="copyright">© 2026 Suhas Beemineni</span><nav aria-label="Links"><a href="https://github.com/suhaslord" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="{prefix}resume.html">Résumé</a><a href="{prefix}index.html#work">Work</a></nav></footer></section>'''


def page(path, title, description, body, home=False):
    prefix = '../' if '/' in path else ''
    canonical = BASE + ('' if home else path)
    person = json.dumps({'@context': 'https://schema.org', '@type': 'Person', 'name': 'Suhas Beemineni', 'url': BASE, 'sameAs': ['https://github.com/suhaslord'], 'description': 'Student interested in electrical engineering, AI, and robotics.'})
    vendors = ''.join(f'<script src="{prefix}js/vendor/{name}" defer></script>' for name in ['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js'])
    document = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(title)}</title><meta name="description" content="{E(description)}"><meta name="author" content="Suhas Beemineni"><meta name="theme-color" content="{'#85898a' if home else '#f7f7f5'}"><meta name="color-scheme" content="light"><link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(description)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{BASE}assets/results/clevr-training.png"><meta property="og:image:alt" content="FiLM training results from my UC Santa Cruz research"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="{prefix}assets/fonts/space-regular.woff" as="font" type="font/woff" crossorigin><link rel="stylesheet" href="{prefix}css/site.css?v={rev('css/site.css')}"><script type="application/ld+json">{person}</script><noscript><style>.menu-toggle{{display:none}}.desktop-nav{{display:flex!important;gap:16px}}.site-header{{padding-right:24px}}.reveal{{opacity:1;transform:none}}</style></noscript></head><body class="{'home' if home else 'interior'}">{navigation(prefix, home)}{body}{footer(prefix)}<script src="{prefix}js/site.js?v={rev('js/site.js')}" defer></script></body></html>'''
    document = document.replace(f'<script src="{prefix}js/site.js?', vendors + f'<script src="{prefix}js/site.js?')
    document = document.replace(f'<link rel="preload" href="{prefix}assets/fonts/space-regular.woff" as="font" type="font/woff" crossorigin>', '')
    dest = ROOT / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(document)


def home():
    rows = []
    panes = []
    for i, p in enumerate(DATA['projects']):
        preview = ''
        if p.get('image'):
            preview = f' data-preview="{p["image"]}" data-preview-index="{i}" data-alt="{E(p["alt"])}"'
            if p.get('logo'):
                preview += ' data-logo="true"'
        thumb = f'<span class="work-thumb{ " is-logo" if p.get("logo") else ""}"><img src="{p["image"]}" alt="{E(p["alt"])}" loading="lazy"></span>' if p.get('image') else ''
        rows.append(f'''<a class="work-row" href="work/{p['slug']}.html"{preview}>{thumb}<h3>{E(p['name'])}</h3><p>{E(p['type'])}</p><span class="work-arrow" aria-hidden="true">↗</span></a>''')
        kind = ' is-logo' if p.get('logo') else (' is-photo' if p.get('photo') else '')
        panes.append(f'<div class="preview-pane{kind}"><img src="{p["image"]}" alt=""></div>')
    body = (ROOT / 'templates/home.html').read_text().replace('{{work_rows}}', '\n'.join(rows))
    body += '<div class="work-preview" aria-hidden="true"><div class="preview-rail">' + ''.join(panes) + '</div></div><div class="work-preview-action" aria-hidden="true">View</div>'
    page('index.html', 'Suhas Beemineni | Engineering & Research', 'Student interested in electrical engineering, AI, and robotics. Selected research and engineering work.', body, True)


def project(p, next_project):
    image = ''
    if p.get('image'):
        credit = f' <a href="{p["credit_url"]}" target="_blank" rel="noopener noreferrer">Source ↗</a>' if p.get('credit_url') else ''
        image = f'''<figure class="case-figure"><div class="case-image{' is-logo' if p.get('logo') else ''}"><img src="../{p['image']}" alt="{E(p['alt'])}"></div><figcaption>{E(p.get('caption', ''))}{credit}</figcaption></figure>'''
    sections = ''.join('<section><h2>' + E(s['title']) + '</h2>' + ''.join('<p>' + E(t) + '</p>' for t in s['paragraphs']) + '</section>' for s in p['sections'])
    facts = ''.join(f'<div><dt>{E(k)}</dt><dd>{E(v)}</dd></div>' for k, v in p.get('facts', []))
    links = ''.join(f'<a href="{E(l["url"])}" target="_blank" rel="noopener noreferrer">{E(l["label"])} ↗</a>' for l in p.get('links', []))
    extra = ''
    if p.get('extra_image'):
        extra = f'<figure class="case-figure"><div class="case-image"><img src="../{p["extra_image"]}" alt="{E(p["extra_alt"])}" loading="lazy"></div></figure>'
    body = f'''<main id="main" class="page-main"><div class="wrap"><header class="case-heading"><a class="back-link" href="../index.html#work">← Selected work</a><h1>{E(p['name'])}</h1><p class="case-intro">{E(p['intro'])}</p><div class="case-meta"><p><span>My role</span>{E(p['role'])}</p><p><span>Work</span>{E(p['type'])}</p></div></header>{image}<div class="case-content"><dl class="case-facts">{facts}</dl><article class="case-body">{sections}<div class="case-links">{links}</div>{extra}</article></div><div class="case-next"><span>Next project</span><a href="{next_project['slug']}.html">{E(next_project['name'])} ↗</a></div></div></main>'''
    page('work/' + p['slug'] + '.html', p['name'] + ' | Suhas Beemineni', p['intro'], body)


def resume():
    data = json.loads((ROOT / 'content/resume.json').read_text())
    edu = data['education']
    sections = []
    for group in data['sections']:
        entries = []
        for item in group['entries']:
            points = ''.join('<li>' + E(point) + '</li>' for point in item['points'])
            detail = '<ul>' + points + '</ul>' if points else ''
            link = '<a href="' + E(item['url']) + '">Details ↗</a>' if item.get('url') else ''
            date = '<span class="resume-date">' + E(item['date']) + '</span>' if item.get('date') else ''
            entries.append(f'<section class="resume-entry"><div class="resume-entry-title"><h3>{E(item["name"])}</h3>{date}</div><p class="resume-role">{E(item["role"])}</p>{detail}{link}</section>')
        sections.append(f'<section class="resume-group" id="{group["id"]}"><h2>{E(group["title"])}</h2>{"".join(entries)}</section>')
    jump_links = ''.join(f'<a href="#{s["id"]}">{E(s["title"])}</a>' for s in data['sections'])
    skills = ''.join(f'<h3>{E(k)}</h3><p>{E(v)}</p>' for k, v in data['skills'].items())
    courses = ', '.join(edu['courses'])
    body = f'''<main id="main" class="page-main wrap"><header class="case-heading resume-intro"><h1>Suhas Beemineni</h1><p class="case-intro">Research, engineering &amp; community work.</p><div class="resume-contact"><a href="mailto:suhas.aug20@gmail.com">suhas.aug20@gmail.com</a><a href="https://github.com/suhaslord">GitHub ↗</a><button class="print-button" type="button">Print résumé</button></div></header><div class="resume-grid"><aside class="resume-sidebar" data-lenis-prevent><nav class="resume-index" aria-label="Résumé sections">{jump_links}</nav><h2>Education</h2><p>{E(edu['school'])}<br>{E(edu['location'])}<br>{E(edu['class'])}<br>{E(edu['gpa'])}</p><h3>Current coursework</h3><p>{E(courses)}</p><h2>Skills</h2>{skills}</aside><article>{''.join(sections)}</article></div></main>'''
    page('resume.html', 'Résumé | Suhas Beemineni', 'My research, engineering, education and volunteer work.', body)


def redirect(path):
    target = '../index.html#work'
    (ROOT / path).write_text(f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url={target}"><title>Selected work | Suhas Beemineni</title><link rel="canonical" href="{BASE}"><p><a href="{target}">View selected work</a></p></html>')


def main():
    home()
    projects = DATA['projects']
    for i, p in enumerate(projects):
        project(p, projects[(i + 1) % len(projects)])
    resume()
    for p in ['work/abstainbench.html', 'work/echo-field.html']:
        redirect(p)
    page('404.html', 'Page not found | Suhas Beemineni', 'Return to my portfolio.', '<main id="main" class="not-found wrap"><h1>This page has moved.</h1><a href="/portfolio/">Back to the portfolio ↗</a></main>')
    paths = [''] + ['work/' + p['slug'] + '.html' for p in projects] + ['resume.html']
    (ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>' + BASE + p + '</loc></url>' for p in paths) + '</urlset>')
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: ' + BASE + 'sitemap.xml\n')
    print('Built homepage, five project pages, résumé and supporting routes.')


if __name__ == '__main__':
    main()
