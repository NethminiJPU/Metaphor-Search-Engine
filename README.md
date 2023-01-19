# Metaphor-Search-Engine

## Overview
* This repository contains the source code for a Sinhala Metaphor Search Engine developed using ElasticSearch as the search engine, and NodeJS as the framework for the backend and Angular as the frontend web framework. 
* The corpus for search engine consists metaphors of Sinhala songs sung by the artists named, W.D.Amaradewa, Edward Jayakodi, Amarasiri Peiris, Nanda Malini, Karunarathna Divulgane and Kasun Kalhara.

## Features
* USers can search for simple word for find metaphors for it.
    * Example :
        * Search query -> "අම්මා"
        * Sample results -> "අම්මා සඳකි", "කලා වැවේ නිල් දියවර අපෙ අම්මා"
* Users can search for advanced search queries like :
    * නන්දා මාලනී ගැයූ ගීතවල ඇති රූපක
    * නන්දා මාලනී ගැයූ සහ එස්. මහින්ද හිමි ලියූ ගීතවල රූපක
    
    Then it provides relavant search results.

## Project Structure
Repository contains 4 main folders.
1. data
    * Contains original corpus, keywords and named entities  
2. es-config 
    * Contains coustomized elastic configurations 
3. mse-backend
    * Contains backend logic files and routines
4. mse-frontend
    * Contains search engine UI and support files

###  Data fields in a data hit
* Title - title of the song
* Singers - singers list for the song
* Lyricist - the writer
* Composer - the music provider
* Lyrics 
* Year
* Album
* Metaphors - Metaphors list for the song. Each metaphor is including followings.
    * Metaphor
    * Source domain
    * Target domain
    * Interpretation

## Prerequisites
* Angular - v15.1.0
* NodeJS - v18.13.0
* Elasticsearch - v8.6.0
* Kibana - v8.6.0 (if you need to view the ES database UI)


## SetUp
1. Run ElasticSearch on port 9200
2. Run Kibana instance (port 5601) if you need to view the indexes
3. Elasticsearch Configuration (Run inside es-config directory)
* `npm install`
* `node es-config.js`
4. Backend start (inside mse-backend directory)
* `npm install` 
* `npm start` 
5. Frontend start (inside mse-frontend directory) 
* `npm install`
* `ng serve` 
6. Finally, in browser -> `localhost:4200`

## Used Techniques
* Tokenization
    * ICU Tokenizer
    * Edge n-gram Tokenizer
* Stop words filtering
* Field Boosting
* Aggregations
* Nested suery queris for filter inner hits

