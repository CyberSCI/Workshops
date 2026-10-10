<!-- .slide: id="prep" class="chapter" -->

# Preperation phase

##
## 1. Setup Source Control
## 2. Learn

---

## Connect to your VM

> **Try it:** log in (the password is `cybersci`)
>
> ```bash
> ssh root@localhost -p 2222
> ```

---

## Check your VM specs

- Competition VM's are often small with limited resources
- Don't crash! (Hint: ssh via VSCode extension eats up allot of ram)

> **Try it:** look at the CPU, memory and disk
>
> ```bash
> top
> ```

<img src="img/check_your_vm_specs.png" alt="top output with CPU and memory use circled" class="screenshot big">

---

## Setup Source Control

### You will break something! Make sure you can revert safely

<img src="img/breaks_vm.png" alt="Meme: deploy patch, service is down, git revert" class="screenshot tall">

---

## Setup a Git Repository

> **Try it:** Start with a local git repo
>
> ```bash
> cd ~/candidate_registry
> git init
> git config user.name "Student"
> git config user.email "student@example.com"
> git add -A
> git commit -m "Baseline before patching"
> ```

> **Try it:** Setup origin for remote repo
>
> ```bash
> git remote add origin git@github.com:trentholmes/workshop-test-1.git
> git branch -M main
> git push -u origin main
> ```

---

## You don't need to be an expert

<img src="img/git_expert_1.png" alt="git log with tidy commit messages" class="screenshot">
<img src="img/git_expert_2.png" alt="git log with messy commit messages" class="screenshot">

---

<!-- .slide: id="backup" -->

## Keep a backup file

- A tar or zip file is the fastest way back

> **Try it:** back up the source
>
> ```bash
> cd /root
> tar czf backup.tar.gz candidate_registry
> ```

> **Try it:** transfer to your machine
>
> ```bash
> # from your machine
> scp -P 2222 root@localhost:/root/backup.tar.gz ./
> tar -xvf backup.tar.gz
> ```

---

## Understand what the app does

- Look around the running application
- Look for a README

> **Try it:**  Go to http://localhost:67

---

## Do you know how to take it down and back up?

> **Try it:** stop and start the app
>
> ```bash
> docker compose ps
> docker compose build
> docker compose down
> docker compose up -d
> ```


> **Try it:** confirm everything looks good in the logs
>
> ```bash
> docker compose logs -f
> ```

---

## Bonus: Run it locally

- Run the app on your own machine, not just in the VM
- Lets you test patches before sending them into production


