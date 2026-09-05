#!/usr/bin/env python3
"""Validate public routes, assets, anchors, image descriptions, and page metadata."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re
import sys
ROOT=Path(__file__).resolve().parents[1]
PAGES=["index.html","resume.html","404.html","work/aegisland.html","work/voyager.html","work/abstainbench.html","work/echo-field.html","demos/abstainbench/index.html"]
class Document(HTMLParser):
    def __init__(self, text):
        super().__init__();self.ids=[];self.refs=[];self.images=[];self.h1=0;self.title=False;self.description=False
        self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if "id" in a:self.ids.append(a["id"])
        if tag=="h1":self.h1+=1
        if tag=="title":self.title=True
        if tag=="meta" and a.get("name")=="description":self.description=True
        for k in ("href","src"):
            if k in a:self.refs.append(a[k])
        if tag=="img":self.images.append(a)

def main():
    errors=[];count=0
    docs={p:Document((ROOT/p).read_text()) for p in PAGES}
    for name,d in docs.items():
        if len(d.ids)!=len(set(d.ids)):errors.append(f"{name}: duplicate IDs")
        if name!="demos/abstainbench/index.html":
            if d.h1!=1:errors.append(f"{name}: expected one h1")
            if not d.title or not d.description:errors.append(f"{name}: missing metadata")
        for im in d.images:
            if "alt" not in im:errors.append(f"{name}: missing image description")
            if not im.get("width") or not im.get("height"):errors.append(f"{name}: missing image dimensions")
        for ref in d.refs:
            u=urlsplit(ref)
            if u.scheme or u.netloc:continue
            url=unquote(u.path)
            target=ROOT/url.removeprefix("/portfolio/") if url.startswith("/portfolio/") else (ROOT/name).parent/url
            if not url:target=ROOT/name
            if target.is_dir():target=target/"index.html"
            target=target.resolve()
            count+=1
            if not target.is_relative_to(ROOT) or not target.exists():errors.append(f"{name}: missing {ref}");continue
            key=str(target.relative_to(ROOT))
            if u.fragment and target.suffix==".html":
                other=docs.get(key) or Document(target.read_text())
                if u.fragment not in other.ids:errors.append(f"{name}: missing anchor {ref}")
    css=(ROOT/"css/portfolio.css").read_text()
    for ref in re.findall(r'url\(["\']?([^)"\']+)',css):
        if not (ROOT/"css"/ref).resolve().exists():errors.append(f"Missing CSS asset {ref}")
    if errors:
        print("\n".join(errors));sys.exit(1)
    print(f"PASS: {len(PAGES)} entry pages, {count} local references, anchors, images, and metadata.")
if __name__=="__main__":main()
