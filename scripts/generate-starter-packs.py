"""Offline PDF authoring. First run export-starter-pack.ts; see growth-experiments.md."""
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Flowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer
from pypdf import PdfReader, PdfWriter

source = Path(sys.argv[1]).read_bytes()
pack = json.loads(source)
css = Path("src/app/globals.css").read_text()
palette = {name: re.search(rf"--color-{name}:\s*(#[0-9a-fA-F]{{6}})", css).group(1) for name in ["foreground", "muted", "brand"]}
ink = colors.HexColor(palette["foreground"])
muted = colors.HexColor(palette["muted"])
brand = colors.HexColor(palette["brand"])
font_directory = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("WorksheetSans", str(font_directory / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("WorksheetSansBold", str(font_directory / "DejaVuSans-Bold.ttf")))

styles = {
    "title": ParagraphStyle("title", fontName="WorksheetSansBold", fontSize=25, leading=29, textColor=ink, spaceAfter=9),
    "heading": ParagraphStyle("heading", fontName="WorksheetSansBold", fontSize=11, leading=15, textColor=ink, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="WorksheetSans", fontSize=10, leading=14, textColor=ink, spaceAfter=8),
    "small": ParagraphStyle("small", fontName="WorksheetSans", fontSize=8.5, leading=12, textColor=muted, spaceAfter=5, splitLongWords=True, alignment=TA_LEFT),
    "label": ParagraphStyle("label", fontName="WorksheetSansBold", fontSize=9, leading=13, textColor=brand, spaceAfter=8),
}

def clean(text):
    return text.replace("\u2013", "-").replace("\u2014", "-").replace("\u2011", "-")

def paragraph(text, style="body"):
    return Paragraph(escape(clean(text)), styles[style])

class WritingLines(Flowable):
    def __init__(self, count=2):
        super().__init__()
        self.count = count
        self.height = count * 8 * mm

    def wrap(self, width, height):
        self.width = width
        return width, self.height

    def draw(self):
        self.canv.setStrokeColor(colors.HexColor("#8b929c"))
        self.canv.setLineWidth(0.5)
        for index in range(self.count):
            y = self.height - (index + 1) * 8 * mm + 3 * mm
            self.canv.line(0, y, self.width, y)

def heading(assignment, teacher=False):
    return [
        paragraph("GLOBEPICK  /  COUNTRY PROFILE  /  " + ("TEACHER NOTES" if teacher else f"ASSIGNMENT {assignment['number']}"), "label"),
        paragraph(assignment["country"]["name"], "title"),
    ]

def student(assignment):
    story = heading(assignment)
    story += [paragraph("Use an atlas and at least one other reliable source. Answer in your own words. Record the sources you use. Continue longer answers or map sketches on another sheet."), Spacer(1, 3 * mm)]
    for number, prompt in enumerate(assignment["prompts"], 1):
        story += [paragraph(f"{number}. {prompt['title']}", "heading"), paragraph(prompt["question"]), WritingLines(), Spacer(1, 3 * mm)]
    story += [paragraph("Sources I used", "heading"), paragraph("Record the author or organization, title, URL or book page, and date checked.", "small"), WritingLines()]
    return story

def teacher(assignment):
    story = heading(assignment, True)
    story += [paragraph("Teaching focus: " + pack["purpose"]), paragraph("Assess evidence and reasoning. These are research questions, not a fixed answer key. Adapt the task to your learners."), paragraph("Reference snapshot", "heading")]
    for fact in assignment["reference"]["facts"]:
        story += [paragraph(f"{fact['label']}: {fact['value']}", "small")]
    for note in assignment["reference"]["notes"]:
        story += [paragraph(note, "small")]
    story += [paragraph("Reference reviewed " + assignment["country"]["reviewed"] + ". Community dataset fields are not a complete account of language use or an independent audit of every fact. Check current official sources for changing details.", "small"), Spacer(1, 2 * mm), paragraph("What to look for", "heading")]
    for number, prompt in enumerate(assignment["prompts"], 1):
        story += [paragraph(f"{number}. {prompt['title']}: {prompt['guidance']}", "small")]
    story += [Spacer(1, 2 * mm), paragraph("Sources and further reading", "heading")]
    urls = list(dict.fromkeys(assignment["reference"]["sources"] + [item["url"] for item in assignment["furtherReading"]]))
    for url in urls:
        title = next((item["title"] for item in assignment["furtherReading"] if item["url"] == url), "Pinned mledoze/countries community database")
        story += [paragraph(title, "small"), Paragraph(f'<link href="{escape(url)}" color="{palette["brand"]}">{escape(url)}</link>', styles["small"])]
    story += [paragraph("Database attribution: mledoze/countries and contributors, adapted by GlobePick. ODbL 1.0: https://opendatacommons.org/licenses/odbl/1-0/ . Questions and teaching notes may be copied and adapted for classroom use.", "small")]
    return story

output = Path("output/pdf")
public = Path("public/packs")
app_data = Path("src/data/worksheet-packs")
for directory in [output, public, app_data]:
    directory.mkdir(parents=True, exist_ok=True)

files = []
for name, page_size in [("a4", A4), ("letter", letter)]:
    filename = f"globepick-country-profile-{name}.pdf"
    document = SimpleDocTemplate(str(output / filename), pagesize=page_size, leftMargin=15 * mm, rightMargin=15 * mm, topMargin=15 * mm, bottomMargin=17 * mm, title="GlobePick: Japan and South Africa country profiles", author="GlobePick", subject="Two research worksheets and two teacher reference sheets", pageCompression=1, invariant=1)
    story = []
    for assignment in pack["assignments"]:
        if story:
            story.append(PageBreak())
        story += student(assignment)
    for assignment in pack["assignments"]:
        story.append(PageBreak())
        story += teacher(assignment)

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("WorksheetSans", 8)
        canvas.setFillColor(muted)
        canvas.drawString(15 * mm, 10 * mm, "GlobePick | Country profile | " + ("A4" if name == "a4" else "US Letter"))
        canvas.drawRightString(page_size[0] - 15 * mm, 10 * mm, f"{doc.page} / {pack['pages']}")
        canvas.restoreState()

    document.build(story, onFirstPage=footer, onLaterPages=footer)
    # Keep the embedded typeface notice with the PDF even when it is shared alone.
    writer = PdfWriter(clone_from=output / filename)
    writer.add_attachment("Worksheet-font-license.txt", Path("public/licenses/worksheet-fonts-DejaVu.txt").read_bytes())
    with (output / filename).open("wb") as handle:
        writer.write(handle)
    pdf = PdfReader(output / filename)
    assert len(pdf.pages) == pack["pages"], "Unexpected pagination; review layout before publication."
    for page in pdf.pages:
        assert abs(float(page.mediabox.width) - page_size[0]) < 1
        assert abs(float(page.mediabox.height) - page_size[1]) < 1
        assert page.extract_text().strip()
    shutil.copyfile(output / filename, public / filename)
    content = (public / filename).read_bytes()
    files.append({"paper": name, "path": "/packs/" + filename, "pages": len(pdf.pages), "bytes": len(content), "sha256": hashlib.sha256(content).hexdigest()})

manifest = {"id": pack["id"], "reviewed": pack["reviewed"], "countryIds": pack["countryIds"], "sourceSha256": hashlib.sha256(source).hexdigest(), "palette": palette, "files": files}
for destination in [public / "manifest.json", app_data / "manifest.json"]:
    destination.write_text(json.dumps(manifest, indent=2) + "\n")
print("Created and structurally checked two four-page starter packs.")
