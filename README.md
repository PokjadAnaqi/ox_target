<div align="center">

# ox_target

Delta custom UI fork. Runtime dependency: ox_lib 3.30.0+; DTlib is optional.

Set `setr ox_target:debug 0` before `ensure ox_target` for E-only interaction:
look at a valid target to show `[E] Label`, press E to open its options, then
select with arrows/E or click. Escape returns to the prompt.

Set `setr ox_target:debug 1` and restart for classic Left Alt targeting. E
interaction is disabled in this mode. The modes use separate keybind commands
so an old saved Alt binding cannot activate the normal E mode.

Use `interactionLabel` on an option for a custom prompt title; otherwise its
existing label is shown. See [mode setup](DT_E_INTERACTION.md).

For DTlib consumers keep `DTConfig.Interaction.mode = 'target'`. Start ox_lib,
then ox_target, then DTlib and resources registering targets.

Download the `ox_target.zip` asset from this fork's GitHub release and replace
your existing resource with its `ox_target/` folder. Original MIT attribution is
preserved. The manual packaging workflow packages the selected revision and
does not rewrite tags or resource versions.

Tests: `pip install -r tests/requirements.txt`, `python tests/test_patch.py`,
then `npm ci && npm test`. Tests simulate Lua/DOM behavior; live FiveM validation
is still needed.

A "third-eye" interaction system for FiveM/RedM that lets players interact with the world, different entities, and zones.

[![](https://img.shields.io/github/downloads/overextended/ox_target/total?style=for-the-badge&logo=github)](https://github.com/overextended/ox_target/releases/latest/download/ox_target.zip)
[![](https://img.shields.io/github/downloads/overextended/ox_target/latest/total?style=for-the-badge&logo=github)](https://github.com/overextended/ox_target/releases/latest/download/ox_target.zip)
[![](https://img.shields.io/github/v/release/overextended/ox_target?style=for-the-badge&logo=github)](https://github.com/overextended/ox_target/releases/latest/)\
[![](https://badges.5metrics.dev/ox_target/serverRank.svg?style=for-the-badge)](https://5metrics.dev/resource/ox_target)
[![](https://badges.5metrics.dev/ox_target/servers.svg?style=for-the-badge)](https://5metrics.dev/resource/ox_target)
[![](https://badges.5metrics.dev/ox_target/players.svg?style=for-the-badge)](https://5metrics.dev/resource/ox_target)

</div>

## 📚 Documentation

https://overextended.dev/ox_target

## 💾 Download

https://github.com/PokjadAnaqi/ox_target/releases/latest/download/ox_target.zip

## ✨ Features

- Improved entity and world collision than its predecessor.
- Improved error handling when running external code.
- Menus for nested target options.
- Partial compatibility for qtarget (the thing qb-target is based on, I made the original idiots).
- Registering options no longer overrides existing options.
- Groups and items checking for supported frameworks.
