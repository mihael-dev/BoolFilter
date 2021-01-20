define( ["qlik", "text!./template.html", "text!./style.css", "jquery" ],
	function ( qlik, template, cssContent, $ ) {
		$( "<style>" ).html( cssContent ).appendTo( "head" );
		return {
			template: template,
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 1,
						qHeight: 0
					}]
				}
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					settings: {
						uses: "settings",
						items : {
							configuration: {
								type: 'items',
								label: 'Configuration',
								items : {
									SelectionFieldName: {
										type: 'string',
										ref: 'selectionfieldName',
										label: 'Selection Field Name',
										expression: 'optional',
										defaultValue: 'Customer'
									},	
									FieldName: {
										type: 'string',
										ref: 'fieldName',
										label: 'Search Field Name',
										expression: 'optional',
										defaultValue: 'Customer'
									},								
									Expression : {
										type: 'string',
										ref: 'boolExpression',
										label: 'Generated Expression',
										expression: 'optional',
										defaultValue: "='count($1 Customer) > 0' "		
									},
									DefaultExpression:	
									{
										type: 'string',
										ref: 'searchExpression',
										label: 'Search String Placeholder',
										expression: 'optional',
										defaultValue: 'e.g. (123+456)/789'	
									}
								}	
							}
						}
					}	
				}
				
			},
			
			paint: function (layout) {
				
				
				return qlik.Promise.resolve();
			},
			
			controller: ['$scope', function ( $scope ) {
				
				
				var app = qlik.currApp(this);
								
				$scope.clearFilter = function() {
					
					$scope.name = "";
					var query = createSelectionQuery();
					app.field($scope.layout.selectionfieldName).clear();
					
				};
				
				$scope.setFilter = function(){
				
					var query = createSelectionQuery();
					
					var selectionString = "=" + query;
					app.field($scope.layout.selectionfieldName).selectMatch(selectionString);
					
				}
				
				

				function createSelectionQuery() {
					var query = getSelectionQuery();
					
					if (query != null && query != "") { 
						
						queryWithNot = query + " AND " + "(sum({<" + $scope.layout.fieldName + "=P(" + $scope.layout.fieldName + ")>} 0) = 0)";
					} else {
						queryWithNot = "1=1";
					}
					
					return queryWithNot
				}
				
				function getSelectionQuery() {
					var codeString = $scope.name;
					
					var codesS = codeString.replace(/[+]/g, '|').replace(/[-]/g, '|').replace(/[/]/g, '|').replace(/[(]/g, '|').replace(/[)]/g, '|').replace(/\s\s+/g, '|'); 
					
					
					var query = codeString;
					var codes = removeDuplicates(codesS.trim().split("|"));
					
					
					query = query.indexOf('-') == 0 ? query.replace('-', 'NOT ') : query;
					query = query.replace(/[+]/g, ' AND ' ).replace(/[-]/g, ' AND NOT ').replace(/[/]/g, ' OR ');
					
					
					for (var i=0; i < codes.length; i++) {
						query = query.replace(new RegExp("\\b" + codes[i] + "\\b", "g"),  "(" + $scope.layout.boolExpression.replace("$1", "{<" + $scope.layout.fieldName + "={'" + codes[i] + "'}" + ">}") + ")");
					}
					
					
					return query;
								
					
					
				}
				
				
				function removeDuplicates(arr){
					let unique_array = []
					for(let i = 0;i < arr.length; i++){
						var value = arr[i].trim();
						if(unique_array.indexOf(value) == -1 && value != ""){
							unique_array.push(value)
						}
					}
					return unique_array
				}
				
				
				
			}]
		};

	} );

