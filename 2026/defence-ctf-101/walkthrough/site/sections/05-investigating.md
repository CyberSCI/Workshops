<!-- .slide: class="chapter" -->

# Now we are ready

<img src="img/im-ready-spongebob.gif" alt="spongebob is ready" class="screenshot">

---

<!-- .slide: id="investigating" class="chapter" -->

# Investigating

##
## How do you find exploits?

---

## What are we looking for?

### The services will have a number of vulnerabilities in them... but you only get points for patching vulnerabilities which are being actively exploited

--- 

## **We want to find the active exploits**

---

## Strategies

### 1. Monitor the network
### 2. Look at the live service for indicators of compromise
### 3. Review the code
### 4. Adding your own logs
### 5. Go on offensive

---

## 1. Network is king

Inspect the traffic with wireshark

> **Try it:** Launch wireshark now
>
> ```bash
> Select Capture -> Options
> ```

<img src="img/wireshark_0.png" alt="wireshark capture" class="screenshot">

---

Select "SSH remote capture: sshdump"

<img src="img/wireshark_1.png" alt="wireshark capture" class="screenshot trio"><img src="img/wireshark_2.png" alt="wireshark capture" class="screenshot trio"><img src="img/wireshark_3.png" alt="wireshark capture" class="screenshot trio">

---

1. Filter by 'http'
2. Execute attack scenario 4 at http://localhost:666
3. Can you find evidence of what the exploit is?

<img src="img/wireshark_4.png" alt="wireshark capture" class="screenshot tall">

---

## When is Network not King?

### Services sometimes will be over TLS (encrypted)

There are options to decrypt it in wireshark, but will vary depending on the service https://wiki.wireshark.org/TLS

### Logic vulnerabilities 

Not everything will show clearly in network traffic. Vulnerabilities in the code logic typically result in traffic that looks very similar to healtchecks.

---

## 2. So then Source code is King?


> **Try it:** Open the source code and look for any clear issues


---

## 2. So then Source code is King?


> **Try it:** Open the source code and look for any clear issues

Hint: Are there any hardcoded secrets?

---

## Downsides of source code anaylsis

### What am I looking for?

Learn what the OWASP Top 10 vulnerabilities typically look like... think hardcoded secrets, injection vulnerabilities, etc..

### Not every vulnerabilty found is exploited

There may be additional vulnerabilities which won't gain you any points for finding :( 

### Large code bases

When dealing with a large amount of code, look for the entry point (e.g. main.go) and trace back from there

---

## 3. Look for indicators of compromise

- Any images not rendering?
- Weird account names or posts?

---

## The XSS leaves a trace

The payload is an image which can never load: `<img src="x" onerror="...">`

The Questions page shows a broken image icon next to the attacker's question

<img src="img/xss_broken_image.png" alt="the questions page with a broken image icon next to the attacker's question" class="screenshot">

---

## Other places to look

### Database

Look through the tables for any items with suspicious strings

### Files

Notice any files on the system that the attack might have dropped there?

---

## 4. Add your own logging!

- Read what the app already logs
- Add log lines where it matters

`LoginCandidate` in `backend/handlers/handlers.go` logs nothing today

Add one line just after the request is read, then rebuild with `docker compose build && docker compose up -d`

```go
log.Printf("Candidate login attempt: email=%q", req.Email)
```

```
Candidate login attempt: email="' UNION SELECT 3, 'Raphael Velasquez', 'raphael.velasquez@hotmail.com', '$2y$10$...' --"
[GIN] ... | 200 | 3ms | POST "/auth/login/candidate"
```

### The SQL injection login, caught by your own log line

Note:
This catches the login attack from the wireshark exercise (attack scenario 4 at http://localhost:666). The payload uses a precomputed hash, so the attacker logs in as a real candidate without knowing the password: no failed attempts, just a success. The first rebuild takes a minute or two, after that the Go modules are cached.
