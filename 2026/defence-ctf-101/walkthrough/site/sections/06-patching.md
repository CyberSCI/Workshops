<!-- .slide: id="patching" class="chapter" -->

# Patching

---

## Stop the bleeding

- The app has vulnerabilities, and the exploits make use of them
- For your scoring you just need to stop the exploits
- A simple fix can be enough, even if it does not patch the whole vulnerability

---

## Network is King?

You already found the exploit in Wireshark. Block its fingerprint:

```bash
iptables -I DOCKER-USER -p tcp -m multiport --dports 80,8080 \
  -m string --algo bm --string "UNION SELECT" -j REJECT
```

- Instant, no rebuild needed... but it is a signature, not a fix

> **Try it:** add the rule (run in the VM), then re-run attack scenario 4 at http://localhost:666
>

---

## Risk of network blocking

The automated scripts are not perfect. Sometimes they expect a response, rather than a down request. 

--- 

## Why not just block the attacker?

- Health checks and exploits come from the same place
- Block the IP and you score downtime, not defence

---

## The patch loop

1. Run the code on your machine
2. Push to GitHub
3. Pull onto the VM
4. `docker compose build`
5. `docker compose up -d`

> **Try it:** rebuild and restart the app (run in the VM)
>
> ```bash
> cd ~/candidate_registry
> docker compose build && docker compose up -d
> ```

Note:
TODO: decide how students practise the push and pull steps. The VM has no git remote yet.

---

<!-- .slide: id="revert" -->

## Something went wrong?

- Revert the commit and compose up again
- Needs the baseline commit from the prep phase

> **Try it:** undo the last commit and redeploy (run in the VM)
>
> ```bash
> cd ~/candidate_registry
> git revert --no-edit HEAD
> docker compose build && docker compose up -d
> ```

---

<!-- .slide: id="full-patch" -->

## Want full patch information for all vulnerabilities?

https://github.com/CyberSCI/PastChallenges/tree/main/challenges/nationals-2024-25/defence/candidate_registry
