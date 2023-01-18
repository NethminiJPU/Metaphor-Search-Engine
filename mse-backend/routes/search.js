'use strict'

const express = require('express');
const router = express.Router();

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

var keywords = require("../../data/keywords.json");
var named_entities = require("../../data/named_entities.json");

router.post('/', async function (req, res) {
    var query = req.body.query;
    var query_words = query.trim().split(" ");
    var removing_query_words = [];

    var size = 100;

    var field_type = '';

    var singers_weight = 1;
    var title_weight = 1;
    var lyricist_weight = 1;
    var year_weight = 1;
    var composer_weight = 1;
    var album_weight = 1;
    var source_weight = 1;
    var targert_weight = 1;
    var range = 0;
    var sorting = 0;
    var is_inner_hits = false;

    field_type = 'cross_fields';
    query_words.forEach(word => {
    word = word.replace('ගේ', '');
    word = word.replace('යන්ගේ', '');

    //Add weight to fields according to the query words
    if (named_entities.singers_names.includes(word)) {
        singers_weight = singers_weight + 1;
    }
    if (named_entities.lyricists_names.includes(word)) {
        lyricist_weight = lyricist_weight + 1;
    }
    if (named_entities.composers_names.includes(word)) {
        composer_weight = composer_weight + 1;
    }
    if (named_entities.title_names.includes(word)) {
        title_weight = title_weight + 1;
    }
    if (named_entities.albums_names.includes(word)) {
        album_weight = album_weight + 1;
    }
    if (named_entities.source_domains.includes(word)) {
        source_weight = source_weight + 1;
    }
    if (named_entities.target_domains.includes(word)) {
        targert_weight = targert_weight + 1;
    }

    //Remove pre-defined keywords from the query words 
    if (keywords.singers.includes(word)) {
        singers_weight = singers_weight + 1;
        removing_query_words.push(word);
    }
    if (keywords.composer.includes(word)) {
        composer_weight = composer_weight + 1;
        removing_query_words.push(word);
    }
    if (keywords.album.includes(word)) {
        album_weight = album_weight + 1;
        removing_query_words.push(word);
    }
    if (keywords.lyricist.includes(word)) {
        lyricist_weight = lyricist_weight + 1;
        removing_query_words.push(word);
    }
    if (keywords.year.includes(word)) {
        year_weight = year_weight + 1;
        removing_query_words.push(word);
    }

    if (keywords.metaphor.includes(word)) {
        removing_query_words.push(word);
    }

    if (keywords.songs.includes(word)) {
        removing_query_words.push(word);
    }

    if (!isNaN(word)) {
        range = parseInt(word);
        removing_query_words.push(word);
    }
    });

    if (range == 0 && sorting > 0) {
        size = 10;
        sort_method = [{ viewCount: { order: "desc" } }];
    } else if (range > 0 || sorting > 0) {
        size = range;
        sort_method = [{ viewCount: { order: "desc" } }];
    }

    //Select relevant query according to the fields' weights
    var max = Math.max(singers_weight, title_weight, lyricist_weight, composer_weight, album_weight, year_weight)
    if (source_weight>= max || targert_weight>= max){
        is_inner_hits = true;

        //Define query for get inner hits with nested fields
        var es_query = {
                nested: {
                    path: "metaphors",
                    query: {
                    fuzzy: {
                            "metaphors.metaphor": {
                                "value": query.trim(),
                                "fuzziness": "1"
                            }
                        }
                    },
                    inner_hits: {
                        name : "matching_metaphors",
                        size: 10,
                        _source: ["metaphors.metaphor","metaphors.interpretation","metaphors.source_domain","metaphors.target_domain"]
                    }
                    
                }
            }
        var es_includes = ["singers", "title", "lyricist","lyrics", "composer", "album", "year"]
    }else{

        //Define multimatch query
        var es_query = {
                multi_match: {
                    query: query.trim(),
                    fields: [`singers^${singers_weight}`, `title^${title_weight}`, `lyricist^${lyricist_weight}`,
                    `composer^${composer_weight}`, `album^${album_weight}`, `year^${year_weight}`, `metaphors.source_domain^${source_weight}`,
                    `metaphors.target_domain^${targert_weight}`],
                    operator: "or",
                    type: field_type
                }
            }
        var es_includes = ["singers", "title", "lyricist","lyrics", "composer", "album", "year", "metaphors.metaphor", "metaphors.interpretation","metaphors.source_domain", "metaphors.target_domain"]
    }

    removing_query_words.forEach(word => {
        query = query.replace(word, '');
    });

    var index= 'song_metaphors'
    var result = await client.search({
        index,
        body: {
            _source: {
                includes: es_includes
            },
        query: es_query,
            aggs: {
                "singers_filter": {
                    terms: {
                        field: "singers.keyword",
                        size: 10
                    }
                },
                "composer_filter": {
                    terms: {
                        field: "composer.keyword",
                        size: 10
                    }
                },
                "lyricist_filter": {
                    terms: {
                        field: "lyricist.keyword",
                        size: 10
                    }
                },
                "album_filter": {
                    terms: {
                        field: "album.keyword",
                        size: 10
                    }
                }
            }
        }
       })

    //Reformat the hits with inner hits 
    if (is_inner_hits){
        result.hits.hits.forEach(hit => { 
            var metaphors = []
            var new_hit = hit.inner_hits.matching_metaphors.hits.hits[0]._source
            metaphors.push(new_hit)
            hit._source.metaphors = metaphors
            delete hit.inner_hits
        });
    }
    res.send({
        hits: result.hits.hits,
        aggs: result.aggregations
    });
});

module.exports = router;