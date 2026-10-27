#!/usr/bin/env python3
"""Render portfolio evidence from saved results and merged public changes."""
from pathlib import Path
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/results'
INK, BLUE, GRAY = '#1c1d20', '#455ce9', '#e7e8e9'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 14, 'axes.spines.top': False,
                     'axes.spines.right': False, 'axes.spines.left': False, 'axes.spines.bottom': False,
                     'text.color': INK, 'axes.labelcolor': INK, 'xtick.color': '#626469', 'ytick.color': INK})


def outage():
    fig, ax = plt.subplots(figsize=(13, 8), dpi=130)
    fig.patch.set_facecolor('white')
    fig.text(.075, .88, 'Delayed cell-outage test', fontsize=29)
    fig.text(.075, .82, 'Users moved off the failed base station', fontsize=14, color='#626469')
    values = [0, 29, 28]
    labels = ['Current path', 'Legacy path', 'Reset control']
    bars = ax.barh(labels[::-1], values[::-1], height=.48, color=[BLUE, '#85898a', INK])
    ax.set_xlim(0, 48)
    ax.set_xticks([0, 15, 30, 45])
    ax.tick_params(axis='both', length=0, pad=15)
    ax.grid(axis='x', color=GRAY, linewidth=1)
    ax.set_axisbelow(True)
    ax.axvline(45, color='#999d9e', linestyle='--', linewidth=1)
    for bar, value in zip(bars, values[::-1]):
        ax.text(max(value, .25) + .7, bar.get_y()+bar.get_height()/2, f'{value} / 45', va='center', fontsize=18)
    ax.set_position([.22, .27, .65, .43])
    fig.text(.075, .12, '7 base stations  /  Failure at tick 100  /  Detected at tick 111', fontsize=13)
    fig.text(.075, .075, 'Saved September 29, 2026 update. Reset was a diagnostic control, not a confirmed fix.', fontsize=11, color='#626469')
    fig.savefig(OUT / 'network-outage.png', facecolor='white')
    plt.close(fig)


def aviary():
    fig, ax = plt.subplots(figsize=(13, 8), dpi=130)
    fig.text(.075, .88, 'A smaller aircraft starting point', fontsize=28)
    fig.text(.075, .82, 'Input-deck rows reported in merged Aviary PR #1262', fontsize=14, color='#626469')
    ax.barh([1], [194], height=.35, color=INK, label='Converted inputs')
    ax.barh([1], [282], left=[194], height=.35, color='#c5c6c7', label='Unconverted legacy rows')
    ax.barh([0], [42], height=.35, color=BLUE)
    ax.set_yticks([1, 0], ['Advanced deck', 'Minimum deck'])
    ax.set_xlim(0, 515)
    ax.set_xticks([0, 100, 200, 300, 400, 500])
    ax.tick_params(axis='both', length=0, pad=15)
    ax.grid(axis='x', color=GRAY)
    ax.set_axisbelow(True)
    ax.text(487, 1, '476', va='center', fontsize=18)
    ax.text(53, 0, '42', va='center', fontsize=18, color=BLUE)
    ax.legend(loc='upper left', bbox_to_anchor=(0, -.19), frameon=False, fontsize=11, ncol=2)
    ax.set_position([.22, .34, .65, .34])
    fig.text(.075, .13, '1,906 nmi mission  /  SLSQP converged in 12 iterations', fontsize=15)
    fig.text(.075, .075, 'Generic example, not an aircraft calibration. Source: OpenMDAO/Aviary #1262.', fontsize=11, color='#626469')
    fig.savefig(OUT / 'aviary-inputs.png', facecolor='white')
    plt.close(fig)


def code_image(filename, title, path, lines):
    image = Image.new('RGB', (1600, 1000), '#1c1d20')
    draw = ImageDraw.Draw(image)
    sans = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    mono = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
    draw.text((90, 85), title, font=ImageFont.truetype(sans, 35), fill='white')
    draw.text((90, 150), path, font=ImageFont.truetype(mono, 22), fill='#a1a5ab')
    draw.line((90, 215, 1510, 215), fill='#44464b', width=1)
    for i, line in enumerate(lines):
        draw.text((90, 285+i*48), line, font=ImageFont.truetype(mono, 27), fill='#dce3fc' if i else '#8fa0ff')
    draw.text((90, 890), 'Excerpt from the merged contribution', font=ImageFont.truetype(sans, 22), fill='#a1a5ab')
    image.save(OUT / filename, optimize=True)


if __name__ == '__main__':
    outage()
    aviary()
    nasa = json.loads((ROOT / 'content/evidence/nasa-files.json').read_text())
    nasa_patch = next(x['patch'] for x in nasa if x['filename']=='cmr/queries.py')
    assert 'platform if isinstance(platform, str) else list(platform)' in nasa_patch
    code_image('nasa-platforms.png', 'NASA / python_cmr  ·  Merged PR #119', 'cmr/queries.py', [
        'def platform(self, platform: Union[str, Sequence[str]]) -> Self:',
        '    if not platform:',
        '        raise ValueError("Please provide a value for platform")',
        '',
        "    self.params['platform'] = (",
        '        platform if isinstance(platform, str) else list(platform)',
        '    )',
        '    return self',
    ])
    cosmos = json.loads((ROOT / 'content/evidence/cosmos-files.json').read_text())
    patch = next(x['patch'] for x in cosmos if x['filename']=='openc3/python/openc3/microservices/interface_decom_common.py')
    assert 'from_nsec_from_epoch(received_time) if received_time is not None' in patch
    code_image('cosmos-timestamps.png', 'OpenC3 / COSMOS  ·  Merged PR #3720', 'openc3/microservices/interface_decom_common.py', [
        'received_time = inject_tlm_hash.get("received_time")',
        'packet.received_time = (',
        '    from_nsec_from_epoch(received_time)',
        '    if received_time is not None',
        '    else datetime.now(timezone.utc)',
        ')',
    ])
    print('Rendered four figures from saved results and verified merged changes.')
