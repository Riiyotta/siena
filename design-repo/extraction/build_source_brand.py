#!/usr/bin/env python3
"""Derive the source-identity registry that PageSpec `mode: "generated"` must not contain.

Writes
  assets/asset-roles.json  -> "sourceBrand"   (name / URL / person / customer patterns, derivation notes, counts)
  assets/source-copy-hashes.json              (SHA-256 prefixes of source copy shingles and of source asset file stems)

Nothing here is invented: every entry is read from the clone's own files (src/*.js|jsx string literals and
`name:` / `brand:` / `alt:` / `logoAlt:` fields, URL literals, CLONE_SPEC.md and specs/*.md quoted copy, the file
names in public/ and recon/). Copy and asset names are stored as HASHES, never as text, so this repository does not
become a second copy of the source's marketing copy. Names are stored as plain patterns because a pattern that is
not readable cannot be reviewed.

NO HUMAN HAS REVIEWED THE DERIVED LISTS. They are heuristics over the clone's data (see `derivation` in the output),
pinned in extraction/verify_all.py (minimum content) and re-derived by `--check` whenever the sibling source tree exists.

Run:  python3 extraction/build_source_brand.py [--check]
Without the sibling src/ tree (a standalone copy) it prints a notice and exits 0 (verify_all then pins only the minimum).
"""
import hashlib
import json
import os
import re
import sys

DR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT = os.path.dirname(DR)
SRC = os.path.join(PROJECT, "src")
ROLES = os.path.join(DR, "assets", "asset-roles.json")
HASHES = os.path.join(DR, "assets", "source-copy-hashes.json")
SHINGLE_N = 5
MIN_STRING_WORDS = 5
MEDIA_EXT = (".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".mp4", ".webm", ".json", ".avif")
DICT = "/usr/share/dict/words"

# Values of `name:`-like fields that are UI/data labels, not entities (all other values are read from the source).
NOT_AN_ENTITY = {"", "logo", "image", "logo 2", "brand logo", "full name", "company", "role", "website", "workemail", "phonenumber",
                 "account management", "engineering", "gtm", "marketing", "operations", "product"}
SHARED_PLATFORM_HOSTS = {"www.linkedin.com", "x.com", "www.youtube.com", "luma.com", "jobs.ashbyhq.com"}
IGNORED_HOSTS = {"www.w3.org"}  # SVG/XML namespace, not a link
LOREM = re.compile(r"\b(lorem|ipsum|dolor|consectetur|adipiscing|eiusmod|tempor|incididunt)\b", re.I)
STR_RE = re.compile(r"""(?P<q>['"`])(?P<t>(?:\\.|(?!(?P=q)).)*)(?P=q)""", re.S)
JSX_TEXT_RE = re.compile(r">([^<>{}]+)<")
FIELD_RE = lambda k: re.compile(r"""\b%s:\s*(?P<q>['"])(?P<t>(?:\\.|(?!(?P=q)).)*)(?P=q)""" % k)  # noqa: E731
URL_RE = re.compile(r"https?://[A-Za-z0-9./_?=&%#:@~+-]+")
PERSON_RE = re.compile(r"^[A-Z][A-Za-zÀ-ÿ'’.-]+(?: [A-Z][A-Za-zÀ-ÿ'’.-]*){1,3}$")


def unesc(s):
    return s.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\").replace("\\n", " ")


def norm_words(s):
    s = unesc(s).lower().replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = re.sub(r"\*|_|`", " ", s)
    return re.findall(r"[a-z0-9]+(?:'[a-z]+)?", s)


def h16(s):
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:16]


def read(p):
    return open(p, encoding="utf-8", errors="replace").read()


def source_files():
    out = []
    for root, _, fs in os.walk(SRC):
        for fn in sorted(fs):
            if fn.endswith((".js", ".jsx")):
                out.append(os.path.join(root, fn))
    return sorted(out)


def copy_strings():
    """Human-readable strings (>= 5 words, mostly alphabetic, not code, not lorem) from src/ and the measured specs."""
    out = []
    texts = [read(p) for p in source_files()]
    spec_files = [os.path.join(PROJECT, "CLONE_SPEC.md")] + [os.path.join(PROJECT, "specs", f) for f in sorted(os.listdir(os.path.join(PROJECT, "specs"))) if f.endswith(".md")]
    for p in spec_files:
        if os.path.exists(p):
            texts.append(read(p))
    for t in texts:
        cands = [m.group("t") for m in STR_RE.finditer(t)] + [m.group(1) for m in JSX_TEXT_RE.finditer(t)]
        cands += re.findall(r"“([^”]{20,})”", t)
        for c in cands:
            c = unesc(c).strip()
            if re.search(r"[{}=;<>\\]|=>|\$\{|https?://|\.(png|svg|webp|jpg|jpeg|mp4|css|jsx?)\b", c):
                continue
            w = norm_words(c)
            if len(w) < MIN_STRING_WORDS or LOREM.search(c):
                continue
            alpha = sum(1 for x in w if re.fullmatch(r"[a-z']+", x))
            if alpha / len(w) < 0.7:
                continue
            if sum(1 for x in w if x in ("flex", "items", "center", "px", "rounded", "text", "bg", "grid", "gap", "mt", "mb")) >= 3:
                continue
            out.append(w)
    return out


def shingles(strings):
    s = set()
    for w in strings:
        for i in range(len(w) - SHINGLE_N + 1):
            s.add(h16(" ".join(w[i:i + SHINGLE_N])))
    return sorted(s)


def fields(key):
    rx = FIELD_RE(key)
    vals = []
    for p in source_files():
        for m in rx.finditer(read(p)):
            vals.append((os.path.relpath(p, PROJECT), unesc(m.group("t")).strip()))
    return vals


def entity_names():
    """customers/partners/investors (logo owners), people, third-party platforms (integrations / competitors)."""
    customers, people, third = set(), set(), set()
    logo_arrays = ("src/pages/AboutUs.jsx", "src/components/conversion/LeadSections.jsx", "src/pages/PartnerWithSiena.jsx")
    for key in ("name", "brand", "company", "alt"):
        for f, v in fields(key):
            if v.lower() in NOT_AN_ENTITY or v.lower().startswith("frame "):
                continue
            if key == "alt":
                if f in logo_arrays and len(v.split()) <= 4:
                    customers.add(v)
            elif key == "name":
                if f.endswith("tickerData.js"):
                    customers.add(v)
                elif PERSON_RE.match(v):
                    people.add(v)
            else:
                customers.add(v)
    for f, v in fields("logoAlt"):
        v = re.sub(r",.*$", "", v)
        v = re.sub(r"\s+logo$", "", v, flags=re.I).strip()
        if v and v.lower() not in NOT_AN_ENTITY and v.lower() != "brand":
            customers.add(v)
    for f, v in fields("role"):
        m = re.search(r"(?:\bat |, )([A-Z][A-Za-zÀ-ÿ0-9&.' -]{1,40})$", v)
        if m and not re.search(r"\b(CEO|COO|CMO|CXO|Founder|Co-Founder|Director|Head|VP|Lead|Manager|Chief|Officer|Consultant|Operations|Customer|Experience|Strategy|Fulfillment|Brand|Retention|Partnerships|Community|Education)\b", m.group(1), re.I):
            customers.add(m.group(1).strip())
    for p in source_files():
        t = read(p)
        for m in re.finditer(r"guest:\s*\[\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'", t):
            people.add(m.group(1))
            customers.add(m.group(3))
    # customer stories: the slug stem that also appears in the story title
    cd = read(os.path.join(SRC, "components", "company", "customersData.js"))
    for slug, title in re.findall(r"\['([a-z0-9-]+)',\s*'[^']*',\s*\[[^\]]*\],\s*'((?:\\.|[^'\\])*)'\]", cd):
        tl = " ".join(norm_words(unesc(title)))
        parts = slug.split("-")
        cand = parts[0]
        if cand not in ("how", "from", "siena", "the") and re.search(r"\b" + re.escape(cand) + r"\b", tl):
            customers.add(cand.capitalize())
    # integrations / platforms and competitors
    pg = read(os.path.join(SRC, "pages", "PartnerWithSiena.jsx"))
    m = re.search(r"const TECH = \[(.*?)\]\.map", pg, re.S)
    if m:
        third |= set(re.findall(r"\['([a-z]+)'", m.group(1)))
    for f, v in fields("competitor"):
        third.add(v.split(" ")[0].title())
    il = read(os.path.join(SRC, "components", "content", "insightsLogos.js"))
    third |= set(re.findall(r"^\s{2}([a-z]+):\s*\"<svg", il, re.M))
    third |= {n for n in ("Zendesk", "Shopify", "Gorgias", "Kustomer", "Gladly", "Intercom", "Klaviyo", "Recharge", "Yotpo", "Okendo", "Slack", "Salesforce", "HubSpot", "Upwork")
              if re.search(r"\b" + n + r"\b", " ".join(read(p) for p in source_files()))}
    dedupe = lambda xs: sorted({x.lower(): x for x in sorted(xs, key=lambda y: (y != y.lower(), y))}.values(), key=str.lower)  # noqa: E731
    customers, third = set(dedupe(customers)), set(dedupe(third))
    people = {x for x in dedupe(people) if x.lower() not in {c.lower() for c in customers}}
    return customers, people, third


def english_words():
    if os.path.exists(DICT):
        return {w.strip().lower() for w in open(DICT, encoding="utf-8", errors="ignore")}
    return set()


def name_pattern(n, case_sensitive=False):
    parts = [re.escape(x) for x in n.split()]
    body = r"(?<![A-Za-z0-9])" + r"\s+".join(parts) + r"(?![A-Za-z0-9])"
    return "(?-i:" + body + ")" if case_sensitive else body


def lowercase_uses():
    """How often each word occurs in lower case as a standalone word of the source's own copy (evidence that it is also an ordinary word)."""
    cnt = {}
    for p in source_files():
        t = read(p)
        for seg in [m.group("t") for m in STR_RE.finditer(t)] + [m.group(1) for m in JSX_TEXT_RE.finditer(t)]:
            if re.search(r"[{}=;<>]|=>", seg) or len(seg.split()) < 3:
                continue
            for w in re.findall(r"[A-Za-z']+", seg):
                cnt[w] = cnt.get(w, 0) + 1
    return cnt


def urls():
    hosts, paths = set(), set()
    for p in source_files():
        for u in URL_RE.findall(read(p)):
            m = re.match(r"https?://([^/?#]+)(/[^?#]*)?", u)
            host, path = m.group(1).lower(), (m.group(2) or "").rstrip("/")
            if host in IGNORED_HOSTS:
                continue
            if host in SHARED_PLATFORM_HOSTS:
                if path and path != "/watch" and not path.startswith("/embed"):
                    paths.add(host + path.lower())
            else:
                hosts.add(host)
    return sorted(hosts), sorted(paths)


def asset_stems():
    stems = set()
    for base in ("public", "recon"):
        for root, _, fs in os.walk(os.path.join(PROJECT, base)):
            for fn in fs:
                if fn.lower().endswith(MEDIA_EXT):
                    stems.add(h16(os.path.splitext(fn)[0].lower()))
    mirror = [d for d in os.listdir(PROJECT) if d.endswith("_files") and os.path.isdir(os.path.join(PROJECT, d))]
    for d in mirror:
        for root, _, fs in os.walk(os.path.join(PROJECT, d)):
            for fn in fs:
                if fn.lower().endswith(MEDIA_EXT):
                    stems.add(h16(os.path.splitext(fn)[0].lower()))
    return sorted(stems)


def build():
    strings = copy_strings()
    customers, people, third = entity_names()
    words = english_words()
    lower_use = lowercase_uses()
    text_customers, cased_customers, ambiguous = [], [], []
    for n in sorted(customers, key=str.lower):
        single = " " not in n
        is_word = single and (n.lower() in words or n.lower().rstrip("s") in words)
        if not is_word or (n.isupper() and len(n) >= 4):
            text_customers.append(n)
        elif lower_use.get(n.lower(), 0) >= 1 or n == n.lower():
            ambiguous.append(n)  # also an ordinary word of the source's own copy, or lower-case styled: not matched in text
        else:
            cased_customers.append(n)  # rare English word: matched only in the source's capitalisation
    hosts, paths = urls()
    brand_tokens = sorted({m.lower() for p in source_files() for m in re.findall(r"siena", read(p), re.I)})
    assert brand_tokens == ["siena"], brand_tokens
    handles = sorted({h.lower() for p in source_files() for h in re.findall(r"(?:linkedin\.com/in|x\.com)/([A-Za-z0-9_-]+)", read(p))})
    handles = [h for h in handles if "siena" not in h]
    brand = {
        "patterns": ["siena", r"idiomatic(?:\.io)?"],
        "derivation": "'siena' is the only brand token found in src/ (case-insensitively, as a substring: Siena, siena.cx, sienaai, siena_ai, Ask Siena, SienaLogo ...). 'idiomatic' is the host the Insights page links to for login (src/components/content/InsightsPage.jsx).",
    }
    opt_www = lambda x: ("(?:www\\.)?" + re.escape(x[4:])) if x.startswith("www.") else re.escape(x)  # noqa: E731
    url_pat = [opt_www(h) for h in hosts] + [opt_www(p) for p in paths if "/in/" not in p]
    url_pat = sorted(set(url_pat))
    reg = {
        "$comment": "GENERATED by extraction/build_source_brand.py from the clone's src/, specs and public/ folders. Not human-reviewed. Do not hand-edit; re-run the script.",
        "note": "Matched case-insensitively against every human-readable string of a `mode: generated` PageSpec (page id, route, head, headings, body, labels, items, alt text, hrefs). Structural vocabulary (template and section ids, variant names, enum values) is exempt: it is the contract's own vocabulary, not rendered text.",
        "brand": brand,
        "urls": {
            "rule": "GENERATED_MODE_SOURCE_URL",
            "hostPatterns": url_pat,
            "personalHandlePatterns": [r"(?:linkedin\.com/in|x\.com)/" + re.escape(h) for h in handles],
            "reservedHostSuffixes": [".example", ".invalid", ".test", ".localhost", "example.com", "example.org", "example.net"],
            "note": "Any other http(s) URL in a generated page's free text is GENERATED_MODE_EXTERNAL_URL; PageSpec href fields are restricted by the schema to internal paths or reserved .example/.invalid hosts.",
        },
        "customers": {
            "rule": "GENERATED_MODE_SOURCE_CUSTOMER",
            "patterns": [name_pattern(n) for n in text_customers] + [name_pattern(n, True) for n in cased_customers],
            "ambiguousEnglishWordNames": ambiguous,
            "ambiguousNote": "Single-word names that are English words (checked against the system word list when the registry is built) fall in three tiers: ALL-CAPS 4+ letters are matched like any name; rare words are matched only in the source's own capitalisation ((?-i:...) patterns); words the source's own copy also uses in lower case, and lower-case styled brand names, are listed here and NOT matched in text (a generated page legitimately says 'create' or 'hero'). They are still blocked as logos (assetRole) and as asset files.",
            "derivation": "logo owners: hero ticker names, `alt` of the investor / partner / lead-page logo arrays, `logoAlt`, `brand`, `company`, 'at X' / ', X' tails of testimonial roles, conversation `guest` brands, customer-story slug stems that also occur in the story title.",
        },
        "people": {
            "rule": "GENERATED_MODE_SOURCE_PERSON",
            "patterns": [name_pattern(n) for n in sorted(people)],
            "derivation": "multi-word capitalised `name:` values (testimonial authors, conversation guests, founders / team, partner testimonial subjects, wall-of-love and quote-grid people) and `guest:` names; first names alone are not matched.",
        },
        "thirdPartyPlatforms": {
            "rule": "GENERATED_MODE_THIRD_PARTY (warning, not an error)",
            "patterns": [name_pattern(n) for n in sorted(third, key=str.lower)],
            "note": "Integration and competitor products the source names. They are real companies but not the source's customers; a generated page may legitimately mention them, so a match only warns.",
        },
        "copy": {
            "rule": "GENERATED_MODE_SOURCE_COPY",
            "file": "assets/source-copy-hashes.json",
            "shingleWords": SHINGLE_N,
            "minStringWords": MIN_STRING_WORDS,
            "sourceStrings": len(strings),
            "note": "A text field is rejected when any run of 5 consecutive normalised words (lower-case, punctuation stripped) hashes to a source shingle. Source strings shorter than 5 words (labels, 'Book a demo', short headings) are not checked: they are too generic to attribute.",
        },
        "assets": {
            "rule": "GENERATED_MODE_ASSET_REF",
            "file": "assets/source-copy-hashes.json",
            "note": "assetRef values of a generated page must be under placeholder/, generated/ or user-supplied/ (schema), and the file stem must not equal a stem of any file in the clone's public/, recon/ or mirrored *_files folders (stored as hashes).",
            "allowedRefPrefixes": ["placeholder", "generated", "user-supplied"],
        },
    }
    counts = {"brandPatterns": len(brand["patterns"]), "urlHostPatterns": len(url_pat), "customerPatterns": len(reg["customers"]["patterns"]),
              "ambiguousCustomerNames": len(ambiguous), "personPatterns": len(reg["people"]["patterns"]), "thirdPartyPatterns": len(reg["thirdPartyPlatforms"]["patterns"])}
    stems = asset_stems()
    reg["counts"] = counts
    hashes = {"$comment": "GENERATED by extraction/build_source_brand.py. SHA-256 prefixes (16 hex) only; no source text is stored.", "copyShingles": shingles(strings), "assetStems": stems}
    reg["counts"]["copyShingles"] = len(hashes["copyShingles"])
    reg["counts"]["assetStems"] = len(stems)
    return reg, hashes


def dump(d):
    return json.dumps(d, indent=2, ensure_ascii=False) + "\n"


def main():
    if not os.path.isdir(SRC):
        print("src/ is not beside design-repo/: source brand registry NOT rebuilt (standalone copy)")
        return 0
    reg, hashes = build()
    roles = json.load(open(ROLES, encoding="utf-8"))
    if "--check" in sys.argv:
        ok = roles.get("sourceBrand") == reg and open(HASHES, encoding="utf-8").read() == dump(hashes)
        print("source brand registry up to date" if ok else "source brand registry OUT OF DATE (run extraction/build_source_brand.py)")
        return 0 if ok else 1
    roles["sourceBrand"] = reg
    open(ROLES, "w", encoding="utf-8").write(dump(roles))
    open(HASHES, "w", encoding="utf-8").write(dump(hashes))
    print("wrote sourceBrand", reg["counts"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
