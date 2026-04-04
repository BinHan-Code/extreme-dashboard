export interface MangaChapter {
  title: string;
  content: string;
  link: string;
}

export const mangaChapters: MangaChapter[] = [
  {
    title: "Extreme Campus Fabric / Short Path Bridging (SPB) &#8211; 1",
    link: "https://hantechnote.wordpress.com/2018/12/04/extreme-campus-fabric-short-path-bridging-spb-1/",
    content: `<p>本稿では、私はShort Path Bridging (SPB) が強力なネットワーク技術である理由を紹介したいと思います。そのまえに、まず私の同僚(Johnny Hermansen / Senior Systems Engineer in Extreme Networks) へ感謝したいです。彼のサポートにより、この記事ができました。</p>
<p>さて、なぜネットワークはSPB を考慮する必要があるのでしょうか？SPB は、伝統ネットワークソリューションにより、多くの利点があります。</p>
<ul>
<li><strong>コンピュータネットワークを大幅に簡素化します。</strong>SPB は、複雑なネットワークプロトコルを排除し、イーサネット(データ伝送用)とISIS ルーティングプロトコル(コントロールプレーン用)の2つ簡単なプロトコルで構築しました。SPB は脳を持つイーサネットです。(<em>簡素化により、運用経費が66% 減・設定時間60% 減)</em></li>
</ul>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/spb.png" alt="SPB" style="max-width:100%" /></p>
<ul>
<li><strong>柔軟性は非常に高いです。</strong>ネットワークループを心配することなく、任意のネットワークトポロジを構築できます。実は、より多くのリンクとループを作成するほど、冗長性と容量が向上します。(<em>五輪での実績があります</em>)<img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/1.png" alt="1.PNG" style="max-width:100%" /></li>
<li><strong>非常にスケーラブルです。</strong>数ノードから数百ノードまでに簡単に拡張できます(<em>今までで600ノードクラスでの実績があります</em>)。SPB は150,000 以上のワークスペースと40,000 台のATM マシンをサポートします。</li>
</ul>
<ul>
<li><strong>非常に安全です。</strong>セキュアなネットワークゾーンを簡単に構築することができます。ハッカーがネットワーク自体をハークすることは事実上不可能です。(<em>Zero Breaches ・ハッカソン実施・ハッカーに見えない網</em>)</li>
</ul>
<ul>
<li><strong>仮想化サービスをサポートする。</strong>物理のインフラストラクチャ上に数千の仮想ネットワークを構築できます。SPB の規格自体は仮想レイヤー-2 ネットワークを定義し、1600 万以上のネットワークをサポートし、かつ物理インフラストラクチャ内のどこにでも拡張できます。ExtremeNetworks ではSPB の規格以上に仮想レイヤー3 ネットワークのサポートを追加しました。<img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/21.png" alt="2.PNG" style="max-width:100%" /></li>
</ul>
<p>一つコマンドで新しい仮想ネットワークが追加できます。同じラベル1010 (緑の仮想ネットワーク) を持っているノード間が通信できます。<img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/3.png" alt="3.PNG" style="max-width:100%" /></p>
<p>仮想レイヤー3 ネットワークも構築できます(必要に応じてどこでもルーティングポイントを配置できます)。<img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/4.png" alt="4.PNG" style="max-width:100%" /></p>
<ul>
<li><strong>マルチキャストトラフィックのサポートがSPB にネイティブに組み込まれています</strong>。PIM あるいは複雑なマルチキャストプロトコルは必要ありません。マルチキャストの機能を有効するだけです。</li>
</ul>
<p>下記の表は、Extreme Campus Fabric を実装したお客様が実際の展開で経験したことを正確に検証するため、独立した調査が委託されました。<img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/spb_1.png" alt="SPB_1" style="max-width:100%" /></p>
<p>最後に、SPB はIEEE802.1aq とRFC6329 として規格化された技術です。</p>
<p>ご興味をお持ちいただけましたら、嬉しいです。他の記事でSPB に関して少し深めて内容を紹介したいです。よろしくお願い致します！</p>`,
  },
  {
    title: "Extreme Campus Fabric / Short Path Bridging (SPB) &#8211; 2",
    link: "https://hantechnote.wordpress.com/2018/12/06/extreme-campus-fabric-short-path-bridging-spb-2/",
    content: `<p><a href="https://hantechnote.wordpress.com/2018/12/04/extreme-campus-fabric-short-path-bridging-spb-1/">Extreme Campus Fabric / Short Path Bridging (SPB) -1 </a>では、SPB の素晴らしさを説明しました。しかし、SPB はどのように動いていますでか？</p>
<p>その答えは、IS-IS ルーティングプロトコルです（コントロールプレーンとして覚えてください）。IS-IS は数十年前に開発されたプロトコルであり、非常に堅牢であり、かなり大きなネットワークがサポートできます。IS-IS はOSPF と同様に、隣接ノードとHello メッセージを交換することでネイバー関係を確立します。その後、ネットワーク全体の地図(トポロジマップ)を作成します。さらに、そのトポロジマップから、ネットワーク内の各ノードから各ノードまでの最短経路を計算します。しかし、IS-IS は以下２つの非常に重要な特性があります。</p>
<ul>
<li>OSPF と違い、TCP / IP を使用せず、レイヤ2 で直接に実行します。SPB は純粋なイーサネットとMAC Address を利用します。また、この特徴を生かして、SPB ネットワークはIP Address がなしでも構築できる理由となります。IP Address がないので、ハッカーにとって攻撃やなりすましがより困難です。</li>
<li>パケットエンコーディングはTLV (Type-Length-Variable) を利用しています。そのため、SPB ネットワークは柔易的に新しいTLV の属性を作成できます。ExtremeNetworks(Avaya) は新しい3 つのTLV を追加で作成しました。</li>
</ul>
<p>ネットワーク運用の視点から、IS-IS は２つの基本タスクがあります：</p>
<ul>
<li>ネットワーク全体の地図(トポロジマップ)を作成し、ネットワーク内に任意のノードから任意のノードまでへの最短経路を計算します。IS-IS はこの最短経路を使い、トラフィックを転送します。</li>
<li>新しい仮想ネットワークを作成する、あるいは拡張する時、ネットワーク内にマルチキャストでアナウンスします。</li>
</ul>
<p>再度、下記の奇妙なネットワークを見ましょう。ネットワークノードはIS-IS を使い、おおいに話します。そして、パケットがループしないようにトポロジマップを作成します。<img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/5.png" alt="5" style="max-width:100%" /></p>
<p>この時点で、上記のSPBネットワークには 2 種類のノード(スイッチ)があります。</p>
<ul>
<li>あなたのコンピュータや他のエンドデバイスを接続するノード: これらのノードは<strong>BEB (Backbone Edge Bridges)</strong> と呼ばれます。</li>
<li>エンドデバイスが接続されず、他のSPB ノードのみを接続されるノード: これらのノードは<strong>BCB (Backbone Core Bridges)</strong> と呼ばれます。</li>
</ul>
<p>また、SPB ネットワークには 2 種類のインターフェイスもあります。</p>
<ul>
<li>BEB ノード上にエンドデバイスを接続しているインターフェイス: <strong>UNI (User Network Interface)</strong></li>
<li>SPB ノード間を接続するインターフェイス: <strong>NNI (Network Network Interface)</strong></li>
</ul>
<p>大まかに言えば、これは基本的にSPB ネットワークを構築する方法です。緑の仮想ネットワークを確立するには、4つのBEB ノード上に次のコマンドを入力するのが必要です。</p>
<pre><em><strong>vlan i-sid 10 10010</strong></em></pre>
<p><strong>これからはSPB ネットワークの美しさを強調します。</strong></p>
<ol>
<li>すべてのエッジスイッチは同じvlan を設定する必要はありません。vlan 10、vlan 101、と vlan 714 は同じi-sid にマッピングします。</li>
<li>あなたはBCB ノードに全く触れません。本当に単純な1つのコマンドだけがあれば、OK です。</li>
</ol>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/6.png" alt="6" style="max-width:100%" /></p>
<p>SPB ネットワーク上に4つの簡潔なコマンド(エッジスイッチに1個ずつ)だけで、緑の仮想ネットワークを作成し、ユーザー間の通信ができます。（私は知っている一つ会社がこのような仮想レイヤ2ネットワークが1000以上あります）。</p>
<p>他のネットワーク技術がこれほどシンプルできますか？：）</p>
<p>次回は、SPB ネットワーク上のフレーム(パケット)の流れを紹介したいと思います。よろしくお願い致します！</p>`,
  },
  {
    title: "Extreme Campus Fabric / Short Path Bridging (SPB) &#8211; 3",
    link: "https://hantechnote.wordpress.com/2018/12/11/extreme-campus-fabric-short-path-bridging-spb-3/",
    content: `<p>SPB -1 と -2 を読んでいれば、あるホストから別のホストまでトラフィック(イーサネットフレーム)をどう流すかという質問があるではないかと考えております。本稿では、この質問を回答したいです。</p>
<p>BEB(Backbone Edge Bridges) ノードは処理しなければならない項目が４つあります。</p>
<ol>
<li>UNI で受信したイーサネットフレームはどの仮想ネットワークに所属するかを調べる。</li>
<li>UNI で受信したイーサネットフレームはどこに送信するかを調査する(宛先はどのBEB ノードを接続するか？)。</li>
<li>UNI で受信したイーサネットフレームをカプセル化する (IEEE 802.1ah で定義されたMAC-in-MAC を使用する)。</li>
<li>NNI で受信したカプセルされたMAC-in-MAC のイーサネットフレームを取り除き、元のイーサネットフレームを変換し、宛先のホストへ通常のイーサネットフレームを転送する。</li>
</ol>
<p>普通のイーサネットスイッチはローカルに接続されているすべてのエッジノードを学習します。一方、BEB はローカルでエッジノードを学習するだけではなく、同じ仮想レイヤ2ネットワークに所属している他のBEB に接続しているエッジノードも学習します。</p>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/7.png" alt="7" style="max-width:100%" /></p>
<p>BEB1、BEB2、BEB3、とBEB4 はすべて緑の仮想ネットワークに所属しますので、これらのBEB はこの緑の仮想ネットワークに接続しているすべての緑のホストを学習します。例えば、BEB1 は、PC11 とPC12 が自分に接続されることがわかるだけではなく、PC21 とPC22がBEB2 に接続している、S1 がBEB4 に接続していることもわかります。</p>
<p>一方、BCB ノードの動きは非常に単純です。BEB からのMAC-in-MAC でカプセルされたイーサネットフレームを受信する場合、自分のトポロジマップを参照し、宛先へ最短経路を確認してから、次のノードへトラフィックを転送します。</p>
<p>なお、BCB はイーサネットフレームを受信する時、最短経路上で受信されるかどうかがチェックします。もしそうでない場合、ネットワーク上にトラフィックのループを発生しないように該当のフレームがドロップします。つまり、SPB ネットワーク内でループが発生することはありません。</p>
<p>下記の図を使い、あるホストから別のホストまでトラフィック(イーサネットフレーム)がどのように到達するかについて簡潔に説明します。</p>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/8.png" alt="8" style="max-width:100%" /></p>
<p>PC1 がサーバーS1 と通信したいです。</p>
<ol>
<li>PC1 はS1 のMAC Address を知るため、ネットワークにARP 要求を送信します。このARP 要求は、BEB1 を経由し、マルチキャストで緑の仮想ネットワークに所属するすべてのBEBノードへ転送する。</li>
<li>BEB2、BEB3、とBEB4 はすべての緑のホストへこのARP要求をブロードキャストする。</li>
<li>S1 はこのARP 要求を受信し、ARP 応答を返信する。</li>
<li>BEB4 はS1 からのARP 応答を受信します。BEB4 はBEB1 へS1 からのARP応答を転送する。</li>
<li>BEB1 はS1 からのARP 応答を受信し、PC1 へ転送する。</li>
<li>PC1 はS1 からARP 応答を解読し、S1 のMAC Address がわかります。その後、PC1 はIP パケットを作成し、S1へ送信する。</li>
<li>BEB1 は既にS1 がBEB4に接続されていることを分かったので、PC1 からのパケットをMAC-in-MAC でカプセルします。この新しいイーサネットフレームの宛先のMAC Address はBEB4 のMAC Address です。</li>
<li>BEB4 はこの新しいイーサネットフレームの外部のMAC Addressを取り除き、もとのイーサネットフレームを戻し、S1 へ転送する。</li>
</ol>
<p>I-SID は、サービス識別子または仮想ネットワーク識別子であり、SPB のプロパティにとって重要です。I-SID は24bit であり、理論上は16777215 個の仮想ネットワークを定義することができます。</p>
<p>次回は、SPB 上の仮想レイヤ3 のネットワークを紹介したいと思います。よろしくお願い致します！</p>`,
  },
  {
    title: "Extreme Campus Fabric / Short Path Bridging (SPB) &#8211; 4",
    link: "https://hantechnote.wordpress.com/2018/12/12/extreme-campus-fabric-short-path-bridging-spb-4/",
    content: `<p>SPB -1, -2, -3の内容は、IEEE 802.1aq に基づいて説明しました。IEEE 802.1aq は仮想レイヤ2ネットワークしか定義されておりません。しかし、一般的なキャンパスネットワークでは、レイヤ3サービス・ルーティングのサポートも必要です。Extreme Campus Fabric は仮想レイヤ2ネットワークをサポートするだけではなく、仮想レイヤ3ネットワークもサポートします。</p>
<p>昔、ネットワーク上に「ルーティングポイントはどこに設定すればいいですか？」という議論がよくあると思います。Extreme Campus Fabric の回答は、「仮想レイヤ3ネットワークを使い、あなたのニーズを合わせて、SPB ネットワーク上にルーティングポイントを設置することができる」となります。</p>
<p>SPB ネットワーク上で仮想レイヤ3ネットワークを作成する方法は、仮想レイヤ2ネットワークを作成する方法と非常に似ってます。仮想レイヤ2ネットワークの場合は、vlan とi-sid をマッピングします。一方、仮想レイヤ3ネットワークは、<strong>VRF(Virtual Routing and Forwarding) とi-sid をマッピングします。</strong></p>
<p>以下の図を考えてみましょう。すべてのVRF はi-sid 1001 とマッピングし、仮想レイヤ3ネットワークを作成しました。様々サプネットにホストを接続しています。また、仮想ルータR1、R2、R3、とR4 は仮想レイヤ3ネットワークの一部です。そして、すべてのホストはこの青い仮想レイヤ3ネットワークに所属し、お互いに通信する事ができます。恐らくあなたが推測しているように、このネットワーク情報の交換はIS-IS によって処理されるではないでしょうか？ご認識の通り、IS-IS で処理され、OSFP、RIP あるいはその他のルーティングプロトコルは一切に不要です。</p>
<p>この仮想レイヤ3ネットワーク(またはIPVPN と呼ぶこともできます)は、わずかなコマンドで作成されました。仮想レイヤ2ネットワークの作成と同様に、青い仮想ルータを設置するスイッチのみで設定します。R1(BEB1) とR2(BEB4) の間に何百ノードがあるかもしれませんが、それらノードに関しては、一切触れません。美しいではないでしょうか？</p>
<p>最終に、サブネット1、2、3、4、5、と6 上のホストは、普通のルーティングネットワークと同様に通信できます。</p>
<p>寂しくこのネットワーク上にトラフィックの流れを説明致します。サプネット1 上のPC11 がサプネット6 上のサーバS1 に何らかを通信したいと想定します。通常のIP ルーティングのように、PC11 はイーサネットフレームがIP パケットにカプセル化し、デフォルトゲートウェイ(R1) に送信します。SPB ネットワークの場合、BEB1 はR4 がBEB4 にあることわかりますので、BEB1 は宛先アドレスはBEB4 のMAC Address をを使用して、MAC-in-MAC でカプセルをを行い、ISID 1001 を設定し、最短経路でBEB4 へ転送します。</p>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/9.png" alt="9" style="max-width:100%" /></p>
<p>次回は、ネットワーク上に様々なサービスはどのように組み合わせて相互接続するかを紹介したいと思います。よろしくお願い致します！</p>`,
  },
  {
    title: "Extreme Campus Fabric / Short Path Bridging (SPB) &#8211; 5",
    link: "https://hantechnote.wordpress.com/2018/12/13/extreme-campus-fabric-short-path-bridging-spb-5/",
    content: `<p>ようこそ、Extreme Campus Fabric / Short Path Bridging (SPB) –5 です。今のキャンパスネットワークはお客様の要望によって、彼らのネットワーク上に様々なサービスを載せっています。本篇では、SPB のネットワーク上に様々なサービスを組み合わせる方法についてご紹介したいと思います。</p>
<p>さて、下記の例を使い、説明したいです。</p>
<p>お客様のネットワークにいくつかのサーバが同じサプネットに入らなければならないと想定します。例えば、ネットワーク上に仮想サーバーの移動をサポートします。さらに物理サーバーは同じデータセンター内または異なるデータセンター内に置く必要があります。</p>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/11-1.png" alt="11" style="max-width:100%" /></p>
<p>この要求に対して、サーバー用の仮想レイヤ2ネットワークとユーザー用の仮想レイヤ3ネットワークを作成し、相互接続することによって、実現することができます。</p>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/12-e1544664553285.png" alt="12" style="max-width:100%" /></p>
<p>もちろん、2つ以上の仮想レイヤ3ネットワークを相互接続し、それら間のトラフィックを許可することもできます。この主張を説明するため、下記の図を考えましょう。ネットワーク上に異なる2つ企業に対して、共通のサービスを提供します。しかし、安全のため、企業間のトラフィックを通る することが許可できません。</p>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/13-1.png" alt="13" style="max-width:100%" /></p>
<p><strong>これからもうひとつSPB ネットワークの美しさを紹介したいです！</strong>通常のネットワークの場合、上記の構成を実現するため、複雑なACL アクセスリストを使用するのと思います。SPB ネットワークでは、アクセスリストを使わず、本当にいくつかシンプルコマンドだけがあれば、十分です。</p>
<p>青いルーター(R4)上 に：</p>
<pre>router vrf blue
  isis accept i-sid 300 enable
exit
isis apply accept vrf blue</pre>
<p>緑ルーター(R5)上 に：</p>
<pre>router vrf green
  isis accept i-sid 300 enable
exit
isis apply accept vrf green</pre>
<p>2つの赤いルーター上に：</p>
<pre>router vrf red
  isis accept i-sid 100 enable
  isis accept i-sid 200 enable
exit
isis apply accept vrf red</pre>
<p>さあ～、どうですか？ SPB ネットワークを使い、仮想レイヤ2ネットワークと仮想レイヤ3ネットワークの柔軟に組み合わせて、あらゆるネットワークサービスを構築できるのと思います。</p>
<p>次回は、SPB ネットワークでIP マルチキャストをサポートする方法を紹介したいと考えております。よろしくお願い致します！</p>`,
  },
  {
    title: "Extreme Campus Fabric / Short Path Bridging (SPB) &#8211; 6",
    link: "https://hantechnote.wordpress.com/2018/12/17/extreme-campus-fabric-short-path-bridging-spb-6/",
    content: `<p>ようこそ、Extreme Campus Fabric / Short Path Bridging (SPB) – 6 です。本稿では、SPB がどのようにマルチキャストをサポートしているかを説明したいです。</p>
<p>SPB -1 で説明したように、マルチキャストトラフィックのサポートはSPB に組み込まれます。しかし、これはレイヤ2ネットワークのマルチキャスト機能です。IP マルチキャスト機能を利用するため、ExtremeNetworks(Avaya) はIS-IS のプロトコル2つ機能を拡張しました。1つは仮想レイヤ2ネットワークおよび仮想レイヤ3ネットワークのIP マルチキャストトラフィックをサポートします。もう一つはグローバルルーティングテーブル(VRF0) にIP マルチキャストトラフィックをサポートします。</p>
<p>再度強調しますが、SPB は最強なマルチキャストソリューションです。一般的なネットワークがマルチキャストをサポートする時、PIM などのマルチキャストプロトコルのサポートが必要です。たいへん幸いなことですが、SPB はPIM など複雑なマルチキャストプロトコルを使いません。また、SPB ネットワークは市場上に他のマルチキャストネットワークソリューションにより拡張性を持っています。さらに、他のソリューションにより早い再収束時間が早い、かつ設定がシンプルです。</p>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/14.png" alt="14" style="max-width:100%" /></p>
<p>あるタイミングでBEB3 に接続したユーザも、ビデオストリームを見たいですので、そのユーザ もBEB3 へIGMP Join リクエストを送信します。BEB3 は該当IGMP Join リクエスト を受信し、IS-IS を使い、SPB ネットワークにマルチキャストストリームを参加することを通知します。</p>
<p>下記は重要なポイントをまとめます。</p>
<ul>
<li>SPB ネットワーク上にマルチキャストトラフィックの転送は、ユニキャストトラフィックの転送と同様であり、同じルール及び同じメカニズムを利用します。</li>
<li>一般的なネットワークと違い、マルチキャストを処理するため、追加のマルチキャストプロトコルがありません。フェイルオーバーの時間は1 秒以内となります(ネットワークのサイズに依存しますが、フェイルオーバーの時間は約 200 ~ 300 ミリ秒となるケースが多いです)。</li>
<li>Extreme Campus Fabric (SPB）ではBEB ノードは通常 6000マルチキャストストリームをサポートし、BCB ノードは 16000 マルチキャストストリームをサポートすることができます。</li>
</ul>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/15.png" alt="15" style="max-width:100%" /></p>
<p>IP multicast を有効したい場合、BEB1と BEB2 には：</p>
<pre>router isis
  spbm 1 multicast enable
exit

interface vlan 10
  ip igmp snooping
  ip igmp snoop-querier
exit</pre>
<p>BEB3 に：</p>
<pre>router isis
  spbm 1 multicast enable
exit

interface vlan 7
  ip igmp snooping
  ip igmp snoop-querier
exit</pre>
<p>BEB4 に：</p>
<pre>router isis
  spbm 1 multicast enable
exit

interface vlan 150
  ip igmp snooping
  ip igmp snoop-querier
exit</pre>
<p>完了です！</p>
<p><img src="https://hantechnote.wordpress.com/wp-content/uploads/2018/12/17.png" alt="17" style="max-width:100%" /></p>
<p>仮想レイヤ3ネットワーク上にマルチキャストを流したい場合：</p>
<pre>router vrf blue
  mvpn enable
exit

interface vlan 200
  ip spb-multicast enable
exit</pre>
<p>完了です！</p>
<p>Extreme Campus Fabric (SPB）のシンプルさ、良さ及び強さは感じられますでしょうか？よろしくお願い致します。</p>`,
  },
  {
    title: "Extreme Campus Fabric / Short Path Bridging (SPB) &#8211; 7",
    link: "https://hantechnote.wordpress.com/2018/12/22/extreme-campus-fabric-short-path-bridging-spb-7/",
    content: `<p>一連の記事では、私は簡潔に Extreme Campus Fabric を紹介しました。</p>
<p>IT 業界では、非常に重要なテーマの一つは自動化或いはIT サービスチェーンの自動化と考えております。私の理解する限りでは、自動化がデータセンターで主に起こっています。一方、キャンパスある いは企業環境のネットワークは自動化が遅れています。</p>
<p>Extreme Campus Fabric はあなたのキャンパスネットワークの自動化を貢献できると考えております。仮想ネットワークサービスを提供する時、ネットワークのエッジ或いはネットワークの端に定義し、エッジとエッジ或いは端と端の間にあるすべてのネットワークノードは自動的にプロビジョニングされます。</p>
<p>ここで一つの実例を紹介されてくださいい。かなり大規模な会社(この企業のネットワークは約800 のネットワークノードがあり、また40 拠点があります)に勤務している ネットワークエンジニアは２つ異なる拠点の研究チームのネットワークを結びたいです。この二つ拠点の間に非常に複雑な物理的なインフラがあります。拠点1 の研究チームはVLAN 20 を使用しています。一方、拠点2 の研究チームはVLAN 80 を使用しています。ネットワークエンジニアは次のように述べました。「私は拠点1 のBEB ノードに <code>vlan i-isid 20 1001</code> を入力し、拠点2 のBEB ノードに <code>vlan isid 80 1001</code> を入力しました。完了しました！　信じられないほど単純でした。」</p>
<p>Extreme Campus Fabric を使用することで、あなたのIT チームは信頼性が高い、かつ柔軟性をもつ仮想化されたネットワークアーキテクチャを簡潔に構築することができます。この特徴を活かして、あなたのIT チームはネットワーク上に素早くに新しいサービスを作る或いはサービスを変更することができます。さらに、Extreme Campus Fabric が複数なプロトコルオーバーレイを削除することにより、あなたのネットワークの回復時間が短縮され、管理が容易になり、トラブルシューティングも簡潔になります。Extreme Campus Fabric は、仮想レイ2、仮想レイ3、IPルーティング、および IP マルチキャストサービスをサポートする次世代のイーサネットワークだと考えております。</p>
<p>ぜひ下記のURL をクリックし、Extreme Campus Fabric のビデオをご覧ください。</p>
<p><a href="https://www.extremenetworks.com/resources/video/how-does-extremefabric-work/" target="_blank" rel="noopener noreferrer">How Does ExtremeFabric Work? →</a></p>`,
  },
];
