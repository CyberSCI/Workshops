# 24.04 (Python 3.12): the attacker script uses nested f-string quotes,
# which older Pythons reject
FROM ubuntu:24.04
RUN apt update
RUN apt install -y python3 python3-pip git
RUN pip3 install --break-system-packages flask jsonschema urllib3 PyYAML pwntools playwright==1.52.0 pyjwt==2.10.1
# Chromium for the headless-browser XSS render check in the attacker script
RUN python3 -m playwright install --with-deps chromium
WORKDIR /
# Pinned siege framework
RUN git clone https://github.com/0xd13a/siege && cd siege && git checkout 6eb7c0374cde7d48a5734d515abbfeb6b5f02fa5

# Workshop tweak: an exploit stopped on the wire (e.g. an iptables string rule)
# times out and reports RESULT_DOWN, which upstream treats as "not neutralized".
# The workshop counts it as stopping the exploit. The real competition engine
# instead scores DOWN as a downtime penalty.
RUN sed -i 's/if result == AttackResult.RESULT_FAILURE:/if result in (AttackResult.RESULT_FAILURE, AttackResult.RESULT_DOWN):/' /siege/siege/siege_light.py
COPY site ./site
COPY config ./config
COPY services/candidate_registry/attacker ./services/candidate_registry/attacker
EXPOSE 6767
ENV PYTHONPATH=./siege
CMD ["python3", "./siege/siege/siege_light.py", "-p", "6767"]
