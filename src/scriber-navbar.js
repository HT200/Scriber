const template = document.createElement("template");
template.innerHTML = `
<style>
@font-face {
    font-family: eras;
    src: url(../font/ErasBoldITC.ttf);
}

a {
    font-family: eras;
    font-size:20px;
}
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div id="hero-head">
    <nav class="navbar has-shadow is-fixed-top is-primary">
        <div class="navbar-brand">
            <a class="navbar-item" href="home.html">
                <img src="images/title.png" alt="Game Logo">
            </a>
            <a class="navbar-burger" id="burger">
                <span></span>
                <span></span>
                <span></span>
            </a>
        </div>
    
        <div class="navbar-start navbar-menu" id="nav-links">
        </div>
    </nav>
</div>
`;

// Navbar
class Navbar extends HTMLElement{
    constructor(){
        super();

        // Attach a shadow DOM tree to this instance
        this.attachShadow({mode: "open"});

        // Clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.burger = this.shadowRoot.querySelector("#burger");
        this.navLink = this.shadowRoot.querySelector("#nav-links");

        this.pTitle = ["home", "app", "documentation"];
    }

    connectedCallback(){
        this.burger.onclick = () => {
            this.navLink.classList.toggle('is-active');
            this.render();
        }
        this.render();
    }

    disconnectedCallback(){
        this.burger.onclick = null;
    }

    capitalize(w){
        return w.charAt(0).toUpperCase() + w.slice(1);
    }

    render(){
        // Get the current website's pathname
        let path = window.location.pathname;
        let page = path.split("/").pop();

        // Add the navigation link and highlight it if it represents the current page
        this.navLink.innerHTML = this.pTitle.map(w => (page == `${w}.html`) ? 
        `<a class="navbar-item has-background-info" href="${w}.html">${this.capitalize(w)}</a>` 
        : `<a class="navbar-item" href="${w}.html">${this.capitalize(w)}</a>`).join("");  
    }
}

customElements.define('scriber-navbar', Navbar);