"""Shared page compositions for the static portfolio."""
import html

E = html.escape
EMAIL = 'suhas.aug20@gmail.com'
GITHUB = 'https://github.com/suhaslord'
META = {
    'ucsc': ('California', 'Student researcher', 'research'),
    'lunar-navigation': ('California', 'Student researcher', 'research'),
    'avl': ('California', 'Simulation contributor', 'research engineering'),
    'seagulls': ('Remote', 'AI engineering & QA', 'engineering'),
    'voyager': ('Remote', 'Open-source contributor', 'engineering'),
}


def arrow(direction='up-right', cls=''):
    paths = {'up-right': 'M6 26L26 6M6 6H26V26', 'down-left': 'M26 6L6 26M6 6V26H26'}
    return f'<svg class="{cls}" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false"><path d="{paths[direction]}" stroke="currentColor" stroke-width="2"></path></svg>'


def globe(identifier='about'):
    return f'''<svg class="location-globe" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs><clipPath id="globe-window-{identifier}"><circle cx="50" cy="50" r="47"></circle></clipPath></defs><g class="globe-sphere"><circle class="globe-wire" cx="50" cy="50" r="47"></circle><g clip-path="url(#globe-window-{identifier})"><ellipse class="globe-wire globe-meridian" cx="50" cy="50" rx="47" ry="47"></ellipse><ellipse class="globe-wire globe-meridian" cx="50" cy="50" rx="47" ry="47"></ellipse><ellipse class="globe-wire globe-meridian" cx="50" cy="50" rx="47" ry="47"></ellipse><ellipse class="globe-wire" cx="50" cy="50" rx="75" ry="27.5"></ellipse><path class="globe-wire" d="M-25 50H125"></path></g></g></svg>'''


def fill(text):
    return f'<span class="button-fill" aria-hidden="true"></span><span class="button-label">{text}</span>'


def pill(href, text, extra='', title=''):
    return f'<a class="outline-link liquid magnetic" href="{href}" {extra}' + (f' data-transition-title="{E(title)}"' if title else '') + f'>{fill(text)}</a>'


def navigation(prefix='', active='', label='Home'):
    def link(name, path, cls=''):
        current = ' aria-current="page"' if active == name.lower() else ''
        return f'<a class="{cls}" href="{prefix}{path}" data-transition-title="{name}"{current}>{name}</a>'
    top = ''.join(link(name, path, 'magnetic') for name, path in [('Work', 'work.html'), ('About', 'about.html'), ('Résumé', 'resume.html'), ('Contact', 'contact.html')])
    menu = ''.join(link(name, path, 'magnetic') for name, path in [('Home', 'index.html'), ('Work', 'work.html'), ('About', 'about.html'), ('Contact', 'contact.html')])
    return f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="brand magnetic" href="{prefix}index.html" data-transition-title="Home"><span class="brand-mark" aria-hidden="true">©</span><span>Suhas Beemineni</span></a><nav class="desktop-nav" aria-label="Primary">{top}</nav></header>
<button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="menu-panel"><span></span><span></span></button>
<div class="menu-scrim" aria-hidden="true"></div><aside class="menu-panel" id="menu-panel" data-lenis-prevent role="dialog" aria-modal="true" aria-label="Navigation" aria-hidden="true" inert><div class="menu-curve" aria-hidden="true"></div><p class="menu-label">Navigation</p><nav>{menu}</nav><div class="menu-bottom">{link('Résumé', 'resume.html')}<a href="{GITHUB}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></aside>
<div class="page-transition" aria-hidden="true"><div class="transition-curve transition-curve-top"></div><span class="transition-label" lang="en">{E(label)}</span><div class="transition-curve transition-curve-bottom"></div></div>'''


def bottom(prefix=''):
    return f'''<footer class="site-footer"><div class="footer-meta"><div><span class="footer-label">Version</span><span>2026 © Edition</span></div><div><span class="footer-label">Local time</span><time class="local-time" data-local-time>California</time></div></div><nav class="footer-links" aria-label="Footer links"><span class="footer-label">Links</span><div><a class="magnetic" href="{GITHUB}" target="_blank" rel="noopener noreferrer"><span>GitHub</span></a><a class="magnetic" href="{prefix}resume.html" data-transition-title="Résumé"><span>Résumé</span></a><a class="magnetic" href="{prefix}contact.html" data-transition-title="Contact"><span>Contact</span></a></div></nav></footer>'''


def footer(prefix=''):
    return f'''<section class="contact-section" id="contact" aria-labelledby="contact-title" data-footer-reveal><div class="contact-curve" aria-hidden="true"></div><div class="footer-content"><div class="contact-inner wrap"><h2 class="contact-title" id="contact-title"><span><span class="contact-avatar" aria-hidden="true">sb</span>Let’s work</span><span>together.</span></h2>{arrow('down-left', 'contact-arrow')}<div class="contact-line"><div class="contact-cta-wrap"><a class="circle-button liquid magnetic" href="{prefix}contact.html" data-transition-title="Contact" data-magnet=".45">{fill('Get in touch')}</a></div><div class="contact-details">{pill('mailto:' + EMAIL, EMAIL)}{pill(GITHUB, 'GitHub ↗', 'target="_blank" rel="noopener noreferrer"')}</div></div></div>{bottom(prefix)}</div></section>'''


def thumb(p, prefix='', cls='work-thumb'):
    kind = ' is-logo' if p.get('logo') else (' is-photo' if p.get('photo') else '')
    return f'<span class="{cls}{kind}"><img src="{prefix}{p["image"]}" alt="{E(p["alt"])}" loading="lazy" decoding="async"></span>'


def previews(projects, prefix=''):
    panes = []
    for p in projects:
        kind = ' is-logo' if p.get('logo') else (' is-photo' if p.get('photo') else '')
        panes.append(f'<div class="preview-pane{kind}"><img data-src="{prefix}{p["image"]}" alt="" decoding="async"></div>')
    return '<div class="work-preview" aria-hidden="true"><div class="preview-rail">' + ''.join(panes) + '</div></div><div class="work-preview-action" aria-hidden="true">View</div>'


def project_row(p, i, archive=False):
    location, _, group = META[p['slug']]
    preview = ' data-cursor-only="View"' if archive else f' data-preview="{p["image"]}" data-preview-index="{i}" data-groups="{group}"'
    return f'''<a class="work-row work-item" href="work/{p['slug']}.html" data-transition-title="{E(p['name'])}"{preview}>{thumb(p)}<h3>{E(p['name'])}</h3><span class="work-location">{location}</span><p>{E(p['type'])}</p><span class="work-year">2026</span></a>'''


def table_head():
    return '<div class="work-table-head" aria-hidden="true"><span>Project</span><span>Location</span><span>Work</span><span>Year</span></div>'


def work(projects):
    research = sum('research' in META[p['slug']][2] for p in projects)
    engineering = sum('engineering' in META[p['slug']][2] for p in projects)
    filters = ''.join(f'<button type="button" class="filter-button liquid magnetic" data-work-filter="{key}" aria-pressed="{str(key == "all").lower()}">{fill(name + (f"<sup>{count}</sup>" if count else ""))}</button>' for key, name, count in [('all', 'All', 0), ('research', 'Research', research), ('engineering', 'Engineering', engineering)])
    list_icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4H22M2 9H22M2 14H22M2 19H22"/></svg>'
    grid_icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 2H9V9H2ZM15 2H22V9H15ZM2 15H9V22H2ZM15 15H22V22H15Z"/></svg>'
    return f'''<main id="main" class="work-page"><header class="page-hero wrap"><h1 class="page-heading">Research &amp;<br>engineering.</h1><div class="work-controls"><div class="work-filters" role="group" aria-label="Filter projects">{filters}</div><div class="view-controls" role="group" aria-label="Project layout"><button type="button" class="view-button liquid magnetic" data-work-view="list" aria-label="List view" aria-pressed="true">{fill(list_icon)}</button><button type="button" class="view-button liquid magnetic" data-work-view="grid" aria-label="Grid view" aria-pressed="false">{fill(grid_icon)}</button></div></div></header><section class="work-browser wide-wrap" aria-label="Selected projects"><p class="sr-only" role="status" data-work-status>{len(projects)} projects</p>{table_head()}<div class="project-collection">{''.join(project_row(p, i) for i, p in enumerate(projects))}</div></section><div class="more-work wrap">{pill('archive.html', 'Archive <sup>12</sup>', title='Archive')}</div></main>{previews(projects)}'''


def about():
    return f'''<main id="main" class="about-page"><header class="page-hero wrap"><h1 class="page-heading">I’m Suhas,<br>a student in California.</h1><div class="about-divider"><div class="about-orb" aria-hidden="true">{globe()}</div></div></header><section class="about-intro wide-wrap"><div class="about-copy"><p>I’m a sophomore at River Islands High School. I work with research teams at UC Santa Cruz, San Diego State, and Cal Poly Pomona.</p><p>Outside that, I teach, tutor, and coach soccer.</p>{pill('resume.html', 'Full résumé', title='Résumé')}</div><figure class="about-image"><div class="about-image-frame"><img src="assets/avl/marvin-lab.webp" alt="MARVIN rover in the Cal Poly Pomona Autonomous Vehicle Lab" decoding="async"></div><figcaption>MARVIN · Cal Poly Pomona AVL. <a href="https://autovehiclelab.com/projects.html" target="_blank" rel="noopener noreferrer">Photo source ↗</a></figcaption></figure></section><section class="about-disciplines" id="research"><div class="wide-wrap"><h2>What I work on</h2><div class="discipline-grid"><article><span class="discipline-number">01</span><h3>Research</h3><p>Visual question answering, lunar navigation, rover simulation, digital twins, and soft-robotics models.</p></article><article><span class="discipline-number">02</span><h3>Software</h3><p>AI features and launch testing at Seagulls, plus open-source contributions to engineering tools.</p></article><article><span class="discipline-number">03</span><h3>Community</h3><p>Teaching computer science, tutoring math and English, and coaching accessible soccer.</p></article></div></div></section><section class="about-school wrap"><div class="school-year" aria-label="Graduating class of 2029">20<br>29</div><div><h2>River Islands<br>High School.</h2><p>Class of 2029. Studying calculus, physics, computer science, psychology, and world history.</p><p>I speak English and Telugu, and I’m learning Spanish.</p>{pill('resume.html', 'See my résumé', title='Résumé')}</div></section></main>'''


def contact():
    fields = [
        ('name', 'What’s your name?', 'Your name *', 'text', True),
        ('email', 'What’s your email?', 'you@example.com *', 'email', True),
        ('organization', 'Your organization', 'School, lab, or company', 'text', False),
        ('topic', 'What would you like to talk about?', 'Research, a project, or something else', 'text', False),
    ]
    rows = []
    for i, (name, label, placeholder, kind, required) in enumerate(fields, 1):
        required_attr = ' required' if required else ''
        autocomplete = f' autocomplete="{name}"' if name in ('name', 'email', 'organization') else ''
        rows.append(f'<div class="contact-field"><span class="field-number" aria-hidden="true">0{i}</span><label for="contact-{name}">{label}</label><input id="contact-{name}" name="{name}" type="{kind}" placeholder="{placeholder}"{required_attr}{autocomplete}></div>')
    return f'''<main id="main" class="contact-page-main wrap"><header class="contact-heading"><h1 class="page-heading">Let’s start a<br>conversation.</h1><div class="contact-identity"><span class="contact-avatar" aria-hidden="true">sb</span>{arrow('up-right')}</div></header><div class="contact-layout"><form class="contact-form" action="mailto:{EMAIL}" method="get" data-contact-form>{''.join(rows)}<div class="contact-field"><span class="field-number" aria-hidden="true">05</span><label for="contact-message">Your message</label><textarea id="contact-message" name="message" rows="5" placeholder="Hi Suhas, ... *" required></textarea></div><div class="contact-send"><button class="circle-button liquid magnetic" type="submit" data-magnet=".45">{fill('Send email')}</button><p class="contact-form-note">Opens a draft in your email app.</p></div><p class="contact-form-status" role="status" data-contact-status></p><a class="contact-draft-link" data-contact-draft hidden>Open email draft ↗</a></form><aside class="contact-aside"><div><h2>Contact details</h2><a href="mailto:{EMAIL}">{EMAIL}</a></div><div><h2>Based in</h2><p>California, United States</p></div><div><h2>Links</h2><a href="{GITHUB}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="resume.html" data-transition-title="Résumé">Résumé</a></div></aside></div></main>'''


def archive(projects, resume_data):
    rows = [project_row(p, i, True) for i, p in enumerate(projects)]
    extras = [('AI for digital twins', 'Cal Poly Pomona', 'Literature review', 'about.html#research'), ('Soft-robotics modeling', 'University of Tulsa', 'Research', 'about.html#research')]
    for group in resume_data['sections']:
        for item in group['entries']:
            if item['name'] == 'AegisLand' or (group['id'] == 'resume-open-source' and item['name'] != 'Elodin / Voyager'):
                extras.append((item['name'], 'Remote', item['role'], item['url']))
    for name, location, role, href in extras:
        external = ' target="_blank" rel="noopener noreferrer"' if href.startswith('https:') else ''
        rows.append(f'<a class="work-row work-item archive-item" href="{E(href)}"{external} data-cursor-only="View"><h3>{E(name)}</h3><span class="work-location">{E(location)}</span><p>{E(role)}</p><span class="work-year">2026</span></a>')
    return f'''<main id="main" class="archive-page"><header class="page-hero wrap"><h1 class="page-heading">Archive <sup>({len(rows)})</sup></h1></header><section class="work-browser archive-browser wide-wrap" aria-label="Project archive">{table_head()}<div class="project-collection">{''.join(rows)}</div></section></main><div class="cursor-badge" aria-hidden="true">View ↗</div>'''


def case_ending(p, prefix='../'):
    return f'''<section class="case-ending" data-footer-reveal><div class="contact-curve" aria-hidden="true"></div><div class="footer-content"><div class="wrap"><a class="next-case" href="{prefix}work/{p['slug']}.html" data-transition-title="{E(p['name'])}" data-cursor-only="Next case"><span class="next-label">Next case</span><span class="next-title">{E(p['name'])}</span>{thumb(p, prefix, 'next-case-image')}</a><div class="all-work-link">{pill(prefix + 'work.html', 'All work <sup>5</sup>', title='Work')}</div></div>{bottom(prefix)}</div></section><div class="cursor-badge" aria-hidden="true">Next case</div>'''


def project(p, next_project):
    _, role, _ = META[p['slug']]
    credit = f' <a href="{p["credit_url"]}" target="_blank" rel="noopener noreferrer">Source ↗</a>' if p.get('credit_url') else ''
    kind = ' is-logo' if p.get('logo') else (' is-photo' if p.get('photo') else '')
    primary = p.get('links', [])
    href = primary[0]['url'] if primary else '#results'
    external = ' target="_blank" rel="noopener noreferrer"' if primary else ''
    visit = f'<a class="circle-button liquid magnetic case-visit" href="{E(href)}"{external}>{fill("View source ↗" if primary else "See results")}</a>'
    image = f'<figure class="case-figure case-primary wide-wrap" id="results">{visit}<div class="case-image{kind}"><img src="../{p["image"]}" alt="{E(p["alt"])}" decoding="async"></div><figcaption>{E(p.get("caption", ""))}{credit}</figcaption></figure>'
    sections = ''.join('<section><h2>' + E(s['title']) + '</h2>' + ''.join('<p>' + E(t) + '</p>' for t in s['paragraphs']) + '</section>' for s in p['sections'])
    facts = ''.join(f'<div><dt>{E(k)}</dt><dd>{E(v)}</dd></div>' for k, v in p.get('facts', []))
    links = ''.join(f'<a href="{E(l["url"])}" target="_blank" rel="noopener noreferrer">{E(l["label"])} ↗</a>' for l in primary)
    extra = ''
    if p.get('extra_image'):
        extra = f'<figure class="case-figure wide-wrap"><div class="case-image"><img src="../{p["extra_image"]}" alt="{E(p["extra_alt"])}" loading="lazy" decoding="async"></div></figure>'
    body = f'''<main id="main" class="case-page"><header class="page-hero case-heading wrap"><h1>{E(p['name'])}</h1><div class="case-meta"><p><span>Role</span>{E(role)}</p><p><span>Work</span>{E(p['type'])}</p><p><span>Year</span>2026</p></div></header>{image}<div class="case-content wrap"><dl class="case-facts">{facts}</dl><article class="case-body"><p class="case-lead">{E(p['intro'])}</p>{sections}<div class="case-links">{links}</div></article></div>{extra}</main>'''
    return body, case_ending(next_project)
