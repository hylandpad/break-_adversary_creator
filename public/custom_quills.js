const registerCustomBlots = () => {
    if (typeof Quill === 'undefined') return;

    const Inline = Quill.import('blots/inline')
    const Embed = Quill.import('blots/embed');

    class DamageTypeBlot extends Inline {
        static create(dmg){
            let node = super.create()

            node.setAttribute('data-dmg-type', dmg.damage_type || '')
            node.setAttribute('data-amount', dmg.amount || '')
            
            node.classListist.add('damage-type-blot')
            node.innerHTML = `<span class="${dmg.damage_type}">${dmg.amount}</span>`
            return node
        }
    }

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
                ? `<strong>CONTEST: </strong> <span class="attr-chip attr-${yourAttrClass}">${value.yourAttr}</span> <sup>vs</sup> <span class="attr-chip attr-${theirAttrClass}">${value.theirAttr}</span>` 
                : `<strong>CHECK: </strong> <span class="attr-chip attr-${yourAttrClass}">${value.yourAttr}</span>`;

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

        static dmg(node) {
            return {
                damage_type: node.getAttribute('damage_type'),
                amount: node.getAttribute('amount')
            }
        }
    }

    DamageTypeBlot.blotName = 'damageType';
    DamageTypeBlot.tagName = 'span';
    SkillActionBlot.blotName = 'skillAction';
    SkillActionBlot.tagName = 'span';
    Quill.register(SkillActionBlot);
    Quill.register(DamageTypeBlot);
};