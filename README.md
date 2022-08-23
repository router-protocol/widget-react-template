<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="Router_Widget_Template_0"></a>Router Widget Template</h1>
<p class="has-line-data" data-line-start="1" data-line-end="2">Router widget enables partners to allow their users to buy and sell any assets, on and between various blockchains in one click.</p>
<p class="has-line-data" data-line-start="3" data-line-end="4">Users will be able to do all this without having to leave the partner’s website.</p>
<h2 class="code-line" data-line-start=5 data-line-end=6 ><a id="UsageExamples_5"></a>Usage/Examples</h2>
<p class="has-line-data" data-line-start="6" data-line-end="8">Below is how you can integrate Router widget in your website.<br>
For running router widget on your app, you should follow following steps.</p>
<pre><code>1. First copy the Router widget folder into your app.

2. Then install all the dependencies for router widget for that you have to run lib.sh.
    To run ```lib.sh```
    -In windows and linux -&gt; give permission with ```chmod +x lib.sh```
    -Run -&gt; ```./lib.sh```
3. Create a Route for Router widget into your app.

3. After installing all the dependencies and route, you can use Router widget into your app.
</code></pre>
<h2 class="code-line" data-line-start=20 data-line-end=21 ><a id="Parameters_20"></a>Parameters</h2>
<p class="has-line-data" data-line-start="22" data-line-end="23">There are multiple parameters which can be provided to customize the widget.</p>
<pre><code> Parameter           Type               Description
1. ctaColor         string          Color of call to action buttons
2. textColor        string          Color of all the text in the widget
3. backgroundColor  string          Background theme color of the widget
4. useWidgetWallet  boolean         You want to use widget wallet or your own wallet in the Router widget
5. fromChain        string          ChainId of source chain which needs to be shown as default souce chain; if not  
                                    provided default souce chain will be chosen as the chain to which user's wallet
                                    is  connected. In case wallet is not connected Polygon is shown as default 
                                    source chain
6. toChain          string          ChainId of destination chain which needs to be shown as default destination chain. If                                     not provided, BSC is shown as default chain
7.  fromToken       string          Address of source token which needs to be shown as selected token on source chain. If                                     not provided, USDT will be shown as default source token
8.  toToken         string          Address of destination token which needs to be shown as selected token on          
                                    destination chain. If not provided, USDT will be shown as default destination 
                                    token
9.  logoURI         string          Circular logo url, if not given original router logo will be shown
</code></pre>
<p class="has-line-data" data-line-start="40" data-line-end="41">There could be use cases where our partners might want to only show a selected list of chains for their users. We have also provided our partners with that capability; capability to restrict chains/tokens to be shown on the widget.</p>
<p class="has-line-data" data-line-start="42" data-line-end="43">Restriction parameters are optional and can be used with the above customizable parameters as <code>query params</code> in url-</p>
<pre><code>    Parameter        Type               Description
1. srcChains        string          List of chainId's of source chains seperated by comma that needs to be shown in      
                                    selection menu. Only these chains will be availbale for the users to select on 
                                    the widget
2. dstChains        string          List of chainId's of destination chains seperated by comma that needs to be shown in                                     selection menu.
3. srcTokens        string          List of addresses of source tokens belonging to list of srcChains seperated by 
                                    comma that needs to be shown in selection menu.
4. dstTokens        string          List of addresses of destination tokens belonging to list of dstChains 
                                    seperated by comma that needs to be shown in selection menu.
</code></pre>
<h2 class="code-line" data-line-start=54 data-line-end=55 ><a id="Wallet_54"></a>Wallet</h2>
<p class="has-line-data" data-line-start="56" data-line-end="57">There is two option to connect with wallet.</p>
<pre><code>1. One you can directly pass true value in useWalletWidget parameter. Then you can directly use the wallet provide by router widget itself.

2. Second you can pass wallet provider in the global Window interface location: RouterWidget/index.tsx. Then you can use own wallet on the router widget.
</code></pre>
