# Delta E interaction patch

Version 1.18.2: debug controls the interaction mode. Restart ox_target after
changing it, then restart scripts that register targets if necessary.

Normal gameplay (default):
```
setr ox_target:debug 0
```
Only the ox_target_interact binding is registered, default E. Looking towards
an eligible nearby target displays [E] Label with the options hidden. Press E
to open the original Delta tree UI and cursor, even for a single option. Then
choose with arrows/E or mouse. Escape closes options and returns to the prompt.
Target loss, death, pause, external NUI focus and progress release owned focus.

Classic debug targeting:
```
setr ox_target:debug 1
```
Only ox_target_debug is registered, default Left Alt. E prompts and the automatic
scan are disabled. Original hold/toggle behavior and debug markers are retained.
The old ox_target binding is not registered, so a saved Alt bind on that command
does not activate production interaction. Player remaps on the new mode-specific
bindings still take priority, as with other FiveM bindings. Legacy proximity and
defaultHotkey convars no longer select the mode or its default key.

Prompt label uses interactionLabel, then targetLabel, then the first visible
option's label. Provide interactionLabel='Advance Crafting Bench' on an option
to name the target without changing the action label. No script names are hardcoded.
Detection uses the existing camera raycast, not a radius scan of every nearby object.

Keep DTlib's DTConfig.Interaction.mode = 'target' when using this patch. This
prevents a second DTlib DUI prompt for the same interaction. Start ox_target
before DTlib and scripts registering targets. This patch does not require DTlib;
when DTlib is running it also respects its progress and UI-suspension state.

Selection rechecks distance, groups/items, canInteract and entity existence.
Selection requires the options to be opened in normal E mode.
Labels render as text instead of HTML. Server-side gameplay validation remains
the responsibility of each action's server handler. Test in FiveM before deployment.
