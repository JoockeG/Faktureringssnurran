import 'should';
import 'should-enzyme';
import { mount } from 'enzyme';

import React from 'react';


import ExampleComponent from 'components/example.jsx';
import Header from 'components/header.jsx';
import UserInfo from 'components/header/userinfo.jsx';
import Notifications from 'components/header/notifications.jsx';

// Documentation for test-api Enzyme/Should: https://github.com/rkotze/should-enzyme

describe('ExampleComponent #', () => {
	it('Contains correct data', (done) => {
		const wrapper = mount(<ExampleComponent />);
		wrapper.should.contain(<li> Item 3 </li>);
		wrapper.should.contain(<li> Item 2 </li>);
		wrapper.should.contain(<li> Item 1 </li>);
		done();
	});
});

describe('Header', () => {
	it('Has a title', (done) => {
		const wrapper = mount(<Header />);
		wrapper.should.contain(
			<div className="logo"> <div className="svg-cloud" />app title</div>
    );
		done();
	});

	it('Has userinformation', (done) => {
		const wrapper = mount(<Header />);
		wrapper.should.contain(<UserInfo />);
		done();
	});

	it('Has notifications', (done) => {
		const wrapper = mount(<Header />);
		wrapper.should.contain(<Notifications />);
		done();
	});
});
