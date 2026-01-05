const registerCustomBlots = () => {
    if (typeof Quill === 'undefined') {
        console.error("Quill is not defined! Make sure quill.js is loaded before custom_quills.js");
        return;
    }

// Change this line
const Embed = Quill.import('blots/embed');

class SkillActionBlot extends Embed {
    static create(value) {
        let node = super.create();
        
        // Storing data for persistence
        node.setAttribute('data-your-attr', value.yourAttr || '');
        node.setAttribute('data-their-attr', value.theirAttr || '');
        node.setAttribute('data-pass', value.pass || '');
        node.setAttribute('data-fail', value.fail || '');
        node.setAttribute('data-contest', value.isContest ? 'true' : 'false');

        const mainActionText = value.isContest 
            ? `${value.yourAttr} vs ${value.theirAttr}` 
            : `${value.yourAttr}`;

        // Simplified HTML without DC numbers
        node.innerHTML = `
            <span class="attr-chip attr-${(value.yourAttr || '').toLowerCase()}">${mainActionText}</span>
            <span class="blot-results-inline">
                <span class="res-tag res-pass"><strong>Pass:</strong> ${value.pass}</span>
                <span class="res-tag res-fail"><strong>Fail:</strong> ${value.fail}</span>
            </span>
        `;

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
SkillActionBlot.scope = Quill.import('parchment').Scope.INLINE_BLOT;

Quill.register(SkillActionBlot);}