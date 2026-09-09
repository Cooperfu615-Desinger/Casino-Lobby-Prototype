#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Read-only checks for shared specification Markdown and exported HTML.

Run after export_spec_html.py. This validates document structure and references,
not prototype interaction, product acceptance or external services.
"""
from collections import Counter
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

import markdown

ROOT = Path(__file__).resolve().parents[1]
SEPARATOR = re.compile(r'\|(?:\s*:?-+:?\s*\|)+')
AC_ID = r'AC-\d{2}-\d{3}'
SC_ID = r'SC-\d{2}-\d{2}'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def normalize(text):
    return ' '.join(text.split())


class ParsedHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.text = []
        self.tables = []
        self.cell = None
        self.digest = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
        if tag == 'meta' and attrs.get('name') == 'source-sha256':
            self.digest = attrs.get('content')
        if tag == 'table':
            self.tables.append([])
        elif tag == 'tr':
            self.tables[-1].append([])
        elif tag in ('td', 'th'):
            self.cell = []
        elif tag == 'br':
            self.handle_data(' ')

    def handle_data(self, text):
        self.text.append(text)
        if self.cell is not None:
            self.cell.append(text)

    def handle_endtag(self, tag):
        if tag in ('td', 'th'):
            self.tables[-1][-1].append(normalize(''.join(self.cell)))
            self.cell = None


def parse_html(text):
    parsed = ParsedHTML()
    parsed.feed(text)
    parsed.close()
    return parsed


def plain_cell(cell):
    return normalize(''.join(parse_html(markdown.markdown(cell.strip())).text))


def markdown_tables(source):
    """Reject malformed tables before comparing every cell with HTML."""
    tables = []
    lines = source.splitlines()
    index = 0
    while index < len(lines):
        if not lines[index].startswith('|'):
            index += 1
            continue
        start = index
        block = []
        while index < len(lines) and lines[index].startswith('|'):
            block.append(lines[index])
            index += 1
        require(len(block) >= 2 and SEPARATOR.fullmatch(block[1]),
                f'Invalid table header at line {start + 1}')
        require(not any(SEPARATOR.fullmatch(line) for line in block[2:]),
                f'Merged adjacent tables at line {start + 1}; add a blank line')
        rows = [[plain_cell(c) for c in re.split(r'(?<!\\)\|', line)[1:-1]]
                for row, line in enumerate(block) if row != 1]
        require(all(len(row) == len(rows[0]) for row in rows),
                f'Inconsistent Markdown column count at line {start + 1}')
        tables.append(rows)
    return tables


def expand_ac_refs(cell):
    prefix = None
    refs = []
    for item in re.split(r'[\u3001,\uff0c/\uff0f]', cell.strip()):
        match = re.fullmatch(
            r'(AC-\d{2}-)?(\d{3})(?:\uFF5E(AC-\d{2}-)?(\d{3}))?', item.strip())
        require(match is not None, f'Invalid AC reference: {cell}')
        explicit, start, end_prefix, end = match.groups()
        prefix = explicit or prefix
        require(prefix and (not end_prefix or end_prefix == prefix),
                f'Ambiguous AC range: {cell}')
        require(int(end or start) >= int(start), f'Reversed range: {cell}')
        refs.extend(f'{prefix}{number:03}'
                    for number in range(int(start), int(end or start) + 1))
    return refs


def check_coverage(source):
    ac = re.findall(r'^\| (' + AC_ID + r') \|', source, re.M)
    scenarios = re.findall(r'^\| (' + SC_ID + r') \|(.+?)\|\s*$', source, re.M)
    sc = [item[0] for item in scenarios]
    for label, ids in [('AC', ac), ('SC', sc)]:
        duplicates = [key for key, count in Counter(ids).items() if count > 1]
        require(not duplicates, f'Duplicate {label} definitions: {duplicates}')
    refs = set()
    for scenario, row in scenarios:
        refs.update(expand_ac_refs(row.split('|')[-1]))
        require(f'<a id="us-{scenario[3:5]}"></a>' in source,
                f'Missing owning story: {scenario}')
    require(refs <= set(ac), f'Unknown AC references: {sorted(refs - set(ac))}')
    require(set(ac) <= refs, f'AC without SC: {sorted(set(ac) - refs)}')
    for pattern, defined in [(AC_ID, set(ac)), (SC_ID, set(sc))]:
        require(set(re.findall(pattern, source)) <= defined,
                f'Unknown explicit reference matching {pattern}')
    for family, count in [('ch', 15), ('flow', 10), ('us', 14)]:
        for number in range(1, count + 1):
            anchor = f'<a id="{family}-{number:02}"></a>'
            require(source.count(anchor) == 1, f'Missing/duplicate {anchor}')
    return len(ac), len(sc)


def check_documents(root=ROOT):
    files = [root / 'docs/APP_FRONTEND_SPEC.md',
             *sorted((root / 'docs/spec-templates').glob('*.md')),
             *sorted((root / 'docs/spec').glob('*.md')), root / 'docs/spec-guidelines/APP_SPEC_RULES.md']
    parsed_files = {}
    for path in files:
        source = path.read_text(encoding='utf-8')
        output = path.with_suffix('.html')
        parsed = parse_html(output.read_text(encoding='utf-8'))
        require(parsed.digest == sha256(path.read_bytes()).hexdigest(),
                f'Stale HTML: {output}')
        require(len(parsed.ids) == len(set(parsed.ids)), f'Duplicate HTML IDs: {output}')
        expected = markdown_tables(source)
        require(expected == parsed.tables, f'Markdown/HTML table content mismatch: {output}')
        parsed_files[output.resolve()] = parsed
        print(f'{output.relative_to(root)}: {len(expected)} tables, all cells and hash OK')
    for output, parsed in parsed_files.items():
        for link in parsed.links:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue  # External availability is outside this local check.
            target = (output.parent / unquote(url.path)).resolve() if url.path else output
            require(target.exists(), f'Missing local link in {output}: {link}')
            if url.fragment and target in parsed_files:
                require(unquote(url.fragment) in parsed_files[target].ids,
                        f'Missing fragment in {output}: {link}')
    for path in sorted((root / 'docs/spec').glob('*.md')):
        if not 3 <= int(path.name[:2]) <= 12:
            continue  # Overview, shared rules and journeys have their own structures.
        source = path.read_text(encoding='utf-8')
        sections = re.findall(r'^## (\d+)\. ', source, re.M)
        require(sections == [str(n) for n in range(1, 18)],
                f'Expected ordered 17 sections: {path}')
        story_ids = re.findall(r'^\| \*\*(US-[UDQ]-\d{2}-\d{3}) ', source, re.M)
        require(len(story_ids) == len(set(story_ids)), f'Duplicate role stories: {path}')
        require(all(any(i.startswith('US-' + role) for i in story_ids) for role in 'UDQ'),
                f'Missing story perspective: {path}')
    coverage_source = files[0].read_text(encoding='utf-8') + '\n' + '\n'.join(p.read_text(encoding='utf-8') for p in sorted((root / 'docs/spec').glob('*.md')))
    ac_count, sc_count = check_coverage(coverage_source)
    print(f'{ac_count} AC, {sc_count} SC; every AC referenced; anchors/local links OK')
    print('Document checks only; no application or service acceptance performed.')


if __name__ == '__main__':
    check_documents()
