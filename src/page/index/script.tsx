import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import * as bootstrap from "../../stylus/bootstrap";
import "./style.scss";

//This script tag is not rendered in prerendered HTML
if (document.currentScript) document.currentScript.parentElement!.removeChild(document.currentScript);

window.onload = () => {
    document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(<div>
        <section>
            <div className={bootstrap.container}>
                <h1>Template-Static-Website</h1>
                <ul>
                    <li>Webpack v2</li>
                    <li>TypeScript</li>
                    <li>Sass</li>
                    <li>PostCSS</li>
                    <li>css-module</li>
                    <li>Japanese Support</li>
                    <li>Pre-rendering with React</li>
                </ul>
            </div>
        </section>

        <section>
            <div className={bootstrap.container}>
                <h2>Typography / タイポグラフィ</h2>

                <h1>Header Level1 / 見出しレベル1</h1>
                <h2>Header Level2 / 見出しレベル2</h2>
                <h3>Header Level3 / 見出しレベル3</h3>
                <h4>Header Level4 / 見出しレベル4</h4>
                <h5>Header Level5 / 見出しレベル5</h5>
                <h6>Header Level6 / 見出しレベル6</h6>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                   et
                   dolore
                   magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                   ea
                   commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                   fugiat
                   nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                   mollit
                   anim id est laborum.</p>
                <p>
                    あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。</p>
            </div>
        </section>
    </div>);
};
