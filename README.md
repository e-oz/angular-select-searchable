jmSelectSearchable
==========================
###Directive to select from list of objects with search input box     
It's not "typeahead", because in typeahead you can input any text in inputbox, and here you can only select from list.  

###Attributes

* **objects** - model which should contain list of objects to select from
* **ng-model** - model will be set on select
* **print-attrs** - template for output attributes of object in list, attributes should be in curly braces (for example: "{{ first_name }}: {{ mobile }}") 
* **ngChange** - if set, this function will be executed on value change event
* **variantsOrderBy** - field for sorting values
* **ngDisabled** - you can disable form by setting this variable to true
* **selectInputClass** - class will be added to select input (first input in form)
* **searchInputClass** - class will be added to search input (second input)
* **caretButtonClass** - class will be added to caret buttons
* **listLength** - length of variants list, 10 by default
* **modelField** - if set, ngModel will recieve value of object[modelField], not object
* **showSearchIcon** - show or hide search icon (live binding)

###Example
Included HTML template is an example, currently designed for Twitter Bootstrap 3.2
Usage [example in Plunker](http://plnkr.co/edit/UVzDiNZKbjDE1ZxY9hJD)

###Install
`bower install angular-select-searchable --save`

to index.html add link to js file, something like:
`<script src="bower_components/angular-select-searchable/jmSelectSearchable.js"></script>`

In app.js add dependency:
`'jm-select-searchable'`

###Improvements
Any pull-requests for improvements and optimizations are very welcomed!
