import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewContent, ViewHeader, ViewTitle } from 'fortnox-react/view';
import { t as gettext } from 'c-3po';
import Beers from 'collections/example.collection.jsx';

class MyView extends React.Component {
	componentDidMount() {
		this.view.finished();
	}

	listBeers() {
		return this.props.beers.map(beer => (
			<li key={beer.get('id')}>
				{`${beer.get('name')} - ${beer.get('size')}`}
			</li>
		));
	}

	render() {
		return (
			<View ref={(view) => { this.view = view; }}>
				<ViewHeader>
					<ViewTitle> Default View </ViewTitle>
				</ViewHeader>
				<ViewContent>
					<h2> {gettext `En lista på öl`} </h2>
					<ul>
						{this.listBeers()}
					</ul>
				</ViewContent>
			</View>
		);
	}
}


MyView.defaultProps = {
	beers: new Beers()
};

MyView.propTypes = {
	beers: PropTypes.object
};

export default MyView;
