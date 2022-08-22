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

     Parameter      	 Type	      		Description
	1. ctaColor		    string		    Color of call to action buttons
	2. textColor		string		    Color of all the text in the widget
	3. backgroundColor	string		    Background theme color of the widget
	4. useWidgetWallet	boolean		    You want to use widget wallet or your own wallet in the Router widget

## Wallet

There is two option to connect with wallet.
    1. One you can directly pass true value in useWalletWidget parameter. Then you can directly use the wallet provide by router widget itself.
	2. Second you can pass wallet provider in the global Window interface location: RouterWidget/index.tsx. Then you can use own wallet on the router widget.
