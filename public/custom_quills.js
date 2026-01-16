const registerCustomBlots = () => {
    if (typeof Quill === 'undefined') return;

    const Embed = Quill.import('blots/embed');



    class DamageTypeBlot extends Embed {
        static create(value) {
            let node = super.create();

            node.setAttribute('data-amount', value.amount);
            node.setAttribute('data-dmg-type', value.type);
            node.classList.add('damage-type-blot');

            // Create the Value Span (The Number)
            const valSpan = document.createElement('span');
            valSpan.className = `dmg-val ${value.type.toLowerCase()}`;
            valSpan.textContent = value.amount;

            // Create the Name Span (The Type)
            const nameSpan = document.createElement('span');
            nameSpan.className = 'dmg-name';
            nameSpan.textContent = ` ${value.type} `; // Added a leading space for export readability

            node.appendChild(nameSpan);
            node.appendChild(valSpan);

            node.contentEditable = "false";
            return node;
        }

        static value(node) {
            return {
                amount: node.getAttribute('data-amount'),
                type: node.getAttribute('data-dmg-type')
            };
        }
    }

    DamageTypeBlot.blotName = 'damage';
    DamageTypeBlot.tagName = 'span';
    Quill.register(DamageTypeBlot);

    class SkillActionBlot extends Embed {
        static create(value) {
            let node = super.create();

            const yourAttr = value.yourAttr || 'Might';
            const theirAttr = value.theirAttr || 'Grit';
            const pass = value.pass || '';
            const fail = value.fail || '';
            const isContest = value.isContest === true || value.isContest === 'true';

            node.setAttribute('data-your-attr', yourAttr);
            node.setAttribute('data-their-attr', theirAttr);
            node.setAttribute('data-pass', pass);
            node.setAttribute('data-fail', fail);
            node.setAttribute('data-contest', isContest ? 'true' : 'false');

            node.classList.add('skill-action-blot');
            node.contentEditable = "false";

            const yourClass = yourAttr.toLowerCase();
            const theirClass = theirAttr.toLowerCase();

            node.innerHTML = `
        <div class="blot-container">
            <div class="blot-header">
                <span class="action-label">${isContest ? 'CONTEST' : 'CHECK'}</span>
                <span class="editable-field attr-chip attr-${yourClass}" data-field="yourAttr" contenteditable="true">${yourAttr}</span>
                ${isContest ? `<span class="vs-label">vs</span> <span class="editable-field attr-chip attr-${theirClass}" data-field="theirAttr" contenteditable="true">${theirAttr}</span>` : ''}
            </div>
            <div class="blot-body">
                <div class="res-row res-pass">
                    <span class="res-label">Pass:</span>
                    <span class="editable-field res-text" data-field="pass" contenteditable="true">${pass}</span>
                </div>
                <div class="res-row res-fail">
                    <span class="res-label">Fail:</span>
                    <span class="editable-field res-text" data-field="fail" contenteditable="true">${fail}</span>
                </div>
            </div>
        </div>`.replace(/>\s+</g, '><');

            node.querySelectorAll('.editable-field').forEach(field => {
                field.addEventListener('keydown', (e) => e.stopPropagation());
                field.addEventListener('input', (e) => {
                    const fieldName = e.target.getAttribute('data-field');
                    // Ensure this maps 'yourAttr' to 'data-your-attr'
                    const attrName = `data-${fieldName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
                    node.setAttribute(attrName, e.target.innerText);
                });
            });

            return node;
        }

        static value(node) {
            return {
                yourAttr: node.getAttribute('data-your-attr') || 'Might',
                theirAttr: node.getAttribute('data-their-attr') || 'Grit',
                pass: node.getAttribute('data-pass') || '',
                fail: node.getAttribute('data-fail') || '',
                isContest: node.getAttribute('data-contest') === 'true'
            };
        }
    }
    SkillActionBlot.blotName = 'skillAction';
    SkillActionBlot.tagName = 'div';
    Quill.register(SkillActionBlot);
    Quill.register(SkillActionBlot);
};