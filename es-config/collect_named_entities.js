'use strict'
const prettifiedData = require('../data/corpus.json')
var fs = require('fs');

var singers_names = [];
var lyricists_names = [];
var composers_names = [];
var albums_names = [];
var source_domains = [];
var target_domains = [];
var title_names = [];

function collect_named_entities() {
    prettifiedData.forEach(song => {
        var singers = song.singers;
        if (singers) {
            singers.forEach(singer => {
                var splits = singer.trim().split(' ');
                splits.forEach(split => {
                    if (!singers_names.includes(split.trim())) {
                        singers_names.push(split.trim());
                    }
                });
            });
        }
        var lyricists = song.lyricist;
        if (lyricists) {
            var splits = lyricists.trim().split(' ');
            splits.forEach(split => {
                if (!lyricists_names.includes(split.trim())) {
                    lyricists_names.push(split.trim());
                }
            });
        }
        var composers = song.composer;
        if (composers) {
            var splits = composers.trim().split(' ');
            splits.forEach(split => {
                if (!composers_names.includes(split.trim())) {
                    composers_names.push(split.trim());
                }
            });
        }
        var albums = song.album;
        if (albums) {
            var splits = albums.trim().split(' ');
            splits.forEach(split => {
                if (!albums_names.includes(split.trim())) {
                    albums_names.push(split.trim());
                }
            });
        }
        var metaphors = song.metaphors;
        if (metaphors) {
            metaphors.forEach(metaphor => {
                var source_domain = metaphor.source_domain
                var splits = source_domain.trim().split(' ');
                splits.forEach(split => {
                    if (!source_domains.includes(split.trim())) {
                        source_domains.push(split.trim());
                    }
                });
            });
        }
        var metaphors = song.metaphors;
        if (metaphors) {
            metaphors.forEach(metaphor => {
                var target_domain = metaphor.target_domain
                var splits = target_domain.trim().split(' ');
                splits.forEach(split => {
                    if (!target_domains.includes(split.trim())) {
                        target_domains.push(split.trim());
                    }
                });
            });
        }
        var titles = song.title;
        if (titles) {
            var splits = titles.trim().split(' ');
            splits.forEach(split => {
                if (!title_names.includes(split.trim())) {
                    title_names.push(split.trim());
                }
            });
        }
    });

    var entities = {
        singers_names,
        lyricists_names,
        composers_names,
        albums_names,
        source_domains,
        target_domains,
        title_names
    }
    var jsonentities = JSON.stringify(entities);
    var fs = require('fs');
    fs.writeFile('../data/named_entities.json', jsonentities, 'utf8', (error) => {console.log(error)});
}

collect_named_entities();