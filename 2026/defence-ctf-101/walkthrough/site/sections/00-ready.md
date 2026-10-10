<!-- .slide: id="ready" class="hero" data-background-gradient="linear-gradient(105deg, #0e0f12 72%, #350f14 72%)" -->

<p class="event-title">Defence CTF 101</p>

# Follow along: https://github.com/CyberSCI/Workshops

<div data-status-board></div>

Note:
Before starting, ask the room to check that all three lights are green.
App and Backend stay red until the VM has finished its first build, which can take 10 to 15 minutes.
Each student's browser checks its own stack every 5 seconds.

--

<!-- .slide: id="stuck" -->

## Stuck? Not all green

- **App and Backend red:** the first start builds the app inside the VM, which takes 10 to 15 minutes
- **Portal red:** the attacker container is not running
- **Everything red:** Docker is not running, or has too little memory (give it at least 4 GB)

> **Try it:** check, restart and watch the first build (run from the workshop folder)
>
> ```bash
> docker compose ps
> docker compose up -d
> docker compose exec service-vm journalctl -u candidate-registry -f
> ```
