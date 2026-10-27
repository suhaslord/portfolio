#!/usr/bin/env python3
"""Check generated routes, image files, anchors and the selected-work scope."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

ROOT = Path(__file__).resolve().parents[1]
projects = json.loads((ROOT / 'content/projects.json').read_text())['projects']
routes = ['index.html', 'work.html', 'about.html', 'contact.html', 'archive.html', 'resume.html', '404.html'] + ['work/' + p['slug'] + '.html' for p in projects]


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.links, self.images, self.h1 = [], [], [], 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag in ['img', 'script', 'link']:
            if tag == 'img':
                assert 'alt' in a, 'Missing image alt text'
            ref = a.get('src') or (a.get('href') if tag == 'link' else None)
            if ref:
                self.images.append(ref)
        if tag == 'h1':
            self.h1 += 1


docs = {r: Document((ROOT / r).read_text()) for r in routes}
for route, doc in docs.items():
    assert len(doc.ids) == len(set(doc.ids)), f'{route}: duplicate IDs'
    assert doc.h1 == 1, f'{route}: expected one h1'
    for ref in doc.links + doc.images:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        if url.path.startswith('/portfolio/'):
            dest = ROOT / url.path.removeprefix('/portfolio/')
        else:
            dest = (ROOT / route).parent / unquote(url.path) if url.path else ROOT / route
        if dest.is_dir():
            dest = dest / 'index.html'
        assert dest.is_file(), f'{route}: missing {ref}'
        if url.fragment and dest.suffix == '.html':
            target = dest.resolve().relative_to(ROOT.resolve()).as_posix()
            parsed = docs.get(target) or Document(dest.read_text())
            assert url.fragment in parsed.ids, f'{route}: missing anchor {ref}'
for route in ['index.html', 'resume.html']:
    s = (ROOT / route).read_text().lower()
    for banned in ['abstainbench', 'echo / field', 'citizen astronomy', 'voyagercanvas', 'project-wall']:
        assert banned not in s, f'{route}: removed showcase item {banned}'
assert len(projects) == 5
print(f'Checked {len(routes)} pages: links, anchors, images, headings and showcase scope passed.')
