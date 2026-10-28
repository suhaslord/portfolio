#!/usr/bin/env python3
"""Build the static portfolio. Python standard library only."""
from pathlib import Path
import hashlib
import html
import json
import site_parts as parts

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://suhaslord.github.io/portfolio/'
DATA = json.loads((ROOT / 'content/projects.json').read_text())
E = html.escape


def rev(path):
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()[:10]






def page(path, title, description, body, home=False, kind='', ending=None):
    prefix = '../' if '/' in path else ''
    canonical = BASE + ('' if home else path)
    kind = kind or ('home' if home else 'resume' if path == 'resume.html' else 'case' if '/' in path else '')
    active = 'work' if kind in ['case', 'archive'] else 'résumé' if kind == 'resume' else kind
    label = 'Home' if home else title.split(' | ')[0]
    ending = parts.footer(prefix) if ending is None else ending
    theme = '#1c1d20' if kind == 'contact' else '#999d9e' if home else '#ffffff'
    person = json.dumps({'@context': 'https://schema.org', '@type': 'Person', 'name': 'Suhas Beemineni', 'url': BASE, 'sameAs': ['https://github.com/suhaslord'], 'description': 'Student interested in electrical engineering, AI, and robotics.'})
    vendors = ''.join(f'<script src="{prefix}js/vendor/{name}" defer></script>' for name in ['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js', 'barba.umd.js'])
    bootstrap = "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.hash){document.documentElement.classList.add('page-cover-ready');setTimeout(()=>document.documentElement.classList.remove('page-cover-ready'),6000)}}catch{}"
    body_class = f'{"home" if home else "interior"} page-{kind}'
    document = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script>{bootstrap}</script><title>{E(title)}</title><meta name="description" content="{E(description)}"><meta name="author" content="Suhas Beemineni"><meta name="theme-color" content="{theme}"><meta name="color-scheme" content="light"><link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(description)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{BASE}assets/results/clevr-training.png"><meta property="og:image:alt" content="FiLM training results from my UC Santa Cruz research"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="{prefix}assets/fonts/dm-sans-variable.woff" as="font" type="font/woff" crossorigin><link rel="stylesheet" href="{prefix}css/site.css?v={rev('css/site.css')}"><link rel="stylesheet" href="{prefix}css/flow.css?v={rev('css/flow.css')}"><script type="application/ld+json">{person}</script><noscript><style>.menu-toggle,.work-controls{{display:none}}.desktop-nav{{display:flex!important;gap:16px}}.site-header{{padding-right:24px}}.reveal{{opacity:1;transform:none}}</style></noscript></head><body class="{body_class}" data-page-title="{E(label)}" data-barba="wrapper">{parts.transition('Hello' if home else label)}<div class="site-shell" data-barba="container" data-barba-namespace="{kind}" data-body-class="{body_class}" data-page-title="{E(label)}">{parts.navigation(prefix, active, 'Hello' if home else label)}{body}{ending}</div>{vendors}<script src="{prefix}js/motion.js?v={rev('js/motion.js')}" defer></script><script src="{prefix}js/pages.js?v={rev('js/pages.js')}" defer></script><script src="{prefix}js/flow.js?v={rev('js/flow.js')}" defer></script><script src="{prefix}js/site.js?v={rev('js/site.js')}" defer></script></body></html>'''
    dest = ROOT / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(document)


def home():
    rows = []
    selected = DATA['projects'][:5]
    for i, p in enumerate(selected):
        preview = ''
        if p.get('image'):
            preview = f' data-preview="{p["image"]}" data-preview-index="{i}" data-alt="{E(p["alt"])}"'
            if p.get('logo'):
                preview += ' data-logo="true"'
        thumb = parts.thumb(p) if p.get('image') else ''
        rows.append(f'''<a class="work-row" href="work/{p['slug']}.html" data-transition-title="{E(p['name'])}"{preview}>{thumb}<h3>{E(p['name'])}</h3><p>{E(p['type'])}</p><span class="work-arrow" aria-hidden="true">↗</span></a>''')
    body = (ROOT / 'templates/home.html').read_text().replace('{{work_rows}}', '\n'.join(rows)).replace('{{work_count}}', str(len(DATA['projects']))).replace('{{evidence_gallery}}', parts.gallery(DATA['projects'])).replace('{{recognition}}', parts.home_recognition(True))
    body += parts.previews(selected) + '<div class="cursor-badge" aria-hidden="true">View</div>'
    page('index.html', 'Suhas Beemineni | Engineering & Research', 'Student interested in electrical engineering, AI, and robotics. Selected research and engineering work.', body, True)




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
        body, ending = parts.project(p, projects[(i + 1) % len(projects)])
        page('work/' + p['slug'] + '.html', p['name'] + ' | Suhas Beemineni', p['intro'], body, kind='case', ending=ending)
    page('work.html', 'Work | Suhas Beemineni', 'Selected research and engineering projects.', parts.work(projects), kind='work')
    page('about.html', 'About | Suhas Beemineni', 'A student in California working on AI, robotics, and spacecraft simulation.', parts.about(), kind='about')
    page('contact.html', 'Contact | Suhas Beemineni', 'Get in touch with Suhas Beemineni.', parts.contact(), kind='contact', ending=parts.bottom())
    resume_data = json.loads((ROOT / 'content/resume.json').read_text())
    (ROOT / 'archive.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=work.html"><title>Work | Suhas Beemineni</title><link rel="canonical" href="' + BASE + 'work.html"><p><a href="work.html">View all work</a></p></html>')
    resume()
    for p in ['work/abstainbench.html', 'work/echo-field.html']:
        redirect(p)
    page('404.html', 'Page not found | Suhas Beemineni', 'Return to my portfolio.', '<main id="main" class="not-found wrap"><h1>This page has moved.</h1><a href="/portfolio/">Back to the portfolio ↗</a></main>')
    paths = ['', 'work.html', 'about.html', 'contact.html', 'resume.html'] + ['work/' + p['slug'] + '.html' for p in projects]
    (ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>' + BASE + p + '</loc></url>' for p in paths) + '</urlset>')
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: ' + BASE + 'sitemap.xml\n')
    print(f'Built Home, Work, About, Contact, résumé, {len(projects)} case pages and supporting routes.')


if __name__ == '__main__':
    main()
