# Walkthrough site

The slides for the Defence CTF 101 workshop. It is a [reveal.js](https://revealjs.com) deck served by nginx as the `walkthrough` service in `compose.yaml`.

```bash
docker compose up -d              # the whole workshop, slides included
docker compose up -d walkthrough  # only the slides
```

Then open <http://localhost>. The slides start within seconds and do not wait for the VM. The lights on the first slide turn green as the app, backend and attack portal come up.

## Editing the slides

The slides are baked into the image, so a change needs a rebuild. While editing, bind-mount them instead and refresh the browser to see changes:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up -d walkthrough
```

Go back to the baked slides before the session:

```bash
docker compose up -d --build walkthrough
```

## Layout

```text
walkthrough/
  Dockerfile, nginx.conf
  site/
    index.html           page shell: reveal.js and the status strip
    sections/NN-name.md  one Markdown file per section of the talk
    js/deck.js           section order, Try it panels, timer length
    js/status.js         status lights
    css/walkthrough.css  CyberSci branding and the deck's own styles
    img/                 CyberSci logo and favicon
    fonts/               Teko and Lato, with their licences
    vendor/reveal.js/    offline copy of reveal.js 6.0.2
```

## Branding

The deck follows [cybersci.ca](https://cybersci.ca) on a dark ground: the site's reds, Teko headings and Lato text.

- **Logo:** `site/img/cybersci-logo.png` is the header logo from cybersci.ca, trimmed to its visible edge and otherwise unchanged. It is black text, so every slide shows it on a white plate. If CyberSci has a reversed (light) logo, swap the file and drop the plate in `walkthrough.css`. The logo belongs to CyberSci, so check that you may redistribute it before making the repository public.
- **Favicon:** `site/img/favicon.png` is the logo's maple leaf as a plain red shape.
- **Fonts:** Teko and Lato are self-hosted in `site/fonts/` under the SIL Open Font License (texts alongside), so the deck looks the same offline.
- **Colours:** the `--cs-*` variables at the top of `css/walkthrough.css`. The reds are the ones used on cybersci.ca.
- **Header:** the logo plate, the "CyberSci Training Event" label and the hairline are drawn by CSS on every slide. Change the label in the `content:` of the `section:not(.stack)::after` rule. Each part of the talk prefixes it with its name ("Pre competition · CyberSci Training Event"); the names live in the `SECTION_LABELS` map in `js/deck.js`, keyed by the id of the slide that opens each part. Content gets about 550 px of height below the header.
- **Slide types:** add a class to the slide comment, for example `<!-- .slide: id="prep" class="chapter" -->`.
  - `chapter`: a section opener with a big title and a red bar. Text after the title shows in grey.
  - `statement`: little text, set big and centred, for single-idea slides.
  - `hero`: the opening slide, with the large logo and event title.

## Writing a section

1. Add `sections/NN-name.md`, then add `'NN-name'` to `SECTIONS` in `js/deck.js`. The list order is the talk order.
2. Start the file with a `# Title` slide.
3. Put each separator on its own line with a blank line above and below:

   | Line    | Meaning                      |
   | ------- | ---------------------------- |
   | `---`   | next slide                   |
   | `--`    | slide below (vertical stack) |
   | `Note:` | the rest is speaker notes    |

4. Start a slide with `<!-- .slide: id="login" -->` to give it a link, here `http://localhost/#/login`.

### Try it panels

A blockquote that starts with **Try it** becomes a highlighted panel. Every code block in it gets a Copy button.

````markdown
> **Try it:** log in (run on your laptop)
>
> ```bash
> ssh root@localhost -p 2222
> ```
````

- Say where to run the command (laptop or VM) after `Try it:` when it is not obvious.
- Copy leaves off the trailing newline, so a pasted command waits for Enter.

### Status lights

The strip at the bottom left shows them on every slide. `<div data-status-board></div>` adds the large board, as on the first slide.

- The browser probes `localhost:67/`, `:6767/health` and `:666/` every 5 seconds. Green means something answered, not that the app works.
- Each probe shows up in the backend log as `GET /health` and in packet captures on ports 80 and 8080. Use **Pause checks** on the strip for the investigating demos. Checks also pause while the tab is in the background.
- Chrome DevTools may list the probes as canceled (`net::ERR_ABORTED`). The servers still answer 200. The page cannot read those responses and only needs to know that something answered.
- The speaker view (press `S`) does not probe, so Pause checks stops all of the traffic.

The timer in the speaker view is sized by `SLOT_MINUTES` in `js/deck.js`.

## Things to know

- **Memory:** the VM builds the app on first start, which takes 10 to 15 minutes. Give Docker at least 4 GB.
- **Docker Desktop:** macOS and Windows have not been tested.
- **403 in dev mode:** nginx reads the files as an unprivileged user. A file saved with mode 600 returns 403 through the bind mount. Fix it with `chmod -R a+rX walkthrough/site`. The image build does this itself.
- **Updating reveal.js:** run `npm pack reveal.js@<version>` and copy these files from `package/` into `site/vendor/reveal.js/`: `LICENSE`, `dist/reveal.js`, `dist/reveal.css`, `dist/reset.css`, `dist/theme/black.css`, `dist/plugin/{markdown,highlight,notes}.js` and `dist/plugin/highlight/monokai.css`. reveal.js needs nothing from the internet, and neither does the rest of the site.
