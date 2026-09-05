#!/usr/bin/env python3
"""Regenerate the precise social image and résumé PDF (Pillow, fontTools, reportlab)."""
from pathlib import Path
from io import BytesIO
import math
from fontTools.ttLib import TTFont as FontFile
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor

ROOT = Path(__file__).resolve().parents[1]
def ttf(name):
    font = FontFile(ROOT / "assets/fonts" / (name + ".woff"))
    font.flavor = None
    out = BytesIO()
    font.save(out)
    out.seek(0)
    return out

def social():
    im = Image.new("RGB", (1200, 630), "#f3f4f4")
    d = ImageDraw.Draw(im)
    bold = lambda n: ImageFont.truetype(ttf("space-semibold"), n)
    regular = lambda n: ImageFont.truetype(ttf("space-regular"), n)
    ink, accent, muted = "#242a2e", "#ad3f23", "#53616b"
    d.text((66, 45), "sb.", font=bold(30), fill=accent)
    d.text((66, 150), "Suhas", font=bold(94), fill=ink)
    d.text((66, 243), "Beemineni.", font=bold(94), fill=ink)
    d.text((70, 390), "I build aerospace simulations", font=regular(27), fill=ink)
    d.text((70, 428), "and reliable AI systems.", font=regular(27), fill=ink)
    d.line((70, 536, 1130, 536), fill="#ccd2d5", width=2)
    d.text((70, 563), "Selected work / 2026", font=regular(19), fill=muted)
    d.text((816, 563), "suhaslord.github.io/portfolio", font=regular(19), fill=muted)
    cx, cy, r = 875, 260, 60
    for q in [1, .25, .55, .82]:
        d.ellipse((cx-r*q,cy-r,cx+r*q,cy+r), outline="#8e9aa2", width=1)
        d.ellipse((cx-r,cy-r*q,cx+r,cy+r*q), outline="#8e9aa2", width=1)
    rp, mu, vinf = 180000, 126686531.9, 16
    e = 1+rp*vinf**2/mu
    p = rp*(1+e)
    limit=math.acos(-1/e)*.9
    pts=[]
    for i in range(501):
        t=-limit+2*limit*i/500
        rr=p/(1+e*math.cos(t))
        x,y=rr*math.cos(t),rr*math.sin(t)
        pts.append((cx+.00084*(x*math.cos(-.5)-y*math.sin(-.5)),cy+.00084*(x*math.sin(-.5)+y*math.cos(-.5))))
    # Clip the mathematical path to the right illustration region.
    last=None
    for point in pts:
        if 700<point[0]<1170 and 45<point[1]<505:
            if last: d.line((last,point),fill=accent,width=3)
            last=point
        else: last=None
    point=pts[247]
    d.ellipse((point[0]-6,point[1]-6,point[0]+6,point[1]+6),fill=accent)
    im.save(ROOT/"assets/og/portfolio.png",optimize=True)

def resume():
    pdfmetrics.registerFont(TTFont("Space",ttf("space-regular")))
    pdfmetrics.registerFont(TTFont("SpaceBold",ttf("space-semibold")))
    ink, muted, accent = HexColor("#242a2e"),HexColor("#53616b"),HexColor("#ad3f23")
    styles = {
      "name":ParagraphStyle("Name",fontName="SpaceBold",fontSize=29,leading=33,textColor=ink,spaceAfter=9),
      "subtitle":ParagraphStyle("Subtitle",fontName="Space",fontSize=11.5,leading=16,textColor=ink,spaceAfter=9),
      "body":ParagraphStyle("Body",fontName="Space",fontSize=9.2,leading=13.8,textColor=ink,spaceAfter=6),
      "meta":ParagraphStyle("Meta",fontName="Space",fontSize=8.4,leading=12,textColor=muted,spaceAfter=6),
      "section":ParagraphStyle("Section",fontName="SpaceBold",fontSize=11,leading=16,textColor=accent,spaceBefore=17,spaceAfter=8),
      "project":ParagraphStyle("Project",fontName="SpaceBold",fontSize=11,leading=16,textColor=ink,spaceBefore=8,spaceAfter=4),
    }
    flow=[]
    def para(text,style="body"): return Paragraph(text,styles[style])
    flow += [para("Suhas Beemineni","name"),para("Student building software for aerospace and AI.","subtitle"),
      para('<link href="mailto:suhas.aug20@gmail.com">suhas.aug20@gmail.com</link>  |  <link href="https://github.com/suhaslord">github.com/suhaslord</link>  |  <link href="https://suhaslord.github.io/portfolio/">Portfolio</link>',"meta"),
      Spacer(1,8),HRFlowable(width="100%",thickness=.7,color=HexColor("#ccd2d5")),
      para("SELECTED ENGINEERING WORK","section")]
    blocks=[
      ("Voyager / Elodin","Open-source contributor",
       'Contributed position/velocity error telemetry against SPICE reference data and an optional heliocentric relative gravity model to Elodin\'s Voyager example. <link href="https://github.com/elodin-sys/elodin/pull/769">PR #769</link> and <link href="https://github.com/elodin-sys/elodin/pull/789">PR #789</link> merged. A reconstructed Jupiter validation case (<link href="https://github.com/elodin-sys/elodin/pull/805">#805</link>) remains in review.'),
      ("AegisLand","Independent perception-reliability research",
       'Built simulation experiments, supervisory estimation variants, evaluation protocols, and a public result archive. Phase 10R evaluated 1,440 truth-visible frames: mean error improved, but tail, miss-rate, and uncertainty-coverage gates failed. Kept the failed holdout result frozen. Simulation only. <link href="https://github.com/suhaslord/uav-safety-research">Source and results</link>.'),
      ("AbstainBench","Independent language-model evaluation project",
       'Built a 30-question browser benchmark measuring correct answers, hallucinations, and false abstentions, with JSON/Markdown export. Includes a transparent offline baseline and optional local WebLLM inference. The offline baseline checks the evaluation pipeline, not model quality. <link href="https://github.com/suhaslord/AbstainBench">Source</link>.'),
      ("Seagulls / OpenStage","AI engineering intern",
       "Work on model routing, memory boundaries, tracing, guardrails, and QA, with attention to assistant behavior across product paths.")
    ]
    for title,role,text in blocks:
        flow.append(KeepTogether([para(title,"project"),para(role,"meta"),para(text)]))
    flow += [para("TOOLS &amp; EDUCATION","section"),para("Python, JavaScript, SPICE, Elodin, computer vision, PX4/Gazebo, WebLLM and WebGPU."),
             para("High school student at River Islands High School. Interests include aerospace simulation, perception reliability, and applied AI.")]
    doc=SimpleDocTemplate(str(ROOT/"suhas-beemineni.pdf"),pagesize=(612,792),rightMargin=48,leftMargin=48,topMargin=43,bottomMargin=40,title="Suhas Beemineni - Resume",author="Suhas Beemineni")
    def footer(c,doc):
        c.setFont("Space",7.5);c.setFillColor(muted)
        c.drawString(48,25,"Project status verified September 5, 2026. Public evidence linked above.")
    doc.build(flow,onFirstPage=footer,onLaterPages=footer)

if __name__=="__main__":
    social()
    resume()
    print("Updated the social preview and résumé PDF.")
