#!/usr/bin/env python3
"""Regenerate the precise social image and résumé PDF (Pillow, fontTools, reportlab)."""
from pathlib import Path
from io import BytesIO
from fontTools.ttLib import TTFont as FontFile
from PIL import Image, ImageDraw, ImageFont, ImageOps
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
    im = ImageOps.fit(Image.open(ROOT / "assets/space/earthrise.webp").convert("RGB"), (1200, 630), centering=(.5, .76))
    shade = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for y in range(630):
        sd.line((0, y, 1200, y), fill=(0, 0, 0, int(24 + 150 * (y / 630) ** 1.8)))
    im = Image.alpha_composite(im.convert("RGBA"), shade).convert("RGB")
    d = ImageDraw.Draw(im)
    regular = lambda n: ImageFont.truetype(ttf("space-regular"), n)
    display = lambda n: ImageFont.truetype(ttf("lora"), n)
    d.text((50, 35), "Suhas Beemineni", font=display(28), fill="white")
    d.text((52, 303), "Aerospace & AI.", font=display(70), fill="white")
    d.text((52, 381), "Built with curiosity.", font=display(70), fill="white")
    d.line((415, 469, 684, 465), fill="#e8ceff", width=3)
    d.text((54, 514), "A student building spacecraft simulations and reliable AI.", font=regular(22), fill="white")
    d.text((54, 578), "suhaslord.github.io/portfolio", font=regular(17), fill="#e8ceff")
    d.text((850, 585), "Earthrise: NASA / Bill Anders", font=regular(13), fill="white")
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
