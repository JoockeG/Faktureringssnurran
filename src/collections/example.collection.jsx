import { Backbone } from 'fortnox-react/utils';

const Beers = Backbone.Collection.extend({

	initialize() {
		this.add({ name: 'Erdinger', size: 'Large', id: 1 });
		this.add({ name: 'Staropramen', size: 'Large', id: 2 });
	}

});


export default Beers;
