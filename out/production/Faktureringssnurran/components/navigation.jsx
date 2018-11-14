import React from 'react';
import { ViewTabMenu } from 'fortnox-react/view';
import { NavLink } from 'react-router-dom';
import { EventBus } from 'fortnox-react/utils';

const Navigation = () => (
	<ViewTabMenu eventbus={EventBus}>
		<NavLink exact to="/" activeClassName="active">Hem</NavLink>
		<NavLink to="/example" activeClassName="active">Exempelvy</NavLink>
	</ViewTabMenu>
);

export default Navigation;
