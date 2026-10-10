# Defence CTF 101 Workshop

A hands-on introduction to defence CTFs. You get a vulnerable web app, the Val Verde Candidate Registry, running in a small VM. An automated attacker exploits it on demand. You work out how the attacks work, then patch the app to stop them.

The slides guide the session. This page gets everything running.

## Start the training

1. Clone the repository and go to the workshop folder:

   ```bash
   git clone https://github.com/CyberSCI/Workshops.git
   cd Workshops/2026/defence-ctf-101
   ```

2. Run the stack
   ```bash
   docker compose up -d
   ```

3. Open the slides at <http://localhost> and check that all three lights are green.

4. Follow the slides.

## Stop, restart and reset

Run these on your machine, in the workshop folder.

```bash
docker compose down      # stop everything, your changes in the VM are kept
docker compose up -d     # start again
docker compose down -v   # stop and delete the VM's volumes, for a clean slate
```

## What runs

`docker compose` starts three containers and publishes these ports on your machine. Every port is bound to `127.0.0.1`, so only your own machine can reach them. Keep it that way: the app is vulnerable on purpose, and the VM is a privileged container with a root password that is in the slides.

| Port | Service       | What it is                                                |
| ---- | ------------- | --------------------------------------------------------- |
| 80   | `walkthrough` | The workshop slides                                       |
| 67   | `service-vm`  | The app (frontend)                                        |
| 6767 | `service-vm`  | The app (backend)                                         |
| 2222 | `service-vm`  | SSH into the VM                                           |
| 666  | `attacker_vm` | The attack portal, where you launch the simulated attacks |

The "VM" is a container that behaves like a small VM. It runs systemd, an SSH server and its own Docker engine. On first boot it builds and starts the app, a JavaScript frontend with a Go backend, inside itself.

## Requirements

- **Docker** with the Compose plugin (the `docker compose` command). Give Docker at least 4 GB of memory.
- **Free ports** on your machine: 80, 67, 666, 2222 and 6767.
- **Internet access** for the first build. It downloads base images and packages from several places, for example Docker Hub, apt, PyPI, npm and GitHub.
- **git** and an **SSH client**.
- **Wireshark** (optional). The investigating section uses it to capture the VM's traffic.

Platform notes:

- **Linux:** use a regular Docker Engine, where the daemon runs as root. The stack publishes ports below 1024 and runs the VM as a privileged container.
- **Linux permissions:** if Docker answers `permission denied` on `/var/run/docker.sock`, add yourself to the `docker` group (`sudo usermod -aG docker $USER`, then log out and back in), or put `sudo` in front of the `docker` commands.
- **macOS and Windows:** Docker Desktop has not been tested.