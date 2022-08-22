# Router Widget Template
An alternative for use of router widget via react component rather than iframe.

## Usage/Examples
For running router widget on your app, you should follow following steps - <br />
1. First copy the Router widget folder into your components directory of your react app. <br />
2. Then install all the dependencies for router widget for that you have to run lib.sh. <br />
   To run ```lib.sh```<br />
	-In windows and linux -> give permission with ```chmod +x lib.sh```<br />
	-Run -> ```./lib.sh```<br />
3. After installing all the dependencies, you can use it as an independent react component.<br />
Note - You can checkout **usage-example** branch for the applied code.<br />
## Parameters

There are multiple parameters which can be provided to customize the widget. 

     Parameter      	 Type	      		Description
	1. ctaColor		    string		    Color of call to action buttons
	2. textColor		string		    Color of all the text in the widget
	3. backgroundColor	string		    Background theme color of the widget
	4. useWidgetWallet	boolean		    Send false if you want to your own wallet and save your app provider in window.walletProvider
