import { Backbone } from 'fortnox-react/utils';

const Airplane = Backbone.Model.extend({

	initialize() {
		this.set('example', true);
	}

});

export default Airplane;
