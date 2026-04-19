document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.page-wrapper');
    if (!wrapper) return;

    const topButton = document.createElement('button');
    topButton.className = 'top-btn';
    topButton.textContent = 'Back to Top';
    document.body.appendChild(topButton);

    topButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function() {
        topButton.classList.toggle('visible', window.scrollY > 200);
    });

    function highlightNames(root) {
        const regex = /\b(?:Aya|AYA|aya|Alhero|ALHERO|alhero)\b/g;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                if (['SCRIPT', 'STYLE', 'A'].includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
                return regex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            const frag = document.createDocumentFragment();
            const text = node.nodeValue;
            let lastIndex = 0;

            text.replace(regex, (match, offset) => {
                if (offset > lastIndex) {
                    frag.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
                }
                const span = document.createElement('span');
                span.className = match.toLowerCase().includes('aya') ? 'highlight-aya' : 'highlight-alhero';
                span.textContent = match;
                frag.appendChild(span);
                lastIndex = offset + match.length;
            });

            if (lastIndex < text.length) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            if (frag.childNodes.length) {
                node.parentNode.replaceChild(frag, node);
            }
        });
    }

    highlightNames(wrapper);

    const pageNote = document.querySelector('.page-note');
    const storyToc = document.querySelector('.story-toc');
    const chapterSections = document.querySelectorAll('.chapter');
    const progressBanner = document.querySelector('.progress-banner');
    const tocLinks = document.querySelectorAll('.story-toc a');

    const fadeTargets = [pageNote, storyToc, ...chapterSections];
    fadeTargets.forEach(node => node && node.classList.add('fade-in'));

    tocLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = document.querySelector(this.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('chapter')) {
                    const title = entry.target.querySelector('h2').textContent;
                    progressBanner.textContent = 'Now reading: ' + title;
                    tocLinks.forEach(link => {
                        link.classList.toggle('active', link.hash === '#' + entry.target.id);
                    });
                }
            }
        });
    }, {
        threshold: 0.35
    });

    fadeTargets.forEach(node => node && observer.observe(node));

    const headings = document.querySelectorAll('.page-wrapper h2');
    headings.forEach((heading) => {
        heading.addEventListener('click', function() {
            headings.forEach(h => h.classList.remove('highlighted'));
            this.classList.add('highlighted');
        });
    });
});
                
            
        ;
 {
        threshold: 0.35
    };

    fadeTargets.forEach(node => observer.observe(node));

    const headings = activeLangContainer.querySelectorAll('h2');
    headings.forEach((heading) => {
        heading.addEventListener('click', function() {
            headings.forEach(h => h.classList.remove('highlighted'));
            this.classList.add('highlighted');
        });
    });

;
