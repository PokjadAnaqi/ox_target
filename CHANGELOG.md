# 1.18.2

- Bundle the supplied Delta tree UI, Space Grotesk typography and transparent NUI canvas.
- debug 0: register E interaction only; show a labelled prompt before opening options.
- debug 1: restore classic Left Alt targeting with no E prompt or automatic scan.
- Separate mode keybind commands from saved legacy bindings, and release owned focus on target loss/close.
- Recheck selection distance, visibility, entity existence, groups/items and canInteract.
- Render labels safely as text and point update checks at this fork.

Validation: mocked client Lua and DOM interaction tests. Live FiveM testing remains required.
