import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppContainer, CustomPropTypes, ActionMessageQueue as MessageQueue, EventBus } from 'fortnox-react/utils';
import { Viewport } from 'fortnox-react/view';
import Navigation from 'components/navigation.jsx';

import IndexView from 'views/index.jsx';
import ExampleView from 'views/example.jsx';

const MyApp = props => (
	<AppContainer namespace="/app">
		<Viewport actionMessageQueue={props.messageQueue}>
			<Navigation />
			<Route exact path="/" component={IndexView} />
			<Route path="/example" component={ExampleView} />
		</Viewport>
	</AppContainer>
);

MyApp.contextTypes = {
	router: PropTypes.shape({
		history: PropTypes.object.isRequired
	})
};

MyApp.propTypes = {
	messageQueue: CustomPropTypes.collection
};

MyApp.defaultProps = {
	messageQueue: new MessageQueue([], { eventBus: EventBus })
};

export default MyApp;
