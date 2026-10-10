(() => {
  // Deck order. Each name is a Markdown file in sections/.
  const SECTIONS = [
    '00-ready',
    '01-intro',
    '03-pre-competition',
    '04-prep',
    '05-investigating',
    '06-patching',
  ];

  // Header label for each part of the talk (drawn by walkthrough.css), keyed
  // by the id of the slide that opens it. Slides outside any of them (the
  // ready check) keep the plain event name.
  const SECTION_LABELS = {
    intro: 'Introduction',
    'pre-competition': 'Before the Competition',
    prep: 'Preperation phase',
    investigating: 'Investigating',
    patching: 'Patching',
  };

  // Minutes available to present. Sizes the pacing timer in the speaker view.
  const SLOT_MINUTES = 80;

  function loadSections() {
    const slides = document.querySelector('.reveal .slides');
    for (const name of SECTIONS) {
      const section = document.createElement('section');
      section.dataset.markdown = `sections/${name}.md`;
      section.dataset.separator = '^\\r?\\n---\\r?\\n$';
      section.dataset.separatorVertical = '^\\r?\\n--\\r?\\n$';
      section.dataset.separatorNotes = '^Note:';
      slides.append(section);
    }
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // Not a secure context (for example opened by IP address)
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }

  function addCopyButton(pre) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.addEventListener('click', async () => {
      const source = pre.querySelector('code') ?? pre;
      try {
        // No trailing newline, so the last command is not run by the paste
        await copyText(source.textContent.replace(/\s+$/, ''));
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      // Keeps Space and Enter navigating the deck instead of re-pressing it
      button.blur();
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 1500);
    });
    pre.append(button);
  }

  // A "Try it" panel is a blockquote that starts with **Try it**, which keeps
  // the Markdown readable on GitHub too.
  function decorateTryItPanels() {
    for (const quote of document.querySelectorAll('.reveal .slides blockquote')) {
      const lead = quote.querySelector(':scope > p:first-child > strong:first-child');
      if (!lead || !/^try it\b/i.test(lead.textContent.trim())) continue;
      lead.textContent = 'Try it';
      quote.classList.add('try-it');
      quote.querySelectorAll('pre').forEach(addCopyButton);
    }
  }

  // Mark every slide with the name of the part of the talk it belongs to, so
  // CSS can put it in the header. A part starts at the slide carrying its id
  // and runs until the next one starts.
  function labelSlides() {
    let label = null;
    for (const slide of document.querySelectorAll('.reveal .slides section')) {
      label = SECTION_LABELS[slide.id] ?? label;
      if (label) {
        slide.dataset.sectionLabel = label;
      }
    }
  }

  loadSections();
  WalkthroughStatus.start();

  Reveal.initialize({
    width: 1280,
    height: 720,
    center: false,
    hash: true,
    slideNumber: 'c/t',
    // Keeps the arrows clear of the slide number and the status strip
    controlsLayout: 'edges',
    transition: 'none',
    backgroundTransition: 'none',
    totalTime: SLOT_MINUTES * 60,
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
  }).then(() => {
    decorateTryItPanels();
    labelSlides();
    WalkthroughStatus.mountBoards();
  });
})();
