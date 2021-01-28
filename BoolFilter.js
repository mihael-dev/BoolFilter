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
										label: 'Selection field name',
										expression: 'always',
										defaultValue: 'Customer'
									},	
									FieldName: {
										type: 'string',
										ref: 'fieldName',
										label: 'Search field name',
										expression: 'always',
										defaultValue: 'Product'
									},/*								
									Expression : {
										type: 'string',
										ref: 'boolExpression',
										label: 'Generated expression',
										expression: 'always',
										defaultValue: ""		
									},*/
									FieldTitel:	
									{
										type: 'string',
										ref: 'fieldTitel',
										label: 'Input field titel',
										expression: 'optional',
										defaultValue: 'Enter boolean expression:'	
									},
									DefaultExpression:	
									{
										type: 'string',
										ref: 'searchExpression',
										label: 'Search string placeholder',
										expression: 'optional',
										defaultValue: 'e.g. (123+456)/789'	
									},
									Operator_AND:	
									{
										type: 'string',
										ref: 'operator.and',
										label: 'Operator AND',
										//expression: 'always',
										defaultValue: '*',
										maxlength: 1
									},
									Operator_OR:	
									{
										type: 'string',
										ref: 'operator.or',
										label: 'Operator OR',
										//expression: 'always',
										defaultValue: '+',
										maxlength: 1	
									},
									Operator_ANDNOT:	
									{
										type: 'string',
										ref: 'operator.andnot',
										label: 'Operator AND NOT',
										//expression: 'always',
										defaultValue: "-",
										maxlength: 1
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

					let searchfieldName =  $scope.layout.fieldName;
					if (!(searchfieldName.startsWith('[') && searchfieldName.endsWith(']'))) {
						searchfieldName = '[' + searchfieldName + ']';
					}



					var query = getSelectionQuery(searchfieldName);
					
					if (query != null && query != "") { 
						
						queryWithNot = query + " AND " + "(sum({<" + searchfieldName + "=P(" + searchfieldName + ")>} 0) = 0)";
					} else {
						queryWithNot = "1=1";
					}
					
					return queryWithNot
				}
				
				function getSelectionQuery(searchfieldName) {
					var codeString = $scope.name;
					
					
					var regex_and = new RegExp('[' + $scope.layout.operator.and  + ']', "g");
					var regex_or = new RegExp('[' + $scope.layout.operator.or + ']', "g");
					var regex_andnot = new RegExp('[' + $scope.layout.operator.andnot + ']',"g");


					var boolExpression = 'count($1 ' + searchfieldName + ') > 0';

					//var codesS = codeString.replace(/[+]/g, '|').replace(/[-]/g, '|').replace(/[/]/g, '|').replace(/[(]/g, '|').replace(/[)]/g, '|').replace(/\s\s+/g, '|'); 
					
					var codesS = codeString.replace(regex_and, '|').replace(regex_andnot, '|').replace(regex_or, '|').replace(/[(]/g, '|').replace(/[)]/g, '|').replace(/\s\s+/g, '|'); 
					
					var query = codeString;
					var codes = removeDuplicates(codesS.trim().split("|"));
					
					
					query = query.indexOf('-') == 0 ? query.replace('-', 'NOT ') : query;


					//query = query.replace(/[+]/g, ' AND ' ).replace(/[-]/g, ' AND NOT ').replace(/[/]/g, ' OR ');
					query = query.replace(regex_and, ' AND ' ).replace(regex_andnot, ' AND NOT ').replace(regex_or, ' OR ');
					
				
					for (var i=0; i < codes.length; i++) {
						query = query.replace(new RegExp("\\b" + codes[i] + "\\b", "g"),  "(" + boolExpression.replace("$1", "{<" + searchfieldName + "={'" + codes[i] + "'}" + ">}") + ")");
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

