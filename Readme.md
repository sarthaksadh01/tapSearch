# Tap Search


It takes in multiple paragraphs of text, assigns a unique ID To each paragraph and stores the words to paragraph mappings on an inverted index

### Prerequisites

```
Node and Npm
```

### Installing

```
clone the repository
run npm install to install required packages
run by npm start
```

## Time Complexity

```
O(n) for insertion where n is lenght of the paragraph
O(1) for searching
```

## Api Details

```
/submit to insert new pargraphs [POST]
/search to search a word [POST]
/delete to delete all indexed documents [GET]
```

## Flow

```
Split input string to paragraphs by slpit("\n")
Insert paragraph and assign unique id
Split each word of the paragrph by split(" ");
Check if this word is already present if not save it with key=>word and value => array[id of Paragraph] if yes add this paragraph id to the already existing array
```

## example Database and sample test cases

```
input: para1 [this is a test], para2[this is test 2]

paragraph table

id1 : this is a test
id2 : this is test 2

words table

this: [id1,id2]
is  : [id1,id2]
a   : [id1]
test: [id1,id2]
2   : [id2]

search is returns

this is a test
this is test 2

search a returns

this is a test

```

## Live Demo
[Heroku Deployed](http://tap-search-sarthak.herokuapp.com/)
 

## Authors

* **Sarthak Sadh** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

