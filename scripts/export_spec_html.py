#!/usr/bin/env python3
"""產生規格書與模板 HTML：python3 scripts/export_spec_html.py
需要 Python 3 與 Python-Markdown（import markdown）。Markdown 為唯一正文來源。
HTML 內嵌樣式，不需啟動服務或連線即可閱讀；Mermaid 入口圖轉為入口關係卡。
"""
from pathlib import Path
import hashlib
import html
import re
import os
from urllib.parse import urlsplit, unquote
import markdown

ROOT = Path(__file__).resolve().parents[1]
FILES = [ROOT / 'docs/APP_FRONTEND_SPEC.md', *sorted((ROOT / 'docs/spec-templates').glob('*.md')), *sorted((ROOT / 'docs/spec').glob('*.md')), ROOT / 'docs/spec-guidelines/APP_SPEC_RULES.md']
CSS = '''
:root{color-scheme:light;--ink:#233047;--muted:#66758a;--line:#dce3ec;--accent:#175c86;--paper:#fff;--bg:#f2f5f8}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:28px}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.85 -apple-system,BlinkMacSystemFont,"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}a{color:var(--accent);text-underline-offset:3px;overflow-wrap:anywhere}a:hover{color:#a14e16}aside{position:fixed;inset:0 auto 0 0;width:280px;overflow:auto;padding:30px 22px;border-right:1px solid var(--line);background:#eaf0f5}.brand{font-size:12px;letter-spacing:2px;color:var(--accent);font-weight:700}.side-title{font-size:21px;line-height:1.5;margin:10px 0 22px}nav a{display:block;padding:7px 10px;font-size:13px;line-height:1.5;text-decoration:none;border-radius:5px;margin:3px 0}nav a:hover,nav a.active{background:#d6e5ef;color:#124f76}main{margin-left:280px;padding:38px 42px 90px;max-width:1560px}article{background:var(--paper);padding:44px 48px;border:1px solid var(--line);border-radius:12px;box-shadow:0 8px 32px #22334406}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px;font-size:13px;color:var(--muted)}button{font:inherit;padding:7px 14px;border:1px solid var(--line);border-radius:6px;background:white;color:var(--ink);cursor:pointer}h1{font-size:32px;line-height:1.45;letter-spacing:-.6px;margin:0 0 30px}h2{font-size:24px;line-height:1.5;margin:56px 0 22px;padding-top:24px;border-top:2px solid var(--line)}h3{font-size:19px;margin:32px 0 15px;color:#235779}p{margin:14px 0}li{margin:7px 0}blockquote{margin:24px 0;padding:5px 22px;background:#f0f6fa;border-left:4px solid #5091b4;color:#456176}.table-scroll{overflow-x:auto;margin:20px 0;border:1px solid var(--line);border-radius:7px}table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.75}th,td{padding:12px 14px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;min-width:105px}th{background:#eaf1f6;font-weight:650;color:#244760}tr:last-child td{border-bottom:0}tbody tr:nth-child(even){background:#f8fafc}td:first-child{font-weight:550}code{font-size:.88em;background:#edf1f5;padding:2px 5px;border-radius:3px;overflow-wrap:anywhere}pre{overflow:auto;padding:18px;background:#edf1f5}pre code{padding:0}.flow{padding:20px;background:#f5f8fb;border:1px solid var(--line);border-radius:8px}.flow-row{display:flex;align-items:center;gap:16px;padding:13px 0;border-bottom:1px dashed #ccd9e5}.flow-row:last-child{border:0}.flow-source{flex:0 0 155px;font-weight:650;color:#225677}.flow-targets{display:flex;flex-wrap:wrap;gap:8px}.flow-target{background:white;padding:6px 10px;border:1px solid #ccdae5;border-radius:5px;font-size:14px}.flow-label{color:#697a8e;font-size:12px;display:block}.foot{font-size:12px;color:var(--muted);margin-top:32px}.skip{position:absolute;left:-10000px}.skip:focus{left:20px;top:10px;background:white;padding:10px;z-index:10}
@media(min-width:1600px){main{margin-right:auto}}
@media(max-width:1000px){aside{position:static;width:auto;border:0;border-bottom:1px solid var(--line);padding:20px}nav{display:flex;overflow:auto;gap:6px}nav a{white-space:nowrap}.side-title{margin:5px 0 10px;font-size:18px}main{margin:0;padding:20px}article{padding:25px}h1{font-size:27px}.flow-row{align-items:flex-start}.flow-source{flex-basis:110px}}
@media print{aside,.toolbar,.skip{display:none}main{margin:0;padding:0;max-width:none}article{border:0;padding:0;box-shadow:none}body{font-size:11pt;background:white}h2,h3{break-after:avoid}h2{margin-top:25px}.table-scroll{overflow:visible}table{font-size:9pt}th,td{min-width:0;padding:6px}tr{break-inside:avoid}a{color:inherit;text-decoration:none}.flow{break-inside:avoid}}
'''

def flow_cards(match):
    code = match.group(1)
    names = dict(re.findall(r'\b([A-Z]+)[\[{]([^\]}]+)[\]}]', code))
    clean = re.sub(r'\b([A-Z]+)[\[{][^\]}]+[\]}]', r'\1', code)
    groups = {}
    for source, label, target in re.findall(r'([A-Z]+)\s*-->\s*(?:\|([^|]*)\|\s*)?([A-Z]+)', clean):
        groups.setdefault(source, []).append((label, target))
    if not groups:
        raise ValueError('無法轉換 Mermaid 入口圖，請檢查來源語法')
    rows = []
    for source, targets in groups.items():
        chips = ''.join('<span class="flow-target">' + (f'<span class="flow-label">{html.escape(label)}</span>' if label else '') + html.escape(names.get(target, target)) + '</span>' for label, target in targets)
        rows.append(f'<div class="flow-row"><div class="flow-source">{html.escape(names.get(source,source))}</div><span aria-hidden="true">→</span><div class="flow-targets">{chips}</div></div>')
    return '\n<div class="flow" role="group" aria-label="介面入口關係">' + ''.join(rows) + '</div>\n'

def export(path):
    source = path.read_text()
    digest = hashlib.sha256(source.encode()).hexdigest()
    content = re.sub(r'```mermaid\n(.*?)```', flow_cards, source, flags=re.S)
    body = markdown.markdown(content, extensions=['tables','fenced_code','toc'], extension_configs={'toc': {'permalink': False}})
    def reading_link(match):
        url = urlsplit(html.unescape(match.group(1)))
        target = (path.parent / unquote(url.path)).resolve()
        if not url.scheme and not url.netloc and target in FILES:
            relative = os.path.relpath(target.with_suffix('.html'), path.parent)
            return 'href="' + html.escape(relative + ('#' + url.fragment if url.fragment else '')) + '"'
        return match.group(0)
    body = re.sub(r'href="([^"]+)"', reading_link, body)
    body = re.sub(r'<table>(.*?)</table>', r'<div class="table-scroll" tabindex="0" role="region" aria-label="可橫向捲動的規格表格"><table>\1</table></div>', body, flags=re.S)
    headings = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>',body)
    toc = ''.join(f'<a href="#{html.escape(anchor)}">{label}</a>' for anchor,label in headings)
    title = re.search(r'^# (.+)',source).group(1)
    output = f'''<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="source-sha256" content="{digest}"><title>{html.escape(title)}</title><style>{CSS}</style></head>
<body><a class="skip" href="#content">跳至正文</a><aside><div class="brand">巨亨ONLINE · 文件閱讀版</div><div class="side-title">{html.escape(title)}</div><nav aria-label="章節導覽">{toc}</nav></aside><main id="content"><div class="toolbar"><span>由 Markdown 同步產生 · 可使用瀏覽器搜尋文字</span><button onclick="window.print()">列印／另存 PDF</button></div><article>{body}<p class="foot">正文來源：<a href="{path.name}">{path.name}</a>。修改 Markdown 後，執行 python3 scripts/export_spec_html.py 重新產生閱讀版。</p></article></main>
<script>const links=[...document.querySelectorAll('nav a')];const observer=new IntersectionObserver(entries=>{{for(const entry of entries)if(entry.isIntersecting){{for(const link of links)link.classList.toggle('active',decodeURIComponent(link.hash.slice(1))===entry.target.id);}}}},{{rootMargin:'0px 0px -65% 0px'}});document.querySelectorAll('h2[id]').forEach(h=>observer.observe(h));</script></body></html>'''
    path.with_suffix('.html').write_text(output)
    print(path.with_suffix('.html').relative_to(ROOT))

for path in FILES:
    export(path)
