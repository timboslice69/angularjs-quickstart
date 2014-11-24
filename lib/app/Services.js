/**
 * Created by timothy on 24/11/14.
 */
angular
	.module('Services', [])


	.factory(
		'DeviceSvc', [
			'$rootScope', '$resource', 'APP_CONFIG',
			function($rootScope, $resource, APP_CONFIG) {
				var service = {
						_name: 'DeviceSvc',
						apiDefinition: {
							path: APP_CONFIG.API_URI + 'devices/:deviceId/:verify',
							params: {
								deviceId: '@deviceId'
							},
							actions: {
								'get': {
									method: 'GET',
									headers: APP_CONFIG.headers.mobileServices,
									isArray: false
								},
								'query': {
									method: 'GET',
									headers: APP_CONFIG.headers.mobileServices,
									isArray: true
								},
								'update': {
									method: 'PATCH',
									headers: APP_CONFIG.headers.mobileServices,
									isArray: false
								},
								'save': {
									method: 'POST',
									headers: APP_CONFIG.headers.mobileServices,
									isArray: false
								},
								'verify': {
									method: 'GET',
									headers: APP_CONFIG.headers.mobileServices,
									isArray: false,
									params: {
										verify: 'verify'
									}
								},
								'delete': {
									method: 'DELETE',
									headers: APP_CONFIG.headers.mobileServices,
									isArray: false
								}
							}
						}
					},
					log = $h.namedLog(service._name, service);

				/**
				 * Initialise Service
				 */

				service.init = function() {
					//log('init');
					service.api = $resource(service.apiDefinition.path, service.apiDefinition.params, service.apiDefinition.actions);
					service.player = null;
					return service;
				};

				service.getDevice = function(deviceId) {
					//log('getDevice', deviceId);

					return new Promise(function(resolve, reject) {
						var device = service.api.get(
							{
								deviceId: deviceId
							},
							resolve,
							reject
						);
					});
				};

				service.verifyDevice = function(deviceId, verification) {
					//log('verifyDevice', deviceId, verification);

					return new Promise(function(resolve, reject) {
						service.api.verify(
							{
								deviceId: deviceId,
								verification: verification
							},
							resolve,
							reject
						);
					});
				};

				return service.init(); // Return Service
			}
		]
	);