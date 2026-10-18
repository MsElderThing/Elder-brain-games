"""Generate branded placeholder art: kraft-paper photo slots with a tentacle doodle, and mock box art.
Run: python3 scripts/placeholders.py  (writes to public/img)"""
import math, random, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = 'public/img'; os.makedirs(OUT, exist_ok=True)
LILITA = '/tmp/lilita.ttf'; ATK = '/tmp/atk.ttf'
BONE = (239, 230, 207); KRAFT = (201, 174, 128); KRAFT_D = (166, 138, 94); INK = (7, 8, 7)
MOSS = (110, 166, 74); MOSS_B = (159, 211, 108); MOSS_D = (47, 90, 43)
random.seed(7)

def kraft(w, h, base=KRAFT):
    im = Image.new('RGB', (w, h), base)
    px = im.load()
    for y in range(h):
        for x in range(0, w, 1):
            n = random.randint(-14, 14)
            r, g, b = base
            px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    # fibers
    d = ImageDraw.Draw(im)
    for _ in range(w * h // 1800):
        x = random.randint(0, w); y = random.randint(0, h); L = random.randint(6, 30); a = random.uniform(0, math.pi)
        d.line([(x, y), (x + L * math.cos(a), y + L * math.sin(a))], fill=(base[0] - 25, base[1] - 25, base[2] - 25), width=1)
    return im

def tentacle(d, x0, y0, length, width, angle=-1.2, curl=1.0, color=MOSS_D, hi=MOSS, suck=MOSS_B, flip=1):
    pts = []
    for i in range(0, 41):
        s = i / 40
        a = angle + flip * curl * s * s * 2.2
        x0 += math.cos(a) * length / 40; y0 += math.sin(a) * length / 40
        pts.append((x0, y0, s))
    for i in range(len(pts) - 1):
        (x, y, s), (x2, y2, _) = pts[i], pts[i + 1]
        wdt = width * (1 - s * 0.85) + 2
        d.line([(x, y), (x2, y2)], fill=INK, width=int(wdt + 6))
    for i in range(len(pts) - 1):
        (x, y, s), (x2, y2, _) = pts[i], pts[i + 1]
        wdt = width * (1 - s * 0.85) + 2
        d.line([(x, y), (x2, y2)], fill=color, width=int(wdt))
        d.ellipse([x - wdt / 2, y - wdt / 2, x + wdt / 2, y + wdt / 2], fill=color)
    for i in range(len(pts) - 1):
        (x, y, s), (x2, y2, _) = pts[i], pts[i + 1]
        wdt = width * (1 - s * 0.85) * 0.45
        d.line([(x, y), (x2, y2)], fill=hi, width=max(1, int(wdt)))
    for i in range(3, len(pts) - 2, 4):
        x, y, s = pts[i]; r = width * 0.22 * (1 - s * 0.7)
        d.ellipse([x - r, y - r, x + r, y + r], fill=suck, outline=INK, width=2)
        d.ellipse([x - r * .45, y - r * .45, x + r * .45, y + r * .45], fill=(27, 46, 26))

def die(d, cx, cy, size, pips=5):
    r = size / 2
    d.rounded_rectangle([cx - r, cy - r, cx + r, cy + r], radius=size * 0.18, fill=BONE, outline=INK, width=4)
    p = size * 0.11; o = size * 0.26
    spots = {1: [(0, 0)], 3: [(-o, -o), (0, 0), (o, o)], 5: [(-o, -o), (o, -o), (0, 0), (-o, o), (o, o)], 6: [(-o, -o), (o, -o), (-o, 0), (o, 0), (-o, o), (o, o)]}[pips]
    for dx, dy in spots: d.ellipse([cx + dx - p, cy + dy - p, cx + dx + p, cy + dy + p], fill=INK)

def label(im, text, sub):
    d = ImageDraw.Draw(im); w, h = im.size
    f1 = ImageFont.truetype(LILITA, int(min(w, h) * 0.055)); f2 = ImageFont.truetype(ATK, int(min(w, h) * 0.028))
    tw = d.textlength(text, font=f1); sw = d.textlength(sub, font=f2)
    bw = max(tw, sw) + 50; bh = f1.size + f2.size + 40
    x = 44; y = 44
    d.rounded_rectangle([x, y, x + bw, y + bh], radius=8, fill=BONE, outline=INK, width=4)
    d.text((x + 25, y + 12), text, font=f1, fill=INK)
    d.text((x + 25, y + 18 + f1.size), sub, font=f2, fill=(80, 70, 50))

def slot(name, w, h, title, sub, arms):
    im = kraft(w, h); d = ImageDraw.Draw(im)
    # mat frame
    d.rectangle([14, 14, w - 14, h - 14], outline=INK, width=5)
    d.rectangle([26, 26, w - 26, h - 26], outline=(120, 100, 65), width=2)
    for a in arms: tentacle(d, *a)
    die(d, w * 0.62, h * 0.5, min(w, h) * 0.16, pips=5)
    label(im, title, sub)
    im.save(f'{OUT}/{name}.jpg', quality=86, optimize=True)

slot('hero', 1600, 900, 'Photo goes here', 'Kids at the table, mid-game, daylight. Replace public/img/hero.jpg',
     [(-40, 900, 900, 110, -1.1, 1.0, MOSS_D, MOSS, MOSS_B, 1), (1700, 940, 820, 95, -2.1, 1.0, MOSS_D, MOSS, MOSS_B, -1)])
slot('about', 900, 1100, 'Alex and Curtis', 'A photo of the two of you with games. Replace public/img/about.jpg',
     [(-30, 1120, 700, 80, -1.0, 1.1, MOSS_D, MOSS, MOSS_B, 1)])
slot('con', 1200, 800, 'Our con table', 'Gamehole Con or any show. Replace public/img/con.jpg',
     [(1240, 820, 700, 80, -2.2, 1.0, MOSS_D, MOSS, MOSS_B, -1)])
slot('kit', 1200, 900, 'Classroom kit', 'Six boxes, lesson plan on top. Replace public/img/kit.jpg',
     [(-30, 920, 620, 70, -1.0, 1.2, MOSS_D, MOSS, MOSS_B, 1)])
for i, (nm, sub) in enumerate([('cards', 'A fan of cards'), ('board', 'A board mid-play'), ('boxes', 'A stack of boxes')]):
    slot(f'detail-{nm}', 800, 800, 'Detail shot', sub + f'. Replace public/img/detail-{nm}.jpg',
         [(-20 if i % 2 == 0 else 820, 820, 520, 60, -1.0 if i % 2 == 0 else -2.2, 1.1, MOSS_D, MOSS, MOSS_B, 1 if i % 2 == 0 else -1)])

# mock box art: colored box, title, age sticker, 'sample' tape
GAMES = [('cartographers-apprentice', "Cartographer's Apprentice", (59, 106, 58)), ('ratfolk-bakery', 'Ratfolk Bakery', (138, 90, 43)),
         ('gear-goblins', 'Gear Goblins', (90, 74, 122)), ('tidepool-tactics', 'Tidepool Tactics', (43, 106, 122)),
         ('alphabet-dungeon', 'Alphabet Dungeon', (122, 43, 58)), ('the-long-ballad', 'The Long Ballad', (96, 86, 40)),
         ('council-of-crows', 'Council of Crows', (43, 58, 90)), ('fractions-kit', 'Fractions Kit', (47, 90, 43)),
         ('storytelling-kit', 'Storytelling Kit', (47, 90, 43)), ('club-in-a-box', 'Club in a Box', (47, 90, 43))]
def box(slug, title, color):
    w, h = 720, 900
    im = kraft(w, h, base=BONE); d = ImageDraw.Draw(im)
    # box with shadow
    d.rounded_rectangle([110, 120, 640, 820], radius=10, fill=(0, 0, 0))
    im2 = im.filter(ImageFilter.GaussianBlur(14)); im.paste(im2, (0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([90, 90, 620, 790], radius=8, fill=color, outline=INK, width=5)
    # top band
    d.rectangle([90, 90, 620, 130], fill=(max(0, color[0] - 30), max(0, color[1] - 30), max(0, color[2] - 30)))
    # art: tentacle + die
    tentacle(d, 60, 820, 520, 70, -1.1, 1.0, MOSS_D, MOSS, MOSS_B, 1)
    die(d, 420, 520, 150, pips=3)
    # title
    f = ImageFont.truetype(LILITA, 64); words = title.split(' '); lines = []; cur = ''
    for wd in words:
        t = (cur + ' ' + wd).strip()
        if d.textlength(t, font=f) > 460: lines.append(cur); cur = wd
        else: cur = t
    lines.append(cur); y = 170
    for ln in lines:
        for dx, dy in [(4, 4)]: d.text((130 + dx, y + dy), ln, font=f, fill=INK)
        d.text((130, y), ln, font=f, fill=BONE); y += 70
    # sample tape
    tape = Image.new('RGBA', (420, 54), (0, 0, 0, 0)); td = ImageDraw.Draw(tape)
    td.rectangle([0, 0, 420, 54], fill=(226, 182, 74, 235)); ft = ImageFont.truetype(LILITA, 30)
    tt = 'SAMPLE ART'; td.text(((420 - td.textlength(tt, font=ft)) / 2, 9), tt, font=ft, fill=INK)
    tape = tape.rotate(-12, expand=True, resample=Image.BICUBIC)
    im.paste(tape, (330, 640), tape)
    im.save(f'{OUT}/box-{slug}.jpg', quality=86, optimize=True)
for g in GAMES: box(*g)

# share image
im = Image.new('RGB', (1200, 630), INK); d = ImageDraw.Draw(im)
tentacle(d, -40, 660, 700, 90, -1.1, 1.0, MOSS_D, MOSS, MOSS_B, 1); tentacle(d, 1240, 680, 650, 80, -2.1, 1.0, MOSS_D, MOSS, MOSS_B, -1)
f = ImageFont.truetype(LILITA, 110); f2 = ImageFont.truetype(ATK, 36)
for i, t in enumerate(['ELDER', 'BRAIN', 'GAMES']):
    tw = d.textlength(t, font=f); d.text(((1200 - tw) / 2 + 5, 90 + i * 115 + 5), t, font=f, fill=MOSS_D); d.text(((1200 - tw) / 2, 90 + i * 115), t, font=f, fill=BONE)
s = 'Games for classrooms, libraries, and homeschool co-ops'; d.text(((1200 - d.textlength(s, font=f2)) / 2, 470), s, font=f2, fill=MOSS_B)
im.save(f'{OUT}/og.png', optimize=True)
print(sorted(os.listdir(OUT)))
