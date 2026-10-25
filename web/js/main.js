import { createTreeLayout } from './createOptions.js';
import { fetchNui } from './fetchNui.js';

let proximity = false, expanded = false, selected = 0, focusAt = 0;
let currentOptions = [];
const hint = document.getElementById('interaction-hint');
const label = document.getElementById('interaction-label');
const optionsWrapper = document.getElementById('options-wrapper');
const trunk = document.getElementById('trunk');
const trunkDot = document.getElementById('trunk-dot');
const body = document.body;

function clearTree() {
  optionsWrapper.replaceChildren();
  trunk.setAttribute('height', '0');
  trunk.classList.remove('animate');
  trunkDot.classList.remove('animate');
}
function highlight() {
  const list = [...document.querySelectorAll('.option-container')];
  if (!list.length) return;
  selected = (selected + list.length) % list.length;
  list.forEach((el, i) => el.classList.toggle('keyboard-selected', i === selected));
}
function render() {
  clearTree();
  if (!proximity) { hint.hidden = true; createTreeLayout(currentOptions); trunkDot.classList.add('animate'); return; }
  body.style.visibility = currentOptions.length ? 'visible' : 'hidden';
  hint.hidden = !currentOptions.length || expanded;
  if (expanded) {
    createTreeLayout(currentOptions);
    highlight();
  } else if (currentOptions.length) {
    const option = currentOptions[0].data;
    label.textContent = option.interactionLabel || option.targetLabel || option.label || 'Interact';
  }
}
document.addEventListener('keydown', event => {
  if (!proximity || !expanded) return;
  if (event.key === 'Escape') { expanded = false; render(); fetchNui('interactionClose', {}); return; }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault(); selected += event.key === 'ArrowDown' ? 1 : -1; highlight();
  }
  if (event.key.toLowerCase() === 'e' && !event.repeat && Date.now() - focusAt > 200) {
    document.querySelectorAll('.option-container')[selected]?.click();
  }
});
window.addEventListener('message', ({data}) => {
  if (!data || typeof data !== 'object') return;
  if (typeof data.proximity === 'boolean') proximity = data.proximity;
  switch (data.event) {
    case 'interactionMode': return;
    case 'interactionFocus':
      if (!proximity || !currentOptions.length) return;
      expanded = true; focusAt = Date.now(); selected = 0; render(); return;
    case 'interactionBlur':
      if (proximity) { expanded = false; selected = 0; render(); } return;
    case 'visible':
      currentOptions = []; expanded = false; selected = 0; clearTree(); hint.hidden = true;
      body.style.visibility = !proximity && data.state ? 'visible' : 'hidden';
      if (!proximity && data.state) trunkDot.classList.add('animate');
      return;
    case 'leftTarget':
      currentOptions = []; expanded = false; selected = 0; clearTree(); hint.hidden = true;
      if (proximity) body.style.visibility = 'hidden';
      return;
    case 'setTarget': {
      currentOptions = [];
      for (const [type, list] of Object.entries(data.options || {})) {
        if (!Array.isArray(list)) continue;
        list.forEach((option, index) => {
          if (!option.hide) currentOptions.push({type, data: option, id: index + 1});
        });
      }
      (data.zones || []).forEach((list, zone) => list.forEach((option, index) => {
        if (!option.hide) currentOptions.push({type: 'zones', data: option, id: index + 1, zoneId: zone + 1});
      }));
      if (!currentOptions.length) expanded = false;
      render(); return;
    }
  }
});
