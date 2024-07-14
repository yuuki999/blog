import { ClientComponent } from "../../components/_test/client";
import { ServerComponent } from "../../components/_test/server";

export default function Test() {

  console.log("test1: これはpage.tsxがサーバーサイド")

    return (
      <>
        <h1>Test1</h1>
        {/* RSCからCCを実行すると、フロントエンドのconsoleにもログが出る。 つまりこれはCSR*/}
        <ClientComponent data="1"></ClientComponent>
        {/* RSCからRSCを実行すると完全にSSRとなるので、フロントエンドのconsoleにもログが出ない。 */}
        <ServerComponent id="1" />



        {/* ログ(pnpm dev)に出力される順番を調査してみたら下記になる。
            test1: これはpage.tsxがサーバーサイド
            ServerComponent
            ClientComponent 
            
            なので、RSCが先にビルドされ、次にCCがビルドされる順番。*/}
      </>
    );
}

