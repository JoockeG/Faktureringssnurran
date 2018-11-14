import { ajaxSetup } from 'fortnox-react/setup';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { envPath, launchApp } from 'fortnox-react/utils';
import MyApp from 'components/myapp';

ajaxSetup();

/**
 * The main Application Entrypoint
 *
 * @class
 * @name App
 *
 * @return {App}
 */

const App = () => (
	<Router basename={envPath()}>
		<MyApp />
	</Router>
);

/* The DOM is ready, run the app */
function init() {
	const container = document.createElement('div');
	document.body.appendChild(container);
	ReactDOM.render(<App />, container);
}

launchApp(init);
