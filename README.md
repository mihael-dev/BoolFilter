# BoolFilter


This Qlik Sense Extension enables a business user to apply more complex selection on a field. 
The prerequisite is that a 1:n or m:n relationship exists in the data model.

Example use case:
- select all customers that bought product (A AND B) AND NOT C
- select all patients that had treatment A OR (B AND C AND NOT D)  


The entered Boolean expression is transformed to a Qlik search expression and applied as selection. 

</br>

![BoolFilter.PNG](https://raw.githubusercontent.com/mihael-dev/DemoData/main/BoolFilter/BoolFilter.PNG)


</br></br>

**Configuration:**

  - "Selection field name": Field name for the selection

  - "Search field name": Field name with the attributes used in the boolean expression

  - "Input field titel": Label of the input field in the UI

  - "Search string placeholder": Placeholder in the input field that support the user 

  - "Operator AND": (default: *): Operater can be changed

  - "Operator OR": (default: +): Operater can be changed

  - "Operator AND NOT": (default: -): Operater can be changed



</br></br>

**Known Limitation**
- Limited user support for entering the boolean query. Currently a plain input field is available.





