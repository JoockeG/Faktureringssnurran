
import React from 'react';
import { View, ViewContent, ViewHeader, ViewTitle } from 'fortnox-react/view';

class MyView extends React.Component {
	componentDidMount() {
		this.view.finished();
	}

	render() {
		return (
			<View ref={(view) => { this.view = view; }}>
				<ViewHeader>
					<ViewTitle> Exempelvy </ViewTitle>
				</ViewHeader>
				<ViewContent>
					<h2> En vy med det minimala som behövs. </h2>
				</ViewContent>
			</View>
		);
	}
}

export default MyView;
