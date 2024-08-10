const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div class="hero-foot has-text-centered is-4">Created by Hung Tran, IGME330</div>
`;

// Footer
class Footer extends HTMLElement{
    constructor(){
        super();

        // Attach a shadow DOM tree to this instance
        this.attachShadow({mode: "open"});

        // Clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('scriber-footer', Footer);