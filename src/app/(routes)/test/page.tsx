"use client";

import { ClientComponent } from "../../components/_test/client";
import { ServerComponent } from "../../components/_test/server";

export default function Test() {

    console.log("test: これはpage.tsxがCC")

    return (
      <>
        <h1>Test</h1>
        <ClientComponent data="1"></ClientComponent>
        {/* エラーにはならないが、clientからRSCとして読み取ることはできない、なぜならRSCは画面レンダリング時にすでにDOMで実行されているから。 
        なので、このRSCはCCの状態となってレンダリングされる。*/}
        <ServerComponent id="1" />

        {/* ここのログの順番は下記。
            test: これはpage.tsxがCC
            ClientComponent
            ServerComponent 
            
            先にRSCがビルドされ、次にCCがビルドされる順番の法則があるのにclientが先に来ている
            これはCCからRSCを読み出すとRSCがCCになるので、ServerComponentがclientとして読み出される。
            なので、ClientComponentもServerComponentもCCとみなされ、ServerComponentが先に出力されない。
            */}
      </>
    );
}

