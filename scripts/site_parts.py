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
    'network-recovery': ('California', 'Student researcher', 'research'),
    'soft-robotics': ('Oklahoma / remote', 'Student researcher', 'research engineering'),
    'nasa-cmr': ('Remote', 'Open-source contributor', 'engineering'),
    'aviary': ('Remote', 'Open-source contributor', 'engineering'),
    'cosmos': ('Remote', 'Open-source contributor', 'engineering'),
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
'''


def transition(label='Hello'):
    return f'<div class="page-transition" aria-hidden="true"><div class="transition-curve transition-curve-top"></div><span class="transition-label" lang="en">{E(label)}</span><div class="transition-curve transition-curve-bottom"></div></div><p class="sr-only" aria-live="polite" data-page-announcement></p>'


def bottom(prefix=''):
    return f'''<footer class="site-footer"><div class="footer-meta"><div><span class="footer-label">Version</span><span>2026 © Edition</span></div><div><span class="footer-label">Local time</span><time class="local-time" data-local-time>California</time></div></div><nav class="footer-links" aria-label="Footer links"><span class="footer-label">Links</span><div><a class="magnetic" href="{GITHUB}" target="_blank" rel="noopener noreferrer"><span>GitHub</span></a><a class="magnetic" href="{prefix}resume.html" data-transition-title="Résumé"><span>Résumé</span></a><a class="magnetic" href="{prefix}contact.html" data-transition-title="Contact"><span>Contact</span></a></div></nav></footer>'''


def footer(prefix=''):
    return f'''<section class="contact-section" id="contact" aria-labelledby="contact-title" data-footer-reveal><div class="contact-curve" aria-hidden="true"></div><div class="footer-content"><div class="contact-inner wrap"><h2 class="contact-title" id="contact-title"><span><span class="contact-avatar" aria-hidden="true">sb</span>Let’s work</span><span>together.</span></h2>{arrow('down-left', 'contact-arrow')}<div class="contact-line"><div class="contact-cta-wrap"><a class="circle-button liquid magnetic" href="{prefix}contact.html" data-transition-title="Contact" data-magnet=".45">{fill('Get in touch')}</a></div><div class="contact-details">{pill('mailto:' + EMAIL, EMAIL)}{pill(GITHUB, 'GitHub ↗', 'target="_blank" rel="noopener noreferrer"')}</div></div></div>{bottom(prefix)}</div></section>'''


def thumb(p, prefix='', cls='work-thumb'):
    kind = ' is-logo' if p.get('logo') else (' is-photo' if p.get('photo') else '')
    dimensions = f' width="{p["image_width"]}" height="{p["image_height"]}"' if p.get('image_width') else ''
    return f'<span class="{cls}{kind}"><img src="{prefix}{p["image"]}" alt="{E(p["alt"])}"{dimensions} loading="lazy" decoding="async"></span>'



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
    return f'''<main id="main" class="work-page"><header class="page-hero wrap"><h1 class="page-heading">Research &amp;<br>engineering.</h1><div class="work-controls"><div class="work-filters" role="group" aria-label="Filter projects">{filters}</div><div class="view-controls" role="group" aria-label="Project layout"><button type="button" class="view-button liquid magnetic" data-work-view="list" aria-label="List view" aria-pressed="true">{fill(list_icon)}</button><button type="button" class="view-button liquid magnetic" data-work-view="grid" aria-label="Grid view" aria-pressed="false">{fill(grid_icon)}</button></div></div></header><section class="work-browser wide-wrap" aria-label="Selected projects"><p class="sr-only" role="status" data-work-status>{len(projects)} projects</p>{table_head()}<div class="project-collection">{''.join(project_row(p, i) for i, p in enumerate(projects))}</div></section><div class="more-work wrap">{pill('about.html#recognition', 'Teaching & recognition', title='About')}</div></main>{previews(projects)}'''


def recognition(compact=False):
    items = [('2nd', 'SkillsUSA regionals', '3D Visualization & Graphics'), ('Top 50', 'Math Kangaroo · California', 'Grade 7'), ('31h', 'Steel City Codes', 'Summer 2026 · CS instructor'), ('43h', 'STEM·E', 'Game-design volunteer')]
    cells = ''.join(f'<article class="achievement"><div class="achievement-value"><span>{E(value)}</span></div><h3>{E(name)}</h3><p>{E(detail)}</p></article>' for value, name, detail in items)
    title = '<h2 id="recognition-title" class="section-heading flow-heading" data-flow-heading><span class="flow-line"><span>Teaching &amp;</span></span> <span class="flow-line"><span>recognition.</span></span></h2>'
    intro = '<div class="recognition-note"><p>I also teach, tutor, and coach soccer.</p>' + pill('about.html#community', 'Community work', title='About') + '</div>' if compact else ''
    return f'<section class="recognition-section{" is-compact" if compact else ""}" id="recognition" aria-labelledby="recognition-title"><div class="wide-wrap"><header class="recognition-heading">{title}{intro}</header><div class="achievement-grid">{cells}</div>' + '</div></section>'


def gallery(projects):
    by_slug = {p['slug']: p for p in projects}
    rows = []
    for slugs in [('nasa-cmr', 'soft-robotics', 'network-recovery'), ('aviary', 'cosmos', 'voyager')]:
        cells = []
        for slug in slugs:
            p = by_slug[slug]
            cells.append(f'<a class="evidence-tile" href="work/{slug}.html" data-transition-title="{E(p["name"])}" data-cursor-only="View"><span class="evidence-image">{thumb(p, cls="evidence-media")}</span><span class="evidence-caption"><span>{E(p["name"])}</span><span>{E(p["type"])}</span></span></a>')
        rows.append('<div class="evidence-track">' + ''.join(cells) + '</div>')
    return '<section class="evidence-gallery" aria-labelledby="evidence-title"><div class="wide-wrap"><h2 id="evidence-title" class="small-heading">Research &amp; merged contributions</h2></div>' + ''.join(rows) + '</section>'


def about():
    community = [
        ('Steel City Codes', 'Computer-science instructor', '31 verified hours · summer 2026'),
        ('STEM·E', 'Game-design volunteer', '43 verified hours'),
        ('LearnToBe', 'Math & English tutor', ''),
        ('Adaptable Athletics', 'Volunteer soccer coach', 'Coaching children with physical and cognitive differences'),
        ('RIAX', 'Aerospace club leadership', 'Planning university visits and club activities'),
        ('Tennis & soccer', 'School tennis · six years of soccer', 'Four years of club soccer'),
    ]
    rows = ''.join(f'<article class="experience-row"><span class="experience-index">0{i}</span><h3>{E(name)}</h3><div><p>{E(role)}</p>' + (f'<span>{E(detail)}</span>' if detail else '') + '</div></article>' for i, (name, role, detail) in enumerate(community, 1))
    jobs = ''.join(f'<article class="experience-row"><h3>{E(name)}</h3><p>{E(role)}</p></article>' for name, role in [('Seagulls / OpenStage', 'Lead AI Engineer → Lead QA Tester'), ('ExoVista', 'Growth intern'), ('Cruze', 'Fleet outreach & business development intern'), ('Venture Starters', 'Internship participation')])
    return f'''<main id="main" class="about-page"><header class="page-hero wrap"><h1 class="page-heading">I’m Suhas,<br>a student in California.</h1><div class="about-divider"><div class="about-orb" aria-hidden="true">{globe()}</div></div></header><section class="about-intro wide-wrap"><div class="about-copy"><p>I’m a sophomore at River Islands High School. I work with research teams on AI, navigation, robotics, and network recovery.</p><p>Outside that, I teach, tutor, and coach soccer.</p>{pill('resume.html', 'Full résumé', title='Résumé')}</div><figure class="about-image"><div class="about-image-frame"><img src="assets/avl/marvin-lab.webp" alt="MARVIN rover in the Cal Poly Pomona Autonomous Vehicle Lab" decoding="async"></div><figcaption>MARVIN · Cal Poly Pomona AVL. <a href="https://autovehiclelab.com/projects.html" target="_blank" rel="noopener noreferrer">Photo source ↗</a></figcaption></figure></section><section class="about-disciplines" id="research"><div class="wide-wrap"><h2>What I work on</h2><div class="discipline-grid"><article><span class="discipline-number">01</span><h3>Research</h3><p>UC Santa Cruz, San Diego State, Cal Poly Pomona, and the University of Tulsa.</p>{pill('work.html', 'See the work', title='Work')}</article><article><span class="discipline-number">02</span><h3>Engineering</h3><p>AI and testing at Seagulls. Merged contributions to NASA, Aviary, COSMOS, and Elodin.</p></article><article><span class="discipline-number">03</span><h3>TennisRank</h3><p>I built a school tennis-ranking app with a challenge ladder and team-aware doubles logic.</p>{pill('https://github.com/suhaslord/tennisrank-ai', 'View project ↗', 'target="_blank" rel="noopener noreferrer"')}</article></div></div></section>{recognition()}<section class="community-section wide-wrap" id="community"><header class="section-heading-row"><h2 class="section-heading">Outside<br>my projects.</h2>{arrow('down-left', 'section-arrow')}</header><div class="experience-list">{rows}</div></section><section class="experience-section wide-wrap"><h2 class="section-heading">Work experience.</h2><div class="experience-list jobs-list">{jobs}</div></section><section class="education-section wrap"><span class="small-heading">Education</span><h2>River Islands<br>High School.</h2><div><p>Class of 2029 · Lathrop, California</p><p>Grade 9 weighted GPA: 4.49</p><p>English &amp; Telugu. Learning Spanish.</p>{pill('resume.html', 'Courses & full résumé', title='Résumé')}</div></section></main>'''


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


def case_ending(p, prefix='../', count=10):
    return f'''<section class="case-ending" data-footer-reveal><div class="contact-curve" aria-hidden="true"></div><div class="footer-content"><div class="wrap"><a class="next-case" href="{prefix}work/{p['slug']}.html" data-transition-title="{E(p['name'])}" data-cursor-only="Next case"><span class="next-label">Next case</span><span class="next-title">{E(p['name'])}</span>{thumb(p, prefix, 'next-case-image')}</a><div class="all-work-link">{pill(prefix + 'work.html', f'All work <sup>{count}</sup>', title='Work')}</div></div>{bottom(prefix)}</div></section><div class="cursor-badge" aria-hidden="true">Next case</div>'''


def project(p, next_project):
    _, role, _ = META[p['slug']]
    credit = f' <a href="{p["credit_url"]}" target="_blank" rel="noopener noreferrer">Source ↗</a>' if p.get('credit_url') else ''
    kind = ' is-logo' if p.get('logo') else (' is-photo' if p.get('photo') else '')
    primary = p.get('links', [])
    href = primary[0]['url'] if primary else '#results'
    external = ' target="_blank" rel="noopener noreferrer"' if primary else ''
    visit = f'<a class="circle-button liquid magnetic case-visit" href="{E(href)}"{external}>{fill("View source ↗" if primary else "See results")}</a>'
    image = f'<figure class="case-figure case-primary wide-wrap" id="results">{visit}<div class="case-image{kind}"><a href="../{p["image"]}" target="_blank" rel="noopener" aria-label="Open full-size result image"><img src="../{p["image"]}" alt="{E(p["alt"])}" width="{p["image_width"]}" height="{p["image_height"]}" decoding="async"></a></div><figcaption>{E(p.get("caption", ""))}{credit}</figcaption></figure>'
    sections = ''.join('<section data-flow-group><h2>' + E(s['title']) + '</h2>' + ''.join('<p>' + E(t) + '</p>' for t in s['paragraphs']) + '</section>' for s in p['sections'])
    facts = ''.join(f'<div><dt>{E(k)}</dt><dd>{E(v)}</dd></div>' for k, v in p.get('facts', []))
    links = ''.join(f'<a href="{E(l["url"])}" target="_blank" rel="noopener noreferrer">{E(l["label"])} ↗</a>' for l in primary)
    extra = ''
    if p.get('extra_image'):
        extra = f'<figure class="case-figure wide-wrap"><div class="case-image"><img src="../{p["extra_image"]}" alt="{E(p["extra_alt"])}" width="{p["extra_width"]}" height="{p["extra_height"]}" loading="lazy" decoding="async"></div></figure>'
    body = f'''<main id="main" class="case-page"><header class="page-hero case-heading wrap"><h1>{E(p['name'])}</h1><div class="case-meta"><p><span>Role</span>{E(role)}</p><p><span>Work</span>{E(p['type'])}</p><p><span>Year</span>2026</p></div></header>{image}<div class="case-content wrap"><dl class="case-facts">{facts}</dl><article class="case-body"><p class="case-lead">{E(p['intro'])}</p>{sections}<div class="case-links">{links}</div></article></div>{extra}</main>'''
    return body, case_ending(next_project)


def home_recognition(compact=False):
    items = [('2nd', 'SkillsUSA regionals', '3D Visualization & Graphics'), ('Top 50', 'Math Kangaroo · California', 'Grade 7'), ('31h', 'Steel City Codes', 'Summer 2026 · CS instructor'), ('43h', 'STEM·E', 'Game-design volunteer')]
    cells = ''.join(f'<article class="achievement"><div class="achievement-value"><span>{E(value)}</span></div><h3>{E(name)}</h3><p>{E(detail)}</p></article>' for value, name, detail in items)
    return f'<section class="recognition-section{" is-compact" if compact else ""}" id="recognition" aria-labelledby="recognition-title"><div class="wide-wrap"><h2 id="recognition-title" class="section-heading">Teaching &amp;<br>recognition.</h2><div class="achievement-grid">{cells}</div>' + (f'<div class="recognition-link">{pill("about.html#community", "Outside my projects", title="About")}</div>' if compact else '') + '</div></section>'
