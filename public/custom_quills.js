const registerCustomBlots = () => {
    if (typeof Quill === 'undefined') return;

    const Embed = Quill.import('blots/embed');

    class SkillActionBlot extends Embed {
        static create(value) {
            let node = super.create();
            
            // Re-applying your attribute persistence
            node.setAttribute('data-your-attr', value.yourAttr || '');
            node.setAttribute('data-their-attr', value.theirAttr || '');
            node.setAttribute('data-pass', value.pass || '');
            node.setAttribute('data-fail', value.fail || '');
            node.setAttribute('data-contest', value.isContest ? 'true' : 'false');
            
            node.classList.add('skill-action-blot');

            const yourAttrClass = (value.yourAttr || '').toLowerCase();
            const theirAttrClass = (value.theirAttr || '').toLowerCase();

            const mainActionText = value.isContest 
                ? `<strong>Contest:</strong> <span class="attr-chip attr-${yourAttrClass}">${value.yourAttr}</span> <sup>vs</sup> <span class="attr-chip attr-${theirAttrClass}">${value.theirAttr}</span>` 
                : `<strong>Check:</strong> <span class="attr-chip attr-${yourAttrClass}">${value.yourAttr}</span>`;

            // Using a single wrapper for results to control the vertical flow
            node.innerHTML = `
                <span class="blot-content">
                    <span class="blot-header">${mainActionText}</span>
                    <span class="blot-results-inline">
                        ${value.pass ? `<span class="res-tag res-pass"><strong>Pass:</strong> ${value.pass}</span>` : ''}
                        ${value.fail ? `<span class="res-tag res-fail"><strong>Fail:</strong> ${value.fail}</span>` : ''}
                    </span>
                </span>`.replace(/>\s+</g, '><'); // Strict whitespace removal

            node.contentEditable = "false";
            return node;
        }

        static value(node) {
            return {
                yourAttr: node.getAttribute('data-your-attr'),
                theirAttr: node.getAttribute('data-their-attr'),
                pass: node.getAttribute('data-pass'),
                fail: node.getAttribute('data-fail'),
                isContest: node.getAttribute('data-contest') === 'true'
            };
        }
    }

    SkillActionBlot.blotName = 'skillAction';
    SkillActionBlot.tagName = 'span';
    Quill.register(SkillActionBlot);
};