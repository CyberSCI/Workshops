# Service VM for the defence workshop: an Ubuntu 24.04 container running
# systemd as PID 1 so it behaves like a small VM you can SSH into. It runs its
# own Docker engine and starts the candidate registry challenge on boot.
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# systemd as init, OpenSSH server, and the everyday tools the workshop uses
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        systemd \
        openssh-server \
        ca-certificates curl wget \
        git nano vim less jq zip unzip \
        tcpdump iproute2 net-tools iputils-ping \
        procps htop sudo \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Docker Engine from Docker's official apt repo (the packages get.docker.com installs)
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        docker-ce docker-ce-cli containerd.io \
        docker-buildx-plugin docker-compose-plugin \
        iptables \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Ensure SSH host keys exist
RUN ssh-keygen -A

# Allow root password login (workshop ergonomics)
RUN printf 'PermitRootLogin yes\nPasswordAuthentication yes\n' > /etc/ssh/sshd_config.d/00-root.conf

# Start sshd at boot (Ubuntu 24.04 otherwise relies on socket activation)
RUN systemctl enable ssh.service

# Workshop credential
RUN echo 'root:cybersci' | chpasswd

# Start Docker at boot, then the registry's own compose app
COPY candidate-registry.service /etc/systemd/system/candidate-registry.service
RUN systemctl enable docker.service containerd.service candidate-registry.service

# The challenge source as released to teams. compose mounts a volume over /root
# that is seeded from this directory the first time it is used.
COPY candidate_registry /root/candidate_registry

# Emergency backup of the pristine source (advertised on the attack portal)
RUN tar czf /root/registry-backup.tar.gz -C /root candidate_registry

ENV container=docker

EXPOSE 22 80 8080

# systemd's expected shutdown signal
STOPSIGNAL SIGRTMIN+3

CMD ["/usr/lib/systemd/systemd"]
