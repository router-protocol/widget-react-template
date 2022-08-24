# Router Widget Template
Router widget enables partners to allow their users to buy and sell any assets, on and between various blockchains in one click. 

Users will be able to do all this without having to leave the partner’s website.

## Usage/Examples
Below is how you can integrate Router widget in your website.
	For running router widget on your app, you should follow following steps.
	
	1. First copy the Router widget folder into your app.
	2. Then install all the dependencies for router widget for that you have to run lib.sh.
		To run ```lib.sh```
		-In windows and linux -> give permission with ```chmod +x lib.sh```
		-Run -> ```./lib.sh```
    3. Create a Route for Router widget into your app.
    
	3. After installing all the dependencies and route, you can use Router widget into your app.
	

## Parameters

There are multiple parameters which can be provided to customize the widget. 

	Parameter      	 	Type	      		Description
	1. ctaColor		string			Color of call to action buttons

	2. textColor		string		        Color of all the text in the widget

	3. backgroundColor	string		        Background theme color of the widget

	4. useWidgetWallet	boolean		        You want to use widget wallet or your own wallet in the Router widget

	5. fromChain        	string              	ChainId of source chain which needs to be shown as default souce chain; if 
                                            		not provided default souce chain will be chosen as the chain to which 
                                            		user's wallet is  connected. In case wallet is not connected Polygon 
                                            		is shown as default source chain

	6. toChain          	string              	ChainId of destination chain which needs to be shown as default destination
	                                        	chain. If not provided, BSC is shown as default chain

	7.  fromToken       	string              	Address of source token which needs to be shown as selected token on source
	                                        	chain. If   not provided, USDT will be shown as default source token

	8.  toToken         	string              	Address of destination token which needs to be shown as selected token 
	                                        	on destination chain. If not provided, USDT will be shown as default 
                                            		destination token

	9.  logoURI         	string             	Circular logo url, if not given original router logo will be shown

There could be use cases where our partners might want to only show a selected list of chains for their users. We have also provided our partners with that capability; capability to restrict chains/tokens to be shown on the widget.

Restriction parameters are optional and can be used with the above customizable parameters as ```query params``` in url-

	Parameter      		Type	      		Description
	1. srcChains		string		        List of chainId's of source chains seperated by comma that needs to be 
                                            		shown in selection menu. Only these chains will be availbale for the users
                                            		to select on the widget

	2. dstChains		string		        List of chainId's of destination chains seperated by comma that needs to be 
                                            		shown in selection menu.

	3. srcTokens	    	string		        List of addresses of source tokens belonging to list of srcChains seperated 
                                            		by comma that needs to be shown in selection menu.

	4. dstTokens	    	string	            	List of addresses of destination tokens belonging to list of dstChains 
                                           		seperated by comma that needs to be shown in selection menu.


## Wallet

There is two option to connect with wallet.

    1. One you can directly pass true value in useWalletWidget parameter. Then you can directly use the wallet provide by router widget itself.
    
    2. Second you can pass wallet provider in the global Window interface location: RouterWidget/index.tsx. Then you can use own wallet on the router widget.

